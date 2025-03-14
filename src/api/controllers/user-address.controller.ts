import { Request, Response } from "express"
import { DTOCreateAddress } from "../../dto/user-address.dto"
import { ReasonPhrases, StatusCodes } from "http-status-codes"
import { GlobalResponse } from "../../global/globalResponse"
import UserAddressService from "../services/user-address.service"

const createAddress = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { error, value } = DTOCreateAddress(req.body)
    if (error) {
      return res.status(StatusCodes.BAD_REQUEST).json(GlobalResponse(StatusCodes.BAD_REQUEST, error.message))
    }
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json(GlobalResponse(StatusCodes.UNAUTHORIZED, ReasonPhrases.UNAUTHORIZED))
    }
    const token = authHeader.split(" ")[1]
    return await UserAddressService.createAddressService(token, value, res)
  } catch {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(GlobalResponse(StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR))
  }
}

const getAllAddress = async (req: Request, res: Response): Promise<Response> => {
  console.log('vao day');
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json(GlobalResponse(StatusCodes.UNAUTHORIZED, ReasonPhrases.UNAUTHORIZED))
    }
    const token = authHeader.split(" ")[1]
    return await UserAddressService.getAllAddressService(token, res)
  } catch {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(GlobalResponse(StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR))
  }
}

const deleteAddress = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json(GlobalResponse(StatusCodes.UNAUTHORIZED, ReasonPhrases.UNAUTHORIZED))
    }
    const token = authHeader.split(" ")[1]
    return await UserAddressService.deleteAddressService(token, id, res)
  } catch {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(GlobalResponse(StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR))
  }
}

const UserAddressController = { createAddress, getAllAddress, deleteAddress }

export default UserAddressController
