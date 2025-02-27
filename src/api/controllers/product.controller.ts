import ProductService from "../services/product.service"
import { Request, Response } from "express"
import { DTOCreateProduct, DTOEditProduct } from "../../dto/product.dto"
import { ReasonPhrases, StatusCodes } from "http-status-codes"
import { GlobalResponse } from "../../global/globalResponse"

const createProduct = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { error, value } = DTOCreateProduct(req.body)

    if (error) {
      return res.status(StatusCodes.BAD_REQUEST).json(GlobalResponse(StatusCodes.BAD_REQUEST, error.details[0].message))
    }

    return await ProductService.createProductService(value, res)
  } catch {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(GlobalResponse(StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR))
  }
}
const updateProduct = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { error, value } = DTOEditProduct(req.body)
    if (error) {
      return res.status(StatusCodes.BAD_REQUEST).json(GlobalResponse(StatusCodes.BAD_REQUEST, error.details[0].message))
    }
    const id = req.params.id
    if (!id) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(GlobalResponse(StatusCodes.BAD_REQUEST, ReasonPhrases.BAD_REQUEST))
    }
    return await ProductService.updateProductService(id, value, res)
  } catch {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(GlobalResponse(StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR))
  }
}

const detailProduct = async (req: Request, res: Response): Promise<Response> => {
  try {
    const authHeader = req.headers.authorization
    const token = authHeader?.split(" ")[1]
    const slug = req.params.slug
    if (!slug) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(GlobalResponse(StatusCodes.BAD_REQUEST, ReasonPhrases.BAD_REQUEST))
    }
    return await ProductService.detailProductService(slug, token || "", res)
  } catch {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(GlobalResponse(StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR))
  }
}

const getAllProduct = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { limit, page, search, sortDir, priceFrom, priceTo, categorySlug } = req.query
    return await ProductService.getAllProductService(
      Number(limit) || 10,
      Number(page) || 0,
      (search as string) || "",
      (sortDir as string) || "",
      (categorySlug as string) || "",
      res,
      priceFrom ? Number(priceFrom) : undefined,
      priceTo ? Number(priceTo) : undefined,
    )
  } catch {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(GlobalResponse(StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR))
  }
}

const deleteProduct = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = req.params.id
    if (!id) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(GlobalResponse(StatusCodes.BAD_REQUEST, ReasonPhrases.BAD_REQUEST))
    }
    return await ProductService.deleteProductService(id, res)
  } catch {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(GlobalResponse(StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR))
  }
}

const ProductController = { createProduct, updateProduct, detailProduct, deleteProduct, getAllProduct }

export default ProductController
