import { Request, Response } from "express"
import OrderService from "../services/order.service"
import { GlobalResponse } from "../../global/globalResponse"
import { ReasonPhrases, StatusCodes } from "http-status-codes"

const createOrder = async (req: Request, res: Response): Promise<Response> => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json(GlobalResponse(StatusCodes.UNAUTHORIZED, ReasonPhrases.UNAUTHORIZED))
    }
    const token = authHeader.split(" ")[1]

    const addressId = req.params.addressId
    if (!addressId) {
      return res.status(StatusCodes.BAD_REQUEST).json(GlobalResponse(StatusCodes.BAD_REQUEST, "Address ID is required"))
    }

    return await OrderService.createOrderService(token, addressId, res)
  } catch {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(GlobalResponse(StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR))
  }
}

const getAllOrders = async (req: Request, res: Response): Promise<Response> => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json(GlobalResponse(StatusCodes.UNAUTHORIZED, ReasonPhrases.UNAUTHORIZED))
    }
    const token = authHeader.split(" ")[1]
    const { limit, page } = req.query
    return await OrderService.getAllOrdersService(token, res, Number(limit) || 10, Number(page) || 0)
  } catch {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(GlobalResponse(StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR))
  }
}

const OrderController = {
  createOrder,
  getAllOrders,
}

export default OrderController
