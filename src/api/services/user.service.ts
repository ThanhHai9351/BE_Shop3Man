import User, { IUser } from "../../models/user.model"
import { JwtProvider } from "../../providers/jwt-provider"
import redisClient from "../../redis/connectRedis"
import bcrypt from "bcrypt"
import { Response } from "express"
import { GlobalResponse, GlobalResponseData } from "../../global/globalResponse"
import { ReasonPhrases, StatusCodes } from "http-status-codes"

const createUserService = async (data: IUser, res: Response) => {
  try {
    const checkUser = await User.find({ email: data.email })
    if (checkUser.length) {
      return res.status(StatusCodes.BAD_REQUEST).json(GlobalResponse(StatusCodes.BAD_REQUEST, "Email already been!"))
    }

    const passwordNew = await bcrypt.hash(data.password, 10)
    const userNew = {
      ...data,
      password: passwordNew,
    }
    const createUser = await User.create(userNew)

    return res
      .status(StatusCodes.CREATED)
      .json(GlobalResponseData(StatusCodes.CREATED, ReasonPhrases.CREATED, createUser))
  } catch (error: any) {
    console.log(error)
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(GlobalResponse(StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR))
  }
}

const loginService = async (email: string, password: string, res: Response) => {
  try {
    const checkUser = await User.findOne({ email })
    if (!checkUser) {
      return res.status(StatusCodes.BAD_REQUEST).json(GlobalResponse(StatusCodes.BAD_REQUEST, "User not found!"))
    }

    const isMatch = await bcrypt.compare(password, checkUser.password)
    if (!isMatch) {
      return res.status(StatusCodes.BAD_REQUEST).json(GlobalResponse(StatusCodes.BAD_REQUEST, "Password not match!"))
    }

    const data = {
      _id: checkUser._id,
      email: checkUser.email,
      firstName: checkUser.firstName,
      lastName: checkUser.lastName,
      role: checkUser.role,
    }

    const accessToken = await JwtProvider.generateToken(data, process.env.ACCESS_TOKEN!, "24h")
    const refreshToken = await JwtProvider.generateToken(data, process.env.REFRESH_TOKEN!, "30 days")

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "lax",
      domain: "localhost",
      path: "/",
    })

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      sameSite: "lax",
      domain: "localhost",
      path: "/",
    })

    return res.status(StatusCodes.OK).json(
      GlobalResponseData(StatusCodes.OK, ReasonPhrases.OK, {
        accessToken: accessToken,
        refreshToken: refreshToken,
      }),
    )
  } catch {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(GlobalResponse(StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR))
  }
}

const getUserFromToken = async (token: string, res: Response) => {
  try {
    const data: any = await JwtProvider.verifyToken(token, process.env.ACCESS_TOKEN!)
    if (!data) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(GlobalResponse(StatusCodes.BAD_REQUEST, "Token isvalid! Not found User!"))
    }

    const user = await User.findById(data._id)
    return res.status(StatusCodes.OK).json(GlobalResponseData(StatusCodes.OK, ReasonPhrases.OK, user))
  } catch {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(GlobalResponse(StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR))
  }
}

const getAllUsers = async (limit: number, page: number, search: string, sortDir: string, res: Response) => {
  try {
    const cacheKey = `users:limit=${limit}:page=${page}:search=${search || "all"}:sort=${sortDir}}`

    // Kiểm tra dữ liệu trong cache
    const cachedData = await redisClient.get(cacheKey)
    if (cachedData) {
      return res
        .status(StatusCodes.OK)
        .json(GlobalResponseData(StatusCodes.OK, ReasonPhrases.OK, JSON.parse(cachedData)))
    }

    let query: any = {}
    if (search && search !== "") {
      query.$or = [{ firstName: { $regex: search, $options: "i" } }, { lastName: { $regex: search, $options: "i" } }]
    }
    const sortOrder = sortDir === "desc" ? -1 : 1

    const totalUsers = await User.countDocuments(query)
    const allUsers = await User.find(query)
      .sort({ firstName: sortOrder })
      .limit(limit)
      .skip(limit * page)
      .sort({ createdAt: -1 })

    const responseData = {
      data: allUsers,
      total: totalUsers,
      pageCurrent: page + 1,
      totalPage: Math.ceil(totalUsers / limit),
    }

    await redisClient.setEx(cacheKey, 10, JSON.stringify(responseData))
    return res.status(StatusCodes.OK).json(GlobalResponseData(StatusCodes.OK, ReasonPhrases.OK, responseData))
  } catch {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(GlobalResponse(StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR))
  }
}

const updateUserService = async (id: string, data: IUser, res: Response) => {
  try {
    const checkUser = await User.findById(id)
    if (!checkUser) {
      return res.status(StatusCodes.BAD_REQUEST).json(GlobalResponse(StatusCodes.BAD_REQUEST, "User not found!"))
    }
    const updateUser = await User.findByIdAndUpdate(id, data, { new: true })

    return res.status(StatusCodes.OK).json(GlobalResponseData(StatusCodes.OK, ReasonPhrases.OK, updateUser))
  } catch {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(GlobalResponse(StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR))
  }
}

const deleteUserService = async (id: string, res: Response) => {
  try {
    const checkUser = await User.findById(id)
    if (!checkUser) {
      return res.status(StatusCodes.BAD_REQUEST).json(GlobalResponse(StatusCodes.BAD_REQUEST, "User not found!"))
    }
    await User.findByIdAndDelete(id)

    return res.status(StatusCodes.OK).json(GlobalResponse(StatusCodes.OK, "Delete user success!"))
  } catch {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(GlobalResponse(StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR))
  }
}

const getUserByIdService = async (id: string, res: Response) => {
  try {
    const user = await User.findById(id)
    if (!user) {
      return res.status(StatusCodes.BAD_REQUEST).json(GlobalResponse(StatusCodes.BAD_REQUEST, "User not found!"))
    }
    return res.status(StatusCodes.OK).json(GlobalResponseData(StatusCodes.OK, ReasonPhrases.OK, user))
  } catch {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(GlobalResponse(StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR))
  }
}

const UserService = {
  createUserService,
  loginService,
  getUserFromToken,
  getAllUsers,
  updateUserService,
  deleteUserService,
  getUserByIdService,
}

export default UserService
