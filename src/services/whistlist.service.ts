import { HttpMessage, HttpStatus } from "../global/globalEnum"
import Product from "../models/product.model"
import Whistlist, { IWhistlist } from "../models/whistlist.model"
import { JwtPayloadReturn, JwtProvider } from "../providers/jwt-provider"

const addToWhistlistService = (data: { productId: string }, token: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const dataUser: JwtPayloadReturn | null = await JwtProvider.verifyToken(token, process.env.ACCESS_TOKEN!)
      if (!dataUser) {
        resolve({
          status: HttpStatus.BAD_REQUEST,
          message: "Token isvalid! Not found User!",
        })
        return
      }
      const checkProduct = await Product.findById(data.productId)
      if (!checkProduct) {
        resolve({
          status: HttpStatus.NOT_FOUND,
          message: "Server Don't Found Product!",
        })
        return
      }

      const checkWhistlist = await Whistlist.find({ userId: dataUser._id, "product._id": checkProduct._id })
      if (checkWhistlist.length > 0) {
        resolve({
          status: HttpStatus.BAD_REQUEST,
          message: "Product has whistlist",
        })
        return
      }

      const whistlistData: IWhistlist = {
        product: checkProduct,
        userId: Object(dataUser._id),
      }

      const addWishlist = await Whistlist.create(whistlistData)
      resolve({
        status: HttpStatus.OK,
        message: HttpMessage.OK,
        data: addWishlist,
      })
    } catch (e) {
      reject(e)
    }
  })
}

const removeToWhistlistService = (data: { productId: string }, token: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const dataUser: JwtPayloadReturn | null = await JwtProvider.verifyToken(token, process.env.ACCESS_TOKEN!)
      if (!dataUser) {
        resolve({
          status: HttpStatus.BAD_REQUEST,
          message: "Token isvalid! Not found User!",
        })
        return
      }
      const checkProduct = await Product.findById(data.productId)
      if (!checkProduct) {
        resolve({
          status: HttpStatus.NOT_FOUND,
          message: "Server Don't Found Product!",
        })
        return
      }
      const checkWhistlist: IWhistlist | any = await Whistlist.find({
        userId: dataUser._id,
        "product._id": checkProduct._id,
      })
      const removeWhistlist = await Whistlist.findByIdAndDelete(checkWhistlist[0]._id)
      resolve({
        status: HttpStatus.OK,
        message: HttpMessage.OK,
        data: removeWhistlist,
      })
    } catch (e) {
      reject(e)
    }
  })
}

const getWhistlistService = (
  token: string,
  limit: number,
  page: number,
  search?: string,
  sortDir?: string,
  priceFrom?: number,
  priceTo?: number,
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const dataUser: JwtPayloadReturn | null = await JwtProvider.verifyToken(token, process.env.ACCESS_TOKEN!)
      if (!dataUser) {
        resolve({
          status: HttpStatus.BAD_REQUEST,
          message: "Invalid token! User not found!",
        })
        return
      }
      let query: any = { userId: dataUser._id }
      if (search && search.trim() !== "") {
        query["product.name"] = { $regex: search, $options: "i" }
      }
      if (priceFrom !== undefined || priceTo !== undefined) {
        query["product.price"] = {}
        if (priceFrom !== undefined) query["product.price"].$gte = priceFrom
        if (priceTo !== undefined) query["product.price"].$lte = priceTo
      }

      const sortOrder = sortDir === "desc" ? -1 : sortDir === "asc" ? 1 : undefined
      const totalWhistlist = await Whistlist.countDocuments(query)
      const rawWhistlist = await Whistlist.find(query)
        .sort(sortOrder ? { "product.price": sortOrder } : {})
        .limit(limit)
        .skip(limit * page)

      resolve({
        status: HttpStatus.OK,
        message: HttpMessage.OK,
        data: rawWhistlist,
        total: totalWhistlist,
        pageCurrent: page + 1,
        totalPage: Math.ceil(totalWhistlist / limit),
      })
    } catch (error) {
      reject(error)
    }
  })
}

const WhistlistService = {
  addToWhistlistService,
  getWhistlistService,
  removeToWhistlistService,
}

export default WhistlistService
