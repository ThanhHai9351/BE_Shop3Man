import { ReasonPhrases, StatusCodes } from "http-status-codes"
import Product from "../../models/product.model"
import Whistlist, { IWhistlist } from "../../models/whistlist.model"
import { JwtPayloadReturn, JwtProvider } from "../../providers/jwt-provider"
import { GlobalResponse, GlobalResponseData } from "../../global/globalResponse"
import { Response } from "express"

const addToWhistlistService = async (data: { productId: string }, token: string, res: Response) => {
  try {
    const dataUser: JwtPayloadReturn | null = await JwtProvider.verifyToken(token, process.env.ACCESS_TOKEN!)
    if (!dataUser) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(GlobalResponse(StatusCodes.BAD_REQUEST, "Token isvalid! Not found User!"))
    }
    const checkProduct = await Product.findById(data.productId)
    if (!checkProduct) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(GlobalResponse(StatusCodes.NOT_FOUND, "Server Don't Found Product!"))
    }

    const checkWhistlist = await Whistlist.find({ userId: dataUser._id, "product._id": checkProduct._id })
    if (checkWhistlist.length > 0) {
      return res.status(StatusCodes.BAD_REQUEST).json(GlobalResponse(StatusCodes.BAD_REQUEST, "Product has whistlist"))
    }

    const whistlistData: IWhistlist = {
      product: checkProduct,
      userId: Object(dataUser._id),
    }

    const addWishlist = await Whistlist.create(whistlistData)
    return res.status(StatusCodes.OK).json(GlobalResponseData(StatusCodes.OK, ReasonPhrases.OK, addWishlist))
  } catch {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(GlobalResponse(StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR))
  }
}

const removeToWhistlistService = async (data: { productId: string }, token: string, res: Response) => {
  try {
    const dataUser: JwtPayloadReturn | null = await JwtProvider.verifyToken(token, process.env.ACCESS_TOKEN!)
    if (!dataUser) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(GlobalResponse(StatusCodes.BAD_REQUEST, "Token isvalid! Not found User!"))
    }
    const checkProduct = await Product.findById(data.productId)
    if (!checkProduct) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(GlobalResponse(StatusCodes.NOT_FOUND, "Server Don't Found Product!"))
    }
    const checkWhistlist: IWhistlist | any = await Whistlist.find({
      userId: dataUser._id,
      "product._id": checkProduct._id,
    })
    const removeWhistlist = await Whistlist.findByIdAndDelete(checkWhistlist[0]._id)
    return res.status(StatusCodes.OK).json(GlobalResponseData(StatusCodes.OK, ReasonPhrases.OK, removeWhistlist))
  } catch {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(GlobalResponse(StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR))
  }
}

const getWhistlistService = async (
  token: string,
  limit: number,
  page: number,
  res: Response,
  search?: string,
  sortDir?: string,
  priceFrom?: number,
  priceTo?: number,
) => {
  try {
    const dataUser: JwtPayloadReturn | null = await JwtProvider.verifyToken(token, process.env.ACCESS_TOKEN!)
    if (!dataUser) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(GlobalResponse(StatusCodes.BAD_REQUEST, "Invalid token! User not found!"))
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
      .sort({ createdAt: -1 })

    return res.status(StatusCodes.OK).json(
      GlobalResponseData(StatusCodes.OK, ReasonPhrases.OK, {
        data: rawWhistlist,
        total: totalWhistlist,
        pageCurrent: page + 1,
        totalPage: Math.ceil(totalWhistlist / limit),
      }),
    )
  } catch {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(GlobalResponse(StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR))
  }
}

const WhistlistService = {
  addToWhistlistService,
  getWhistlistService,
  removeToWhistlistService,
}

export default WhistlistService
