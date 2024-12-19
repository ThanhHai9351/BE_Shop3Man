import mongoose from "mongoose"
import { HttpMessage, HttpStatus } from "../global/globalEnum"
import Category, { ICategory } from "../models/category.model"
import ProductVariant from "../models/product-variant.model"
import Product, { IProduct } from "../models/product.model"
import redisClient from "../redis/connectRedis"

const createProductService = (data: IProduct) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { categoryId } = data
      const checkCategory = await Category.findById(categoryId)
      if (!checkCategory) {
        resolve({
          status: HttpStatus.NOT_FOUND,
          message: "CategoryId isvalid!",
        })
      }
      const createProduct = await Product.create(data)

      resolve({
        status: HttpStatus.OK,
        message: HttpMessage.OK,
        data: createProduct,
      })
    } catch (e) {
      reject(e)
    }
  })
}

const updateProductService = (id: string, data: IProduct) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkProduct = await Product.findById(id)
      if (!checkProduct) {
        resolve({
          status: HttpStatus.NOT_FOUND,
          message: "Server Don't Found Product!",
        })
        return
      }
      const updateProduct = await Product.findByIdAndUpdate(id, data, {
        new: true,
      })

      resolve({
        status: HttpStatus.OK,
        message: HttpMessage.OK,
        data: updateProduct,
      })
    } catch (e) {
      reject(e)
    }
  })
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
}

const detailProductService = (slug: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkProduct = await Product.findOne({ slug }).lean()
      if (!checkProduct) {
        resolve({
          status: HttpStatus.NOT_FOUND,
          message: "Server Don't Found Product!",
        })
        return
      }
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
      }

      resolve({
        status: HttpStatus.OK,
        message: HttpMessage.OK,
        data: dataProduct,
      })
    } catch (e) {
      reject(e)
    }
  })
}

const deleteProductService = (id: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkProduct = await Product.findById(id)
      if (!checkProduct) {
        resolve({
          status: HttpStatus.NOT_FOUND,
          message: "Server Don't Found Product!",
        })
        return
      }
      const deleteProduct = await Product.findByIdAndDelete(id)
      resolve({
        status: HttpStatus.OK,
        message: HttpMessage.OK,
        data: deleteProduct,
      })
    } catch (e) {
      reject(e)
    }
  })
}

const getAllProductService = (
  limit: number,
  page: number,
  filter?: string,
  sortDir?: string,
  priceFrom?: number,
  priceTo?: number,
) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Tạo cache key dựa trên limit, page và filter
      const cacheKey = `products:limit=${limit}:page=${page}:filter=${filter || "all"}:sort=${sortDir}:priceFrom=${priceFrom || 0}:priceTo=${priceTo || "max"}`

      // Kiểm tra dữ liệu trong cache
      const cachedData = await redisClient.get(cacheKey)
      if (cachedData) {
        return resolve(JSON.parse(cachedData))
      }

      // Nếu không có cache, thực hiện truy vấn MongoDB
      let query: any = {}
      if (filter && filter !== "") {
        query = {
          name: { $regex: filter, $options: "i" },
        }
      }
      if (priceFrom !== undefined || priceTo !== undefined) {
        query.price = {}
        if (priceFrom !== undefined) query.price.$gte = priceFrom
        if (priceTo !== undefined) query.price.$lte = priceTo
      }

      const sortOrder = sortDir === "desc" ? -1 : sortDir === "asc" ? 1 : undefined

      const totalProduct = await Product.countDocuments(query)
      const allProduct = await Product.find(query)
        .sort(sortOrder ? { price: sortOrder } : {})
        .limit(limit)
        .skip(limit * page)

      const responseData = {
        status: "OK",
        message: "GET ALL PRODUCTS COMPLETE!",
        data: allProduct,
        total: totalProduct,
        pageCurrent: page + 1,
        totalPage: Math.ceil(totalProduct / limit),
      }

      // Lưu dữ liệu vào Redis với TTL là 1 giờ (3600 giây)
      await redisClient.setEx(cacheKey, 10, JSON.stringify(responseData))
      resolve(responseData)
    } catch (e) {
      reject(e)
    }
  })
}

const ProductService = {
  createProductService,
  updateProductService,
  detailProductService,
  deleteProductService,
  getAllProductService,
}

export default ProductService
