import { GlobalResponse, GlobalResponseData } from "../../global/globalResponse"
import { StatusCodes } from "http-status-codes"
import { ReasonPhrases } from "http-status-codes"
import Cart, { ICart } from "../../models/cart.model"
import { Response } from "express"
import { JwtProvider } from "../../providers/jwt-provider"
import ProductVariant from "../../models/product-variant.model"
import Product from "../../models/product.model"
import mongoose from "mongoose"
const createCartService = async (
  values: Omit<ICart, "userId" | "product" | "price" | "quantity">,
  productId: string,
  token: string,
  res: Response,
) => {
  try {
    const product = await Product.findById(productId)
    if (!product) {
      return res.status(StatusCodes.NOT_FOUND).json(GlobalResponse(StatusCodes.NOT_FOUND, "Product not found"))
    }

    const productVariants = await ProductVariant.find({ productId: productId, color: values.color, size: values.size })
    if (!productVariants || productVariants.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json(GlobalResponse(StatusCodes.NOT_FOUND, "Product variant not found"))
    }

    const data: any = await JwtProvider.verifyToken(token, process.env.ACCESS_TOKEN!)
    if (!data) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(GlobalResponse(StatusCodes.BAD_REQUEST, "Invalid token! User not found!"))
    }

    const cartCheck = await Cart.findOne({
      userId: data._id,
      "product._id": product._id,
      color: values.color,
      size: values.size,
    })
    if (cartCheck) {
      const cart = await Cart.findOneAndUpdate(
        {
          userId: data._id,
          "product._id": product._id,
          color: values.color,
          size: values.size,
        },
        {
          $set: {
            quantity: cartCheck.quantity + 1,
            price: Number(productVariants[0].price) + cartCheck.price,
          },
        },
        {
          new: true,
        },
      )
      return res.status(StatusCodes.OK).json(GlobalResponseData(StatusCodes.OK, ReasonPhrases.OK, cart))
    }

    const cart = await Cart.create({
      userId: data._id,
      product: product,
      price: Number(productVariants[0].price),
      quantity: 1,
      size: values.size,
      color: values.color,
    })
    return res.status(StatusCodes.OK).json(GlobalResponseData(StatusCodes.OK, ReasonPhrases.OK, cart))
  } catch {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(GlobalResponse(StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR))
  }
}

const getAllCartService = async (token: string, res: Response) => {
  try {
    const data: any = await JwtProvider.verifyToken(token, process.env.ACCESS_TOKEN!)
    if (!data) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(GlobalResponse(StatusCodes.BAD_REQUEST, "Invalid token! User not found!"))
    }

    const getAllCart = await Cart.find({ userId: data._id }).sort({ createdAt: -1 })

    return res.status(StatusCodes.OK).json(GlobalResponseData(StatusCodes.OK, ReasonPhrases.OK, getAllCart))
  } catch {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(GlobalResponse(StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR))
  }
}

const deleteCartService = async (
  values: Omit<ICart, "userId" | "product" | "price" | "quantity">,
  productId: string,
  token: string,
  res: Response,
) => {
  try {
    const data: any = await JwtProvider.verifyToken(token, process.env.ACCESS_TOKEN!)
    if (!data) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(GlobalResponse(StatusCodes.BAD_REQUEST, "Invalid token! User not found!"))
    }
    const checkCart = await Cart.findOne({
      userId: data._id,
      "product._id": new mongoose.Types.ObjectId(productId),
      color: values.color,
      size: values.size,
    })
    if (!checkCart) {
      return res.status(StatusCodes.NOT_FOUND).json(GlobalResponse(StatusCodes.NOT_FOUND, "Cart not found!"))
    }
    if (checkCart.quantity > 1) {
      const productVariants = await ProductVariant.findOne({
        productId: productId,
        color: values.color,
        size: values.size,
      })
      const updateCart = await Cart.findOneAndUpdate(
        {
          userId: data._id,
          "product._id": new mongoose.Types.ObjectId(productId),
          color: values.color,
          size: values.size,
        },
        {
          $set: {
            quantity: checkCart.quantity - 1,
            price: checkCart.price - Number(productVariants?.price),
          },
        },
      )
      return res.status(StatusCodes.OK).json(GlobalResponseData(StatusCodes.OK, ReasonPhrases.OK, updateCart))
    }
    const deleteCart = await Cart.findByIdAndDelete(checkCart._id)
    return res.status(StatusCodes.OK).json(GlobalResponseData(StatusCodes.OK, ReasonPhrases.OK, deleteCart))
  } catch {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(GlobalResponse(StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR))
  }
}

const removeAllCartService = async (token: string, res: Response) => {
  try {
    const data: any = await JwtProvider.verifyToken(token, process.env.ACCESS_TOKEN!)
    if (!data) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(GlobalResponse(StatusCodes.BAD_REQUEST, "Invalid token! User not found!"))
    }
    const removeAllCart = await Cart.deleteMany({ userId: data._id })
    return res.status(StatusCodes.OK).json(GlobalResponseData(StatusCodes.OK, ReasonPhrases.OK, removeAllCart))
  } catch {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(GlobalResponse(StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR))
  }
}

const CartService = {
  createCartService,
  getAllCartService,
  deleteCartService,
  removeAllCartService,
}

export default CartService
