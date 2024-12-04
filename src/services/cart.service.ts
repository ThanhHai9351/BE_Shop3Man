import Cart, { ICart } from "../models/cart.model"

const createCartService = (data: ICart) => {
  return new Promise(async (resolve, reject) => {
    try {
      const createCart = await Cart.create(data)
      resolve({
        status: "OK",
        message: "Cart created successfully!",
        data: createCart,
      })
    } catch (e) {
      reject(e)
    }
  })
}

const getAllCartService = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const getAllCart = await Cart.find()
      resolve({
        status: "OK",
        message: "Get all cart successfully!",
        data: getAllCart,
      })
    } catch (e) {
      reject(e)
    }
  })
}

const updateCartService = (id: string, data: ICart) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkCart = await Cart.findById(id)
      if (!checkCart) {
        resolve({
          status: "Error",
          message: "Dont know product",
        })
        return
      }
      const updateCart = await Cart.findByIdAndUpdate(id, data, {
        new: true,
      })

      resolve({
        status: "OK",
        message: "Cart update successfully!",
        data: updateCart,
      })
    } catch (e) {
      reject(e)
    }
  })
}

const deleteCartService = (id: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkCart = await Cart.findById(id)
      if (!checkCart) {
        resolve({
          status: "Error",
          message: "Cart not found!",
        })
        return
      }
      const deleteCart = await Cart.findByIdAndDelete(id)

      resolve({
        status: "OK",
        message: "Cart delete successfully!",
        data: deleteCart,
      })
    } catch (e) {
      reject(e)
    }
  })
}

const detailCartService = (id: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const cart = await Cart.findById(id)
      if (!cart) {
        resolve({
          status: "Error",
          message: "cart not found!",
        })
      }
      resolve({
        status: "OK",
        message: "Get detail cart successfully!",
        data: cart,
      })
    } catch (e) {
      reject(e)
    }
  })
}

const CartService = {
  createCartService,
  getAllCartService,
  updateCartService,
  deleteCartService,
  detailCartService,
}

export default CartService
