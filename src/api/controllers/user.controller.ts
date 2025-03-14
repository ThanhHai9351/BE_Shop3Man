import UserService from "../services/user.service"
import { Request, Response } from "express"
import { DTOCreateUser, DTOLoginUser, DTOUpdateUser } from "../../dto/user.dto"
import { GlobalResponse } from "../../global/globalResponse"
import { ReasonPhrases, StatusCodes } from "http-status-codes"

const createUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { error, value } = DTOCreateUser(req.body)
    if (error) {
      return res.status(StatusCodes.BAD_REQUEST).json(GlobalResponse(StatusCodes.BAD_REQUEST, error.details[0].message))
    }
    return await UserService.createUserService(value, res)
  } catch {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(GlobalResponse(StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR))
  }
}

const login = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { error, value } = DTOLoginUser(req.body)

    if (error) {
      return res.status(StatusCodes.BAD_REQUEST).json(GlobalResponse(StatusCodes.BAD_REQUEST, error.details[0].message))
    }

    return await UserService.loginService(value.email, value.password, res)
  } catch {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(GlobalResponse(StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR))
  }
}

const getUserFromToken = async (req: Request, res: Response): Promise<Response> => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json(GlobalResponse(StatusCodes.UNAUTHORIZED, ReasonPhrases.UNAUTHORIZED))
    }
    const token = authHeader.split(" ")[1]
    return await UserService.getUserFromToken(token, res)
  } catch {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(GlobalResponse(StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR))
  }
}

const getAllUsers = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { limit, page, search, sortDir } = req.query

    return await UserService.getAllUsers(
      Number(limit) || 10,
      Number(page) || 0,
      (search as string) || "",
      (sortDir as string) || "asc",
      res,
    )
  } catch {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(GlobalResponse(StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR))
  }
}

const updateUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = req.params.id
    if (!id) {
      return res.status(StatusCodes.BAD_REQUEST).json(GlobalResponse(StatusCodes.BAD_REQUEST, "User id not found!"))
    }
    const { error, value } = DTOUpdateUser(req.body)
    if (error) {
      return res.status(StatusCodes.BAD_REQUEST).json(GlobalResponse(StatusCodes.BAD_REQUEST, error.details[0].message))
    }
    return await UserService.updateUserService(id, value, res)
  } catch {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(GlobalResponse(StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR))
  }
}

const deleteUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = req.params.id
    if (!id) {
      return res.status(StatusCodes.BAD_REQUEST).json(GlobalResponse(StatusCodes.BAD_REQUEST, "User id not found!"))
    }
    return await UserService.deleteUserService(id, res)
  } catch {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(GlobalResponse(StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR))
  }
}

const getUserById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = req.params.id
    if (!id) {
      return res.status(StatusCodes.BAD_REQUEST).json(GlobalResponse(StatusCodes.BAD_REQUEST, "User id not found!"))
    }
    return await UserService.getUserByIdService(id, res)
  } catch {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(GlobalResponse(StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR))
  }
}

const UserController = { createUser, login, getUserFromToken, getAllUsers, updateUser, deleteUser, getUserById }

export default UserController
