import { Response } from "express"
import { ReasonPhrases } from "http-status-codes"
import { StatusCodes } from "http-status-codes"
import { JwtProvider } from "../../providers/jwt-provider"
import { GlobalResponse, GlobalResponseData } from "../../global/globalResponse"
import UserAddress, { IUserAddress } from "../../models/user-address.model"

const createAddressService = async (token: string, value: Omit<IUserAddress, "userId">, res: Response) => {
  try {
    const data: any = await JwtProvider.verifyToken(token, process.env.ACCESS_TOKEN!)
    if (!data) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json(GlobalResponse(StatusCodes.UNAUTHORIZED, ReasonPhrases.UNAUTHORIZED))
    }
    const addressCheck = await UserAddress.findOne({
      userId: data.id,
      city: value.city,
      district: value.district,
      street: value.street,
    })
    if (addressCheck) {
      return res.status(StatusCodes.BAD_REQUEST).json(GlobalResponse(StatusCodes.BAD_REQUEST, "Address already exists"))
    }
    const address = await UserAddress.create({
      userId: data._id,
      city: value.city,
      district: value.district,
      street: value.street,
    })
    return res.status(StatusCodes.CREATED).json(GlobalResponseData(StatusCodes.CREATED, ReasonPhrases.CREATED, address))
  } catch {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(GlobalResponse(StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR))
  }
}

const getAllAddressService = async (token: string, res: Response) => {
  try {
    const data: any = await JwtProvider.verifyToken(token, process.env.ACCESS_TOKEN!)
    if (!data) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json(GlobalResponse(StatusCodes.UNAUTHORIZED, ReasonPhrases.UNAUTHORIZED))
    }

    if (!data._id) {
      console.error("User ID not found in token data:", data)
      return res.status(StatusCodes.BAD_REQUEST).json(GlobalResponse(StatusCodes.BAD_REQUEST, "Invalid user data"))
    }

    const address = await UserAddress.find({ userId: data._id }).sort({ createdAt: -1 })
    return res.status(StatusCodes.OK).json(GlobalResponseData(StatusCodes.OK, ReasonPhrases.OK, address))
  } catch {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(GlobalResponse(StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR))
  }
}

const deleteAddressService = async (token: string, id: string, res: Response) => {
  try {
    const data: any = await JwtProvider.verifyToken(token, process.env.ACCESS_TOKEN!)
    if (!data) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json(GlobalResponse(StatusCodes.UNAUTHORIZED, ReasonPhrases.UNAUTHORIZED))
    }
    const address = await UserAddress.findByIdAndDelete(id)
    if (!address) {
      return res.status(StatusCodes.NOT_FOUND).json(GlobalResponse(StatusCodes.NOT_FOUND, "Address not found"))
    }
    return res.status(StatusCodes.OK).json(GlobalResponseData(StatusCodes.OK, ReasonPhrases.OK, address))
  } catch {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(GlobalResponse(StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR))
  }
}

const UserAddressService = { createAddressService, getAllAddressService, deleteAddressService }

export default UserAddressService
