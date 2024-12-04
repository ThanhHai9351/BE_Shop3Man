import Order, { IOrder } from "../models/order.model"

const createOrderService = (data: IOrder) => {
  return new Promise(async (resolve, reject) => {
    try {
      const createOrder = await Order.create(data)

      resolve({
        status: "OK",
        message: "Order created successfully!",
        data: createOrder,
      })
    } catch (e) {
      reject(e)
    }
  })
}

const getAllOrderService = (limit: number, page: number) => {
  return new Promise(async (resolve, reject) => {
    try {
      const totalOrders = await Order.countDocuments()
      const allOrders = await Order.find()
        .limit(limit)
        .skip(limit * page)
      resolve({
        status: "OK",
        message: "GET ALL ORDER COMPLETE!",
        data: allOrders,
        total: totalOrders,
        pageCurrent: Number(page + 1),
        totalPage: Math.ceil(totalOrders / limit),
      })
    } catch (e) {
      reject(e)
    }
  })
}

const updateOrderService = (id: string, data: IOrder) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkOrder = await Order.findById(id)
      if (!checkOrder) {
        resolve({
          status: "Error",
          message: "Dont know order",
        })
        return
      }
      const updateOrder = await Order.findByIdAndUpdate(id, data, {
        new: true,
      })

      resolve({
        status: "OK",
        message: "Order update successfully!",
        data: updateOrder,
      })
    } catch (e) {
      reject(e)
    }
  })
}

const deleteOrderService = (id: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkOrder = await Order.findById(id)
      if (!checkOrder) {
        resolve({
          status: "Error",
          message: "Category not found!",
        })
        return
      }
      const deleteOrder = await Order.findByIdAndDelete(id)

      resolve({
        status: "OK",
        message: "Order delete successfully!",
        data: deleteOrder,
      })
    } catch (e) {
      reject(e)
    }
  })
}

const detailOrderService = (id: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkOrder = await Order.findById(id)
      if (!checkOrder) {
        resolve({
          status: "Error",
          message: "Order not found!",
        })
      }
      resolve({
        status: "OK",
        message: "Get detail order successfully!",
        data: checkOrder,
      })
    } catch (e) {
      reject(e)
    }
  })
}

const OrderService = {
  createOrderService,
  getAllOrderService,
  updateOrderService,
  deleteOrderService,
  detailOrderService,
}

export default OrderService
