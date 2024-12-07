import User, { IUser } from "../models/user.model"
import { JwtProvider } from "../providers/jwt-provider"
import redisClient from "../redis/connectRedis"
import bcrypt from "bcrypt"
import { HttpMessage, HttpStatus } from "../global/globalEnum"

const createUserService = (data: IUser) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkUser = await User.find({ email: data.email })
      if (checkUser.length) {
        resolve({
          status: HttpStatus.BAD_REQUEST,
          message: "Email already been!",
        })
        return
      }

      const passwordNew = await bcrypt.hash(data.password, 10)
      const userNew = {
        ...data,
        password: passwordNew,
      }
      const createUser = await User.create(userNew)

      resolve({
        status: HttpStatus.OK,
        message: HttpMessage.OK,
        data: createUser,
      })
    } catch (e) {
      reject(e)
    }
  })
}

const loginService = (email: string, password: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkUser = await User.findOne({ email })
      if (!checkUser) {
        resolve({
          status: HttpStatus.BAD_REQUEST,
          message: "User not found!",
        })
        return
      }

      const isMatch = await bcrypt.compare(password, checkUser.password)
      if (!isMatch) {
        resolve({
          status: HttpStatus.BAD_REQUEST,
          message: "Password not match!",
        })
        return
      }

      const data = { _id: checkUser._id, email: checkUser.email, firstName: checkUser.firstName, role: checkUser.role }

      const accessToken = await JwtProvider.generateToken(data, process.env.ACCESS_TOKEN!, "24h")
      const refreshToken = await JwtProvider.generateToken(data, process.env.REFRESH_TOKEN!, "30 days")

      // res.cookie("accessToken", accessToken, {
      //   httpOnly: true,
      //   secure: false,
      //   maxAge: 24 * 60 * 60 * 1000,
      //   sameSite: "lax",
      //   domain: "localhost",
      //   path: "/",
      // })

      // res.cookie("refreshToken", refreshToken, {
      //   httpOnly: true,
      //   secure: false,
      //   maxAge: 30 * 24 * 60 * 60 * 1000,
      //   sameSite: "lax",
      //   domain: "localhost",
      //   path: "/",
      // })

      resolve({
        status: HttpStatus.OK,
        message: HttpMessage.OK,
        accessToken: accessToken,
        refreshToken: refreshToken,
      })
    } catch (e) {
      reject(e)
    }
  })
}

const getUserFromToken = (token: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const data: any = await JwtProvider.verifyToken(token, process.env.ACCESS_TOKEN!)
      if (!data) {
        resolve({
          status: HttpStatus.BAD_REQUEST,
          message: "Token isvalid! Not found User!",
        })
        return
      }

      const user = await User.findById(data._id)
      resolve({
        status: HttpStatus.OK,
        message: HttpMessage.OK,
        data: user,
      })
    } catch (e) {
      reject(e)
    }
  })
}

const getAllUsers = (limit: number, page: number, search: string, sortDir: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const cacheKey = `users:limit=${limit}:page=${page}:search=${search || "all"}:sort=${sortDir}}`

      // Kiểm tra dữ liệu trong cache
      const cachedData = await redisClient.get(cacheKey)
      if (cachedData) {
        return resolve(JSON.parse(cachedData))
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

      const responseData = {
        status: HttpStatus.OK,
        message: HttpMessage.OK,
        data: allUsers,
        total: totalUsers,
        pageCurrent: page + 1,
        totalPage: Math.ceil(totalUsers / limit),
      }

      await redisClient.setEx(cacheKey, 10, JSON.stringify(responseData))
      resolve(responseData)
    } catch (error) {
      reject(error)
    }
  })
}

const updateUserService = (id: string, data: IUser) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkCategory = await User.findById(id)
      if (!checkCategory) {
        resolve({
          status: HttpStatus.BAD_REQUEST,
          message: "User not found!",
        })
        return
      }
      const updateCategory = await User.findByIdAndUpdate(id, data, { new: true })

      resolve({
        status: HttpStatus.OK,
        message: HttpMessage.OK,
        data: updateCategory,
      })
    } catch (e) {
      reject(e)
    }
  })
}

const deleteUserService = (id: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkCategory = await User.findById(id)
      if (!checkCategory) {
        resolve({
          status: HttpStatus.BAD_REQUEST,
          message: "User not found!",
        })
        return
      }
      const deleteUser = await User.findByIdAndDelete(id)

      resolve({
        status: HttpStatus.OK,
        message: HttpMessage.OK,
        data: deleteUser,
      })
    } catch (e) {
      reject(e)
    }
  })
}

const UserService = {
  createUserService,
  loginService,
  getUserFromToken,
  getAllUsers,
  updateUserService,
  deleteUserService,
}

export default UserService
