import { Request, Response } from "express"
import { DTOCreateProductVariant } from "../../dto/product-variant.dto"
import ProductVariantService from "../services/product-valirant.service"
import { GlobalResponse } from "../../global/globalResponse"
import { ReasonPhrases, StatusCodes } from "http-status-codes"

const createProductVariant = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { error, value } = DTOCreateProductVariant(req.body)

    if (error) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(GlobalResponse(StatusCodes.BAD_REQUEST, error.details?.[0]?.message || "Invalid data"))
    }

    const productId = req.params.id
    if (!productId) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(GlobalResponse(StatusCodes.BAD_REQUEST, ReasonPhrases.BAD_REQUEST))
    }

    return await ProductVariantService.createProductVariantService(value, productId, res)
  } catch {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(GlobalResponse(StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR))
  }
}

const ProductVariantController = { createProductVariant }

export default ProductVariantController
