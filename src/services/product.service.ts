import { isNil } from "lodash"
import Product, { IProduct } from "../models/product.model"
import { createClient } from "redis"

const redisClient = createClient()
redisClient.connect().catch(console.error)

const createProductService = (data: IProduct) => {
  return new Promise(async (resolve, reject) => {
    try {
      const createProduct = await Product.create(data)

      resolve({
        status: "OK",
        message: "Product created successfully!",
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
          status: "Error",
          message: "Dont know product",
        })
        return
      }
      const updateProduct = await Product.findByIdAndUpdate(id, data, {
        new: true,
      })

      resolve({
        status: "OK",
        message: "product update successfully!",
        data: updateProduct,
      })
    } catch (e) {
      reject(e)
    }
  })
}

const detailProductService = (id: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkProduct = await Product.findById(id)
      if (!checkProduct) {
        resolve({
          status: "Error",
          message: "Dont know product",
        })
        return
      }
      resolve({
        status: "OK",
        message: "product detail successfully!",
        data: checkProduct,
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
          status: "Error",
          message: "Dont know product",
        })
        return
      }
      const deleteProduct = await Product.findByIdAndDelete(id)
      resolve({
        status: "OK",
        message: "product delete successfully!",
        data: deleteProduct,
      })
    } catch (e) {
      reject(e)
    }
  })
}

const getAllProductService = (limit: number, page: number, filter: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Tạo cache key dựa trên limit, page và filter
      const cacheKey = `products:limit=${limit}:page=${page}:filter=${filter || "all"}`

      // Kiểm tra dữ liệu trong cache
      const cachedData = await redisClient.get(cacheKey)
      if (cachedData) {
        return resolve(JSON.parse(cachedData))
      }

      // Nếu không có cache, thực hiện truy vấn MongoDB
      let query = {}
      if (filter && filter !== "") {
        query = {
          name: { $regex: filter, $options: "i" },
        }
      }

      const totalProduct = await Product.countDocuments(query)
      const allProduct = await Product.find(query)
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
      await redisClient.setEx(cacheKey, 3600, JSON.stringify(responseData))
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
