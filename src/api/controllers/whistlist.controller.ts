import { Request, Response } from "express"
import WhistlistService from "../services/whistlist.service"
import { DTOWhistlist } from "../../dto/whistlist.dto"
import { GlobalResponse } from "../../global/globalResponse"
import { StatusCodes, ReasonPhrases } from "http-status-codes"

const addToWhistlist = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { error, value } = DTOWhistlist(req.body)

    if (error) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(GlobalResponse(StatusCodes.BAD_REQUEST, error.details?.[0]?.message || "Invalid data"))
    }

    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json(GlobalResponse(StatusCodes.UNAUTHORIZED, ReasonPhrases.UNAUTHORIZED))
    }
    const token = authHeader.split(" ")[1]

    return await WhistlistService.addToWhistlistService(value, token, res)
  } catch {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(GlobalResponse(StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR))
  }
}

const removeToWhistlist = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { error, value } = DTOWhistlist(req.body)

    if (error) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(GlobalResponse(StatusCodes.BAD_REQUEST, error.details?.[0]?.message || "Invalid data"))
    }

    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json(GlobalResponse(StatusCodes.UNAUTHORIZED, ReasonPhrases.UNAUTHORIZED))
    }
    const token = authHeader.split(" ")[1]

    return await WhistlistService.removeToWhistlistService(value, token, res)
  } catch {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(GlobalResponse(StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR))
  }
}

const getWhistlist = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { limit, page, search, sortDir, priceFrom, priceTo } = req.query
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json(GlobalResponse(StatusCodes.UNAUTHORIZED, ReasonPhrases.UNAUTHORIZED))
    }
    const token = authHeader.split(" ")[1]

    return await WhistlistService.getWhistlistService(
      token,
      Number(limit) || 10,
      Number(page) || 0,
      res,
      (search as string) || "",
      (sortDir as string) || "",
      priceFrom ? Number(priceFrom) : undefined,
      priceTo ? Number(priceTo) : undefined,
    )
  } catch {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(GlobalResponse(StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR))
  }
}
const WhistlistController = { addToWhistlist, getWhistlist, removeToWhistlist }

export default WhistlistController
