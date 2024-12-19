import { Request, Response } from "express"
import { HttpMessage, HttpStatus } from "../global/globalEnum"
import WhistlistService from "../services/whistlist.service"
import { DTOWhistlist } from "../dto/whistlist.dto"

const addToWhistlist = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { error, value } = DTOWhistlist(req.body)

    if (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        status: HttpStatus.BAD_REQUEST,
        message: error.details?.[0]?.message || "Invalid data",
      })
    }

    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        status: HttpStatus.UNAUTHORIZED,
        message: HttpMessage.UNAUTHORIZED,
      })
    }
    const token = authHeader.split(" ")[1]

    const response = await WhistlistService.addToWhistlistService(value, token)
    return res.status(HttpStatus.OK).json(response)
  } catch {
    return res.status(HttpStatus.SERVER_ERROR).json({
      status: HttpStatus.SERVER_ERROR,
      message: HttpMessage.SERVER_ERROR,
    })
  }
}

const removeToWhistlist = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { error, value } = DTOWhistlist(req.body)

    if (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        status: HttpStatus.BAD_REQUEST,
        message: error.details?.[0]?.message || "Invalid data",
      })
    }

    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        status: HttpStatus.UNAUTHORIZED,
        message: HttpMessage.UNAUTHORIZED,
      })
    }
    const token = authHeader.split(" ")[1]

    const response = await WhistlistService.removeToWhistlistService(value, token)
    return res.status(HttpStatus.OK).json(response)
  } catch {
    return res.status(HttpStatus.SERVER_ERROR).json({
      status: HttpStatus.SERVER_ERROR,
      message: HttpMessage.SERVER_ERROR,
    })
  }
}

const getWhistlist = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { limit, page, search, sortDir, priceFrom, priceTo } = req.query
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        status: HttpStatus.UNAUTHORIZED,
        message: HttpMessage.UNAUTHORIZED,
      })
    }
    const token = authHeader.split(" ")[1]

    const response = await WhistlistService.getWhistlistService(
      token,
      Number(limit) || 10,
      Number(page) || 0,
      (search as string) || "",
      (sortDir as string) || "",
      priceFrom ? Number(priceFrom) : undefined,
      priceTo ? Number(priceTo) : undefined,
    )
    return res.status(HttpStatus.OK).json(response)
  } catch {
    return res.status(HttpStatus.SERVER_ERROR).json({
      status: HttpStatus.SERVER_ERROR,
      message: HttpMessage.SERVER_ERROR,
    })
  }
}
const WhistlistController = { addToWhistlist, getWhistlist, removeToWhistlist }

export default WhistlistController
