import Joi from "joi"
import { Request, Response } from "express"
import OrderService from "../services/order-service"

const createOrder = async (req: Request, res: Response): Promise<Response> => {
  const schema = Joi.object({
    userid: Joi.string().required(),
    username: Joi.string().required(),
    items: Joi.array()
      .items(
        Joi.object({
          productid: Joi.string().required(),
          name: Joi.string().required(),
          price: Joi.number().required(),
          quantity: Joi.number().integer().required(),
          totalMoney: Joi.number().required(),
          size: Joi.number().required(),
          color: Joi.string().required(),
        }),
      )
      .required(),
    totalPrice: Joi.number().required(),
    address: Joi.object({
      city: Joi.string().required(),
      dictrict: Joi.string().required(),
      street: Joi.string().required(),
    }).required(),
    paymentMethod: Joi.string().required(),
    paidAt: Joi.date().required(),
  })

  try {
    const { error, value } = schema.validate(req.body)

    if (error) {
      return res.status(400).json({
        status: "ERROR",
        message: error.details[0].message,
      })
    }

    const respon = await OrderService.createOrderService(value)
    return res.status(200).json(respon)
  } catch (err) {
    return res.status(500).json({
      status: "ERROR",
      message: err instanceof Error ? err.message : "Unknown error occurred",
    })
  }
}

const getAllOrder = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { limit, page } = req.query
    const respon = await OrderService.getAllOrderService(Number(limit) || 5, Number(page) || 0)
    return res.status(200).json(respon)
  } catch (error) {
    return res.status(404).json({ error })
  }
}

const updateOrder = async (req: Request, res: Response): Promise<Response> => {
  const schema = Joi.object({
    userid: Joi.string().optional(),
    username: Joi.string().optional(),
    items: Joi.array()
      .items(
        Joi.object({
          productid: Joi.string().optional(),
          name: Joi.string().optional(),
          price: Joi.number().optional(),
          quantity: Joi.number().integer().optional(),
          totalMoney: Joi.number().optional(),
          size: Joi.number().optional(),
          color: Joi.string().optional(),
        }),
      )
      .optional(),
    totalPrice: Joi.number().optional(),
    address: Joi.object({
      city: Joi.string().optional(),
      dictrict: Joi.string().optional(),
      street: Joi.string().optional(),
    }).optional(),
    paymentMethod: Joi.string().optional(),
    paidAt: Joi.date().optional(),
  })

  try {
    const { error, value } = schema.validate(req.body)
    if (error) {
      return res.status(400).json({
        status: "ERROR",
        message: error.details[0].message,
      })
    }
    const id = req.params.id
    if (!id) {
      return res.status(400).json({
        status: "ERROR",
        message: "Id isvalid",
      })
    }

    const respon = await OrderService.updateOrderService(id, value)
    return res.status(200).json(respon)
  } catch (err) {
    return res.status(500).json({
      status: "ERROR",
      message: err instanceof Error ? err.message : "Unknown error occurred",
    })
  }
}

const deleteOrder = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = req.params.id
    if (!id) {
      return res.status(400).json({
        status: "ERROR",
        message: "ID not found!",
      })
    }

    const respon = await OrderService.deleteOrderService(id)
    return res.status(200).json(respon)
  } catch (err) {
    return res.status(500).json({
      status: "ERROR",
      message: err instanceof Error ? err.message : "Unknown error occurred",
    })
  }
}

const detailOrder = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = req.params.id
    if (!id) {
      return res.status(400).json({
        status: "ERROR",
        message: "ID not found!",
      })
    }

    const respon = await OrderService.detailOrderService(id)
    return res.status(200).json(respon)
  } catch (err) {
    return res.status(500).json({
      status: "ERROR",
      message: err instanceof Error ? err.message : "Unknown error occurred",
    })
  }
}
const OrderController = {
  createOrder,
  getAllOrder,
  updateOrder,
  deleteOrder,
  detailOrder,
}

export default OrderController
