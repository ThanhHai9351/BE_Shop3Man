import { ReasonPhrases } from "http-status-codes"
import { GlobalResponse } from "../../global/globalResponse"
import { StatusCodes } from "http-status-codes"
import Category, { ICategory } from "../../models/category.model"
import redisClient from "../../redis/connectRedis"
import { GlobalResponseData } from "../../global/globalResponse"
import { Response } from "express"
import slugify from "slugify"

const getAllCategoryService = async (limit: number, page: number, search: string, sortDir: string, res: Response) => {
  try {
    const cacheKey = `categories:limit=${limit}:page=${page}:search=${search || "all"}:sort=${sortDir}}`

    // Kiểm tra dữ liệu cache
    const cachedData = await redisClient.get(cacheKey)
    if (cachedData) {
      return res
        .status(StatusCodes.OK)
        .json(GlobalResponseData(StatusCodes.OK, ReasonPhrases.OK, JSON.parse(cachedData)))
    }

    let query = {}
    if (search && search !== "") {
      query = {
        name: { $regex: search, $options: "i" },
      }
    }
    const sortOrder = sortDir === "desc" ? -1 : 1

    const totalCategory = await Category.countDocuments(query)
    const allCategory = await Category.find(query)
      .sort({ name: sortOrder })
      .limit(limit)
      .skip(limit * page)
      .sort({ createdAt: -1 })

    const responseData = {
      data: allCategory,
      total: totalCategory,
      pageCurrent: Number(page + 1),
      totalPage: Math.ceil(totalCategory / limit),
    }

    //set thời gian sống cho cache
    await redisClient.setEx(cacheKey, 10, JSON.stringify(responseData))

    return res.status(StatusCodes.OK).json(GlobalResponseData(StatusCodes.OK, ReasonPhrases.OK, responseData))
  } catch {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(GlobalResponse(StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR))
  }
}

const updateCategoryService = async (id: string, data: Omit<ICategory, "slug" | "_id">, res: Response) => {
  try {
    const checkCategory = await Category.findById(id)
    if (!checkCategory) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(GlobalResponse(StatusCodes.NOT_FOUND, "Server Don't Found Category!"))
    }
    const slug = slugify(data.name, {
      lower: true,
      strict: true,
      trim: true,
    })
    const updateCategory = await Category.findByIdAndUpdate(id, { ...data, slug }, { new: true })

    return res.status(StatusCodes.OK).json(GlobalResponseData(StatusCodes.OK, ReasonPhrases.OK, updateCategory))
  } catch {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(GlobalResponse(StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR))
  }
}

const createCategoryService = async (data: Omit<ICategory, "slug" | "_id">, res: Response) => {
  try {
    const { name } = data
    const checkCategory = await Category.findOne({ name: { $regex: new RegExp(`^${name}$`, "i") } })
    if (checkCategory) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(GlobalResponse(StatusCodes.BAD_REQUEST, "Category Already Exists!"))
    }
    const slug = slugify(name, {
      lower: true,
      strict: true,
      trim: true,
    })
    const createCategory = await Category.create({ ...data, slug })

    return res.status(StatusCodes.OK).json(GlobalResponseData(StatusCodes.OK, ReasonPhrases.OK, createCategory))
  } catch {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(GlobalResponse(StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR))
  }
}

const deleteCategoryService = async (id: string, res: Response) => {
  try {
    const checkCategory = await Category.findById(id)
    if (!checkCategory) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(GlobalResponse(StatusCodes.NOT_FOUND, "Server Don't Found Category!"))
    }
    const deleteCategory = await Category.findByIdAndDelete(id)

    return res.status(StatusCodes.OK).json(GlobalResponseData(StatusCodes.OK, ReasonPhrases.OK, deleteCategory))
  } catch {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(GlobalResponse(StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR))
  }
}

const detailCategoryService = async (id: string, res: Response) => {
  try {
    const category = await Category.findById(id)
    if (!category) {
      return res.status(StatusCodes.NOT_FOUND).json(GlobalResponse(StatusCodes.NOT_FOUND, "Category Not Found!"))
    }
    return res.status(StatusCodes.OK).json(GlobalResponseData(StatusCodes.OK, ReasonPhrases.OK, category))
  } catch {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(GlobalResponse(StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR))
  }
}

const CategoryService = {
  getAllCategoryService,
  createCategoryService,
  updateCategoryService,
  deleteCategoryService,
  detailCategoryService,
}

export default CategoryService
