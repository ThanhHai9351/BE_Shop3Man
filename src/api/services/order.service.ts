import { ReasonPhrases, StatusCodes } from "http-status-codes"
import { GlobalResponse, GlobalResponseData } from "../../global/globalResponse"
import Order, { EPayment, EStatus } from "../../models/order.model"
import { JwtProvider } from "../../providers/jwt-provider"
import { Response } from "express"
import Cart from "../../models/cart.model"
import Address from "../../models/user-address.model"

const createOrderService = async (token: string, addressId: string, res: Response) => {
  try {
    const data: any = await JwtProvider.verifyToken(token, process.env.ACCESS_TOKEN!)
    if (!data) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json(GlobalResponse(StatusCodes.UNAUTHORIZED, "Invalid token or user not found"))
    }

    const addressCheck = await Address.findById(addressId)
    if (!addressCheck) {
      return res.status(StatusCodes.BAD_REQUEST).json(GlobalResponse(StatusCodes.BAD_REQUEST, "Address not found"))
    }

    const allCart = await Cart.find({ userId: data._id })
    const order = await Order.create({
      userId: data._id,
      items: allCart,
      quantity_item: allCart.length,
      totalMoney: allCart.reduce((acc, curr) => acc + curr.price, 0),
      address: { city: addressCheck.city, district: addressCheck.district, street: addressCheck.street },
      paymentMethod: EPayment.VNPAY,
      status: EStatus.PENDING,
      paidAt: new Date(),
    })

    return res.status(StatusCodes.OK).json(GlobalResponseData(StatusCodes.OK, ReasonPhrases.OK, order))
  } catch (error) {
    console.error(error)
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(GlobalResponse(StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR))
  }
}

export const handleChangeStatusOrder = async (orderId: string, status: EStatus) => {
  try {
    await Order.findByIdAndUpdate(orderId, { status }, { new: true })
    return true
  } catch {
    return false
  }
}

const getAllOrdersService = async (token: string, res: Response, limit: number, page: number) => {
  try {
    const data: any = await JwtProvider.verifyToken(token, process.env.ACCESS_TOKEN!)
    const orders = await Order.find({ userId: data._id })
      .skip(limit * page)
      .limit(limit)
      .sort({ createdAt: -1 })
    const total = await Order.countDocuments({ userId: data._id })
    const dataResponse = {
      data: orders,
      total: total,
      pageCurrent: page + 1,
      totalPage: Math.ceil(total / limit),
    }
    return res.status(StatusCodes.OK).json(GlobalResponseData(StatusCodes.OK, ReasonPhrases.OK, dataResponse))
  } catch {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(GlobalResponse(StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR))
  }
}

const OrderService = {
  createOrderService,
  getAllOrdersService,
}

export default OrderService
