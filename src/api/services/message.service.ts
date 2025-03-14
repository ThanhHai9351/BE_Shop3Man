import { ReasonPhrases, StatusCodes } from "http-status-codes"
import Message from "../../models/message.model"
import { GlobalResponse, GlobalResponseData } from "../../global/globalResponse"
import { Response } from "express"

const getMessages = async (conversationId: string, res: Response): Promise<Response> => {
  try {
    const messages = await Message.find({ conversationId })

    return res.status(StatusCodes.OK).json(GlobalResponseData(StatusCodes.OK, ReasonPhrases.OK, messages))
  } catch {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(GlobalResponse(StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR))
  }
}

const MessageService = { getMessages }

export default MessageService
