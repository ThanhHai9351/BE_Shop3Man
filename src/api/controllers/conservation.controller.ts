import { StatusCodes } from "http-status-codes"
import { ReasonPhrases } from "http-status-codes"
import { GlobalResponse } from "../../global/globalResponse"
import ConservationService from "../services/conservation.service"
import { Request, Response } from "express"

const createConversation = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params
    if (!userId) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(GlobalResponse(StatusCodes.BAD_REQUEST, ReasonPhrases.BAD_REQUEST))
    }
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json(GlobalResponse(StatusCodes.UNAUTHORIZED, ReasonPhrases.UNAUTHORIZED))
    }
    const token = authHeader.split(" ")[1]
    return await ConservationService.createConversation(userId, token, res)
  } catch {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(GlobalResponse(StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR))
  }
}

const getConversation = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json(GlobalResponse(StatusCodes.UNAUTHORIZED, ReasonPhrases.UNAUTHORIZED))
    }
    const token = authHeader.split(" ")[1]
    return await ConservationService.getConversation(token, res)
  } catch {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(GlobalResponse(StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR))
  }
}

const ConservationController = { createConversation, getConversation }

export default ConservationController
