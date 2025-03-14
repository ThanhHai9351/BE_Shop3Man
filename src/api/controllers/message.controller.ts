import { StatusCodes } from "http-status-codes"
import { ReasonPhrases } from "http-status-codes"
import MessageService from "../services/message.service"
import { GlobalResponse } from "../../global/globalResponse"
import { Request, Response } from "express"

const getMessages = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { conversationId } = req.params
    if (!conversationId) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(GlobalResponse(StatusCodes.BAD_REQUEST, ReasonPhrases.BAD_REQUEST))
    }
    return await MessageService.getMessages(conversationId, res)
  } catch {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(GlobalResponse(StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR))
  }
}

const MessageController = {
  getMessages,
}

export default MessageController
