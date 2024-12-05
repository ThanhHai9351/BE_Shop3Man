import { Response } from "express"
import User, { IUser } from "../models/user.model"
import { JwtProvider } from "../providers/jwt-provider"
import { createClient } from "redis"
import bcrypt from "bcrypt"

const redisClient = createClient()
redisClient.connect().catch(console.error)

const createUserService = (data: IUser) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkUser = await User.find({ email: data.email })
      if (checkUser.length) {
        resolve({
          status: 404,
          message: "Email already been!",
        })
        return
      }

      const passwordNew = await bcrypt.hash(data.password, 10)
      const userNew = {
        firstName: data.firstName,
        email: data.email,
        role: data.role,
        password: passwordNew,
        dob: data.dob,
      }
      const createUser = await User.create(userNew)

      resolve({
        status: "OK",
        message: "User created successfully!",
        data: createUser,
      })
    } catch (e) {
      reject(e)
    }
  })
}

const loginService = (email: string, password: string, res: Response) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkUser = await User.findOne({ email })
      if (!checkUser) {
        resolve({
          status: 404,
          message: "User not found!",
        })
        return
      }

      const isMatch = await bcrypt.compare(password, checkUser.password)
      if (!isMatch) {
        resolve({
          status: 404,
          message: "Password not match!",
        })
        return
      }

      const data = { _id: checkUser._id, email: checkUser.email, name: checkUser.firstName, role: checkUser.role }

      const accessToken = await JwtProvider.generateToken(data, process.env.ACCESS_TOKEN!, "24h")
      const refreshToken = await JwtProvider.generateToken(data, process.env.REFRESH_TOKEN!, "30 days")

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false,
        maxAge: 24 * 60 * 60 * 1000, // 1 day expiration
        sameSite: "lax", // Controls whether cookie is sent cross-site
        domain: "localhost", // For local development
        path: "/", // Accessible throughout the site
      })

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        sameSite: "lax",
        domain: "localhost",
        path: "/",
      })

      resolve({
        status: "OK",
        message: "User created successfully!",
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
          status: "Error",
          message: "Token isvalid! Not found User!",
        })
        return
      }

      const user = await User.findById(data._id)
      resolve({
        status: "OK",
        message: "Get user successfully!",
        data: user,
      })
    } catch (e) {
      reject(e)
    }
  })
}

const getAllUsers = (limit: number, page: number, filter: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const cacheKey = `users:limit=${limit}:page=${page}:filter=${filter || "all"}`

      // Kiểm tra dữ liệu trong cache
      const cachedData = await redisClient.get(cacheKey)
      if (cachedData) {
        return resolve(JSON.parse(cachedData))
      }

      // Nếu không có cache, thực hiện truy vấn MongoDB
      let query = {}
      if (filter && filter !== "") {
        query = {
          name: { $regex: filter, $options: "i" },
        }
      }

      const totalUsers = await User.countDocuments(query)
      const allUsers = await User.find(query)
        .limit(limit)
        .skip(limit * page)

      const responseData = {
        status: "OK",
        message: "GET ALL USERS COMPLETE!",
        data: allUsers,
        total: totalUsers,
        pageCurrent: Number(page + 1),
        totalPage: Math.ceil(totalUsers / limit),
      }

      // Lưu dữ liệu vào Redis với TTL là 1 giờ (3600 giây)
      await redisClient.setEx(cacheKey, 3600, JSON.stringify(responseData))
      resolve(responseData)
    } catch (e) {
      reject(e)
    }
  })
}

const updateUserService = (id: string, data: IUser) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkCategory = await User.findById(id)
      if (!checkCategory) {
        resolve({
          status: "Error",
          message: "User not found!",
        })
        return
      }
      const updateCategory = await User.findByIdAndUpdate(id, data, { new: true })

      resolve({
        status: "OK",
        message: "User update successfully!",
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
          status: "Error",
          message: "User not found!",
        })
        return
      }
      const deleteUser = await User.findByIdAndDelete(id)

      resolve({
        status: "OK",
        message: "User delete successfully!",
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
