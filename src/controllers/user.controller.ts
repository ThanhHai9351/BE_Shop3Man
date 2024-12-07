import UserService from "../services/user.service"
import { Request, Response } from "express"
import { DTOCreateUser, DTOLoginUser, DTOUpdateUser } from "../dto/user.dto"
import { HttpMessage, HttpStatus } from "../global/globalEnum"

const createUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { error, value } = DTOCreateUser(req.body)
    if (error) {
      return res.status(400).json({
        status: "ERROR",
        message: error.details[0].message,
      })
    }
    const respon = await UserService.createUserService(value)
    return res.status(200).json(respon)
  } catch (err) {
    return res.status(500).json({
      status: 500,
      message: err instanceof Error ? err.message : "Unknown error occurred",
    })
  }
}

const login = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { error, value } = DTOLoginUser(req.body)

    if (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        status: HttpStatus.BAD_REQUEST,
        message: error.details[0].message,
      })
    }

    const respon = await UserService.loginService(value.email, value.password)
    return res.status(HttpStatus.OK).json(respon)
  } catch (err: unknown) {
    console.log(err)
    return res.status(HttpStatus.SERVER_ERROR).json({
      status: HttpStatus.SERVER_ERROR,
      message: HttpMessage.SERVER_ERROR,
    })
  }
}

const getUserFromToken = async (req: Request, res: Response): Promise<Response> => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        status: HttpStatus.SERVER_ERROR,
        message: HttpMessage.UNAUTHORIZED,
      })
    }
    const token = authHeader.split(" ")[1]
    const respon = await UserService.getUserFromToken(token)
    return res.status(HttpStatus.OK).json(respon)
  } catch (err: unknown) {
    console.log(err)
    return res.status(HttpStatus.SERVER_ERROR).json({
      status: HttpStatus.SERVER_ERROR,
      message: HttpStatus.SERVER_ERROR,
    })
  }
}

const getAllUsers = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { limit, page, search, sortDir } = req.query

    const respon = await UserService.getAllUsers(
      Number(limit) || 5,
      Number(page) || 0,
      (search as string) || "",
      (sortDir as string) || "asc",
    )

    return res.status(HttpStatus.OK).json(respon)
  } catch (err: unknown) {
    console.log(err)
    return res.status(HttpStatus.SERVER_ERROR).json({
      status: HttpStatus.SERVER_ERROR,
      message: "Internal server error",
    })
  }
}

const updateUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = req.params.id
    if (!id) {
      return res.status(HttpStatus.NOT_FOUND).json({ status: HttpStatus.NOT_FOUND, message: "id not found!" })
    }
    const { error, value } = DTOUpdateUser(req.body)
    if (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        status: HttpStatus.BAD_REQUEST,
        message: error.details[0].message,
      })
    }

    const respon = await UserService.updateUserService(id, value)
    return res.status(HttpStatus.OK).json(respon)
  } catch (err: unknown) {
    console.log(err)
    return res.status(HttpStatus.SERVER_ERROR).json({
      status: HttpStatus.SERVER_ERROR,
      message: HttpStatus.SERVER_ERROR,
    })
  }
}

const deleteUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = req.params.id
    if (!id) {
      return res.status(HttpStatus.BAD_REQUEST).json({ status: HttpStatus.BAD_REQUEST, message: "id not found!" })
    }

    const respon = await UserService.deleteUserService(id)
    return res.status(HttpStatus.OK).json(respon)
  } catch (err: unknown) {
    console.log(err)
    return res.status(HttpStatus.SERVER_ERROR).json({
      status: HttpStatus.SERVER_ERROR,
      message: HttpStatus.SERVER_ERROR,
    })
  }
}

const UserController = { createUser, login, getUserFromToken, getAllUsers, updateUser, deleteUser }

export default UserController
