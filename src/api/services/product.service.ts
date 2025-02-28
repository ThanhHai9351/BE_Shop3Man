import mongoose from "mongoose"
import Category, { ICategory } from "../../models/category.model"
import ProductVariant from "../../models/product-variant.model"
import Product, { IProduct } from "../../models/product.model"
import redisClient from "../../redis/connectRedis"
import { GlobalResponse, GlobalResponseData } from "../../global/globalResponse"
import { ReasonPhrases, StatusCodes } from "http-status-codes"
import slugify from "slugify"
import { Response } from "express"
import { JwtPayloadReturn, JwtProvider } from "../../providers/jwt-provider"
import Whistlist from "../../models/whistlist.model"

const createProductService = async (data: IProduct, res: Response) => {
  try {
    const { categoryId, name } = data
    const checkCategory = await Category.findById(categoryId)
    if (!checkCategory) {
      return res.status(StatusCodes.NOT_FOUND).json(GlobalResponse(StatusCodes.NOT_FOUND, "CategoryId isvalid!"))
    }
    const checkProduct = await Product.findOne({ name })
    if (checkProduct) {
      return res.status(StatusCodes.BAD_REQUEST).json(GlobalResponse(StatusCodes.BAD_REQUEST, "Product is exist!"))
    }
    const slug = slugify(data.name, {
      lower: true,
      strict: true,
      trim: true,
    })
    const createProduct = await Product.create({ ...data, slug })

    return res
      .status(StatusCodes.CREATED)
      .json(GlobalResponseData(StatusCodes.CREATED, ReasonPhrases.CREATED, createProduct))
  } catch {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(GlobalResponse(StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR))
  }
}

const updateProductService = async (id: string, data: Omit<IProduct, "slug" | "_id">, res: Response) => {
  try {
    const checkProduct = await Product.findById(id)
    if (!checkProduct) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(GlobalResponse(StatusCodes.NOT_FOUND, "Server Don't Found Product!"))
    }
    const slug = slugify(data.name, {
      lower: true,
      strict: true,
      trim: true,
    })
    const updateProduct = await Product.findByIdAndUpdate(
      id,
      { ...data, slug },
      {
        new: true,
      },
    )

    return res.status(StatusCodes.OK).json(GlobalResponseData(StatusCodes.OK, ReasonPhrases.OK, updateProduct))
  } catch {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(GlobalResponse(StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR))
  }
}

interface IDetailProduct extends IProduct {
  category: ICategory
  items: {
    _id: string // size
    items: {
      _id: string
      color: string
      stockQuantity: number
      price: number
      createdAt: Date
      updatedAt: Date
    }[]
  }[]
  isWhistlisted: boolean
}

const detailProductService = async (slug: string, token: string, res: Response) => {
  try {
    const checkProduct = await Product.findOne({ slug }).lean()
    if (!checkProduct) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(GlobalResponse(StatusCodes.NOT_FOUND, "Server Don't Found Product!"))
    }
    const isWhistlisted = await handleCheckIsWhistlisted(token, checkProduct._id)
    const categoryFilter = await Category.findById(checkProduct.categoryId)
    const productVariantsGroupedBySize = await ProductVariant.aggregate([
      {
        $match: { productId: new mongoose.Types.ObjectId(checkProduct._id) },
      },
      {
        $group: {
          _id: "$size",
          items: {
            $push: {
              _id: "$_id",
              color: "$color",
              stockQuantity: "$stockQuantity",
              price: "$price",
              createdAt: "$createdAt",
              updatedAt: "$updatedAt",
            },
          },
        },
      },
    ])

    const dataProduct: IDetailProduct = {
      ...checkProduct,
      category: categoryFilter as any,
      items: productVariantsGroupedBySize,
      isWhistlisted: isWhistlisted,
    }

    return res.status(StatusCodes.OK).json(GlobalResponseData(StatusCodes.OK, ReasonPhrases.OK, dataProduct))
  } catch {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(GlobalResponse(StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR))
  }
}

const handleCheckIsWhistlisted = async (token: string, productId: string) => {
  if (token) {
    const dataUser: JwtPayloadReturn | null = await JwtProvider.verifyToken(token, process.env.ACCESS_TOKEN!)
    if (!dataUser) {
      return false
    }
    const checkWhistlist = await Whistlist.findOne({
      userId: dataUser._id,
      "product._id": productId,
    })
    return checkWhistlist ? true : false
  }
  return false
}

const deleteProductService = async (id: string, res: Response) => {
  try {
    const checkProduct = await Product.findById(id)
    if (!checkProduct) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(GlobalResponse(StatusCodes.NOT_FOUND, "Server Don't Found Product!"))
    }
    const deleteProduct = await Product.findByIdAndDelete(id)
    return res.status(StatusCodes.OK).json(GlobalResponseData(StatusCodes.OK, ReasonPhrases.OK, deleteProduct))
  } catch {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(GlobalResponse(StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR))
  }
}

const getAllProductService = async (
  limit: number,
  page: number,
  search: string,
  sortDir: string,
  categorySlug: string,
  res: Response,
  priceFrom?: number,
  priceTo?: number,
) => {
  try {
    // Tạo cache key dựa trên limit, page và search
    const cacheKey = `products:limit=${limit}:page=${page}:search=${search || "all"}:sort=${sortDir}:priceFrom=${priceFrom || 0}:priceTo=${priceTo || "max"}:categorySlug=${categorySlug || "all"}`

    // Kiểm tra dữ liệu trong cache
    const cachedData = await redisClient.get(cacheKey)
    if (cachedData) {
      return res
        .status(StatusCodes.OK)
        .json(GlobalResponseData(StatusCodes.OK, ReasonPhrases.OK, JSON.parse(cachedData)))
    }

    // Nếu không có cache, thực hiện truy vấn MongoDB
    let query: any = {}
    if (search && search !== "") {
      query.name = { $regex: search, $options: "i" }
    }
    if (priceFrom !== undefined || priceTo !== undefined) {
      query.price = {}
      if (priceFrom !== undefined) query.price.$gte = priceFrom
      if (priceTo !== undefined) query.price.$lte = priceTo
    }
    if (categorySlug !== "") {
      try {
        const categoryExists = await Category.findOne({ slug: categorySlug })
        if (!categoryExists) {
          return res
            .status(StatusCodes.BAD_REQUEST)
            .json(GlobalResponse(StatusCodes.BAD_REQUEST, "Invalid categorySlug"))
        }
        query.categoryId = categoryExists._id
      } catch {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json(GlobalResponse(StatusCodes.BAD_REQUEST, "Invalid categorySlug format"))
      }
    }

    const sortOrder = sortDir === "desc" ? -1 : sortDir === "asc" ? 1 : undefined

    const totalProduct = await Product.countDocuments(query)
    const allProduct = await Product.find(query)
      .sort(sortOrder ? { price: sortOrder } : {})
      .limit(limit)
      .skip(limit * page)
      .sort({ createdAt: -1 })

    const responseData = {
      data: allProduct,
      total: totalProduct,
      pageCurrent: page + 1,
      totalPage: Math.ceil(totalProduct / limit),
    }

    // Lưu dữ liệu vào Redis với TTL là 1 giờ (3600 giây)
    await redisClient.setEx(cacheKey, 60, JSON.stringify(responseData))
    return res.status(StatusCodes.OK).json(GlobalResponseData(StatusCodes.OK, ReasonPhrases.OK, responseData))
  } catch {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(GlobalResponse(StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR))
  }
}

const ProductService = {
  createProductService,
  updateProductService,
  detailProductService,
  deleteProductService,
  getAllProductService,
}

export default ProductService
