import { Request, Response } from "express"
import Joi from "joi"
import CartService from "../services/cart.service"

const createCart = async (req: Request, res: Response): Promise<Response> => {
  const schema = Joi.object({
    userid: Joi.string().required(),
    productid: Joi.string().required(),
    quantity: Joi.number().integer().min(1).required(),
    productname: Joi.string().required(),
  })

  try {
    const { error, value } = schema.validate(req.body)

    if (error) {
      return res.status(400).json({
        status: "ERROR",
        message: error.details[0].message,
      })
    }

    const respon = await CartService.createCartService(value)
    return res.status(200).json(respon)
  } catch (err) {
    return res.status(500).json({
      status: "ERROR",
      message: err instanceof Error ? err.message : "Unknown error occurred",
    })
  }
}

const getAllCart = async (req: Request, res: Response): Promise<Response> => {
  try {
    const respon = await CartService.getAllCartService()
    return res.status(200).json(respon)
  } catch (err) {
    return res.status(500).json({
      status: "ERROR",
      message: err instanceof Error ? err.message : "Unknown error occurred",
    })
  }
}

const updateCart = async (req: Request, res: Response): Promise<Response> => {
  const schema = Joi.object({
    userid: Joi.string().optional(),
    productid: Joi.string().optional(),
    quantity: Joi.number().integer().min(1).optional(),
    productname: Joi.string().optional(),
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

    const respon = await CartService.updateCartService(id, value)
    return res.status(200).json(respon)
  } catch (err) {
    return res.status(500).json({
      status: "ERROR",
      message: err instanceof Error ? err.message : "Unknown error occurred",
    })
  }
}

const deleteCart = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = req.params.id
    if (!id) {
      return res.status(400).json({
        status: "ERROR",
        message: "ID not found!",
      })
    }

    const respon = await CartService.deleteCartService(id)
    return res.status(200).json(respon)
  } catch (err) {
    return res.status(500).json({
      status: "ERROR",
      message: err instanceof Error ? err.message : "Unknown error occurred",
    })
  }
}

const detailCart = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = req.params.id
    if (!id) {
      return res.status(400).json({
        status: "ERROR",
        message: "ID not found!",
      })
    }

    const respon = await CartService.detailCartService(id)
    return res.status(200).json(respon)
  } catch (err) {
    return res.status(500).json({
      status: "ERROR",
      message: err instanceof Error ? err.message : "Unknown error occurred",
    })
  }
}

const CartControlller = { createCart, getAllCart, updateCart, deleteCart, detailCart }

export default CartControlller
