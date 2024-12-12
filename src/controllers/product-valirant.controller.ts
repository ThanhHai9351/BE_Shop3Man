import { Request, Response } from "express"
import { HttpMessage, HttpStatus } from "../global/globalEnum"
import { DTOCreateProductVariant } from "../dto/product-variant.dto"
import ProductVariantService from "../services/product-valirant.service"

const createProductVariant = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { error, value } = DTOCreateProductVariant(req.body)

    if (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        status: HttpStatus.BAD_REQUEST,
        message: error.details?.[0]?.message || "Invalid data",
      })
    }

    const productId = req.params.id
    if (!productId) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        status: HttpStatus.BAD_REQUEST,
        message: HttpMessage.BAD_REQUEST,
      })
    }

    const response = await ProductVariantService.createProductVariantService(value, productId)
    return res.status(HttpStatus.OK).json(response)
  } catch {
    return res.status(HttpStatus.SERVER_ERROR).json({
      status: HttpStatus.SERVER_ERROR,
      message: HttpMessage.SERVER_ERROR,
    })
  }
}

const ProductVariantController = { createProductVariant }

export default ProductVariantController
