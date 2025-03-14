import { GlobalResponseData } from "../../global/globalResponse"
import { ReasonPhrases } from "http-status-codes"
import { GlobalResponse } from "../../global/globalResponse"
import { StatusCodes } from "http-status-codes"
import { Response } from "express"
import User from "../../models/user.model"
import Conservation, { ConversationType } from "../../models/conversation.model"
import { JwtProvider } from "../../providers/jwt-provider"

const createConversation = async (userId: string, token: string, res: Response) => {
  try {
    const data: any = await JwtProvider.verifyToken(token, process.env.ACCESS_TOKEN!)
    if (!data) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(GlobalResponse(StatusCodes.BAD_REQUEST, "Token invalid! Not found User!"))
    }
    const checkUser = await User.findById(userId)
    if (!checkUser) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(GlobalResponse(StatusCodes.BAD_REQUEST, ReasonPhrases.BAD_REQUEST))
    }
    const checkConservation = await Conservation.findOne({ members: { $all: [checkUser._id, data._id] } })
    if (checkConservation) {
      return res.status(StatusCodes.OK).json(GlobalResponseData(StatusCodes.OK, ReasonPhrases.OK, checkConservation))
    }
    const conservation = await Conservation.create({
      type: ConversationType.ONE_TO_ONE,
      name: `${checkUser.firstName} ${checkUser.lastName}-${data.firstName} ${data.lastName}`,
      members: [checkUser._id, data._id],
    })

    return res
      .status(StatusCodes.CREATED)
      .json(GlobalResponseData(StatusCodes.CREATED, ReasonPhrases.CREATED, conservation))
  } catch {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(GlobalResponse(StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR))
  }
}

const getConversation = async (token: string, res: Response) => {
  try {
    const data: any = await JwtProvider.verifyToken(token, process.env.ACCESS_TOKEN!)
    if (!data) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(GlobalResponse(StatusCodes.BAD_REQUEST, "Token invalid! Not found User!"))
    }
    const conservation = await Conservation.find({ members: { $in: [data._id] } }).sort({ updatedAt: -1 })
    return res.status(StatusCodes.OK).json(GlobalResponseData(StatusCodes.OK, ReasonPhrases.OK, conservation))
  } catch {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(GlobalResponse(StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR))
  }
}

export const updateConversationFuction = async (conversationId: string, lastMessage: string) => {
  try {
    await Conservation.findByIdAndUpdate(conversationId, { lastMessage }, { new: true })
    return true
  } catch {
    return false
  }
}

export const getConversationIdContain = async (conversationId: string, userId: string) => {
  try {
    const conservation = await Conservation.findById(conversationId)
    if (!conservation) {
      return null
    }
    if (conservation.members[0].toString() === userId) {
      return conservation.members[1]
    }
    return conservation.members[0]
  } catch {
    return null
  }
}

const ConservationService = { createConversation, getConversation }

export default ConservationService
