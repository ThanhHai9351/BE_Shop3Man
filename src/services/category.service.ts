import { HttpMessage, HttpStatus } from "../global/globalEnum"
import Category, { ICategory } from "../models/category.model"
import { createClient } from "redis"

const redisClient = createClient()
redisClient.connect().catch(console.error)

const getAllCategoryService = (limit: number, page: number, search: string, sortDir: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const cacheKey = `categories:limit=${limit}:page=${page}:search=${search || "all"}:sort=${sortDir}}`

      // Kiểm tra dữ liệu cache
      const cachedData = await redisClient.get(cacheKey)
      if (cachedData) {
        return resolve(JSON.parse(cachedData))
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

      const responseData = {
        status: HttpStatus.OK,
        message: HttpMessage.OK,
        data: allCategory,
        total: totalCategory,
        pageCurrent: Number(page + 1),
        totalPage: Math.ceil(totalCategory / limit),
      }

      //set thời gian sống cho cache
      await redisClient.setEx(cacheKey, 10, JSON.stringify(responseData))
      resolve(responseData)
    } catch (e) {
      reject(e)
    }
  })
}

const updateCategoryService = (id: string, data: ICategory) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkCategory = await Category.findById(id)
      if (!checkCategory) {
        resolve({
          status: HttpStatus.NOT_FOUND,
          message: "Server don't found category!",
        })
        return
      }
      const updateCategory = await Category.findByIdAndUpdate(id, data, { new: true })

      resolve({
        status: HttpStatus.OK,
        message: HttpMessage.OK,
        data: updateCategory,
      })
    } catch (e) {
      reject(e)
    }
  })
}

const createCategoryService = (data: ICategory) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { name } = data
      const checkCategory = await Category.findOne({ name })
      if (checkCategory) {
        resolve({
          status: HttpStatus.BAD_REQUEST,
          message: "Category Already Exists!",
        })
        return
      }
      const createCategory = await Category.create(data)

      resolve({
        status: HttpStatus.OK,
        message: HttpMessage.OK,
        data: createCategory,
      })
    } catch (e) {
      reject(e)
    }
  })
}

const deleteCategoryService = (id: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkCategory = await Category.findById(id)
      if (!checkCategory) {
        resolve({
          status: HttpStatus.NOT_FOUND,
          message: "Category Not Found!",
        })
        return
      }
      const deleteCategory = await Category.findByIdAndDelete(id)

      resolve({
        status: HttpStatus.OK,
        message: HttpMessage.OK,
        data: deleteCategory,
      })
    } catch (e) {
      reject(e)
    }
  })
}

const detailCategoryService = (id: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const category = await Category.findById(id)
      if (!category) {
        resolve({
          status: HttpStatus.NOT_FOUND,
          message: "Category Not Found!",
        })
      }
      resolve({
        status: HttpStatus.OK,
        message: HttpMessage.OK,
        data: category,
      })
    } catch (e) {
      reject(e)
    }
  })
}

const CategoryService = {
  getAllCategoryService,
  createCategoryService,
  updateCategoryService,
  deleteCategoryService,
  detailCategoryService,
}

export default CategoryService
