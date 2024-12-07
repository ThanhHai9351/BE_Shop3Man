import ProductService from "../services/product.service"
import { Request, Response } from "express"
import { DTOCreateCategory, DTOEditCategory } from "../dto/product.dto"
import { HttpMessage, HttpStatus } from "../global/globalEnum"

const createProduct = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { error, value } = DTOCreateCategory(req.body)

    if (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        status: HttpStatus.BAD_REQUEST,
        message: error.details[0].message,
      })
    }

    const respon = await ProductService.createProductService(value)
    return res.status(HttpStatus.OK).json(respon)
  } catch {
    return res.status(HttpStatus.SERVER_ERROR).json({
      status: HttpStatus.SERVER_ERROR,
      message: HttpMessage.SERVER_ERROR,
    })
  }
}
const updateProduct = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { error, value } = DTOEditCategory(req.body)
    if (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        status: HttpStatus.BAD_REQUEST,
        message: error.details[0].message,
      })
    }
    const id = req.params.id
    if (!id) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        status: HttpStatus.BAD_REQUEST,
        message: HttpMessage.BAD_REQUEST,
      })
    }
    const respon = await ProductService.updateProductService(id, value)
    return res.status(HttpStatus.OK).json(respon)
  } catch {
    return res.status(HttpStatus.SERVER_ERROR).json({
      status: HttpStatus.SERVER_ERROR,
      message: HttpMessage.SERVER_ERROR,
    })
  }
}

const detailProduct = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = req.params.id
    if (!id) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        status: HttpStatus.BAD_REQUEST,
        message: HttpMessage.BAD_REQUEST,
      })
    }
    const respon = await ProductService.detailProductService(id)
    return res.status(HttpStatus.OK).json(respon)
  } catch {
    return res.status(HttpStatus.SERVER_ERROR).json({
      status: HttpStatus.SERVER_ERROR,
      message: HttpMessage.SERVER_ERROR,
    })
  }
}

const getAllProduct = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { limit, page, search, sortDir, priceFrom, priceTo } = req.query
    const respon = await ProductService.getAllProductService(
      Number(limit) || 10,
      Number(page) || 0,
      (search as string) || "",
      (sortDir as string) || "asc",
      priceFrom ? Number(priceFrom) : undefined,
      priceTo ? Number(priceTo) : undefined,
    )
    return res.status(HttpStatus.OK).json(respon)
  } catch {
    return res.status(HttpStatus.SERVER_ERROR).json({
      status: HttpStatus.SERVER_ERROR,
      message: HttpMessage.SERVER_ERROR,
    })
  }
}

const deleteProduct = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = req.params.id
    if (!id) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        status: HttpStatus.BAD_REQUEST,
        message: HttpMessage.BAD_REQUEST,
      })
    }
    const respon = await ProductService.deleteProductService(id)
    return res.status(HttpStatus.OK).json(respon)
  } catch {
    return res.status(HttpStatus.SERVER_ERROR).json({
      status: HttpStatus.SERVER_ERROR,
      message: HttpMessage.SERVER_ERROR,
    })
  }
}

const ProductController = { createProduct, updateProduct, detailProduct, deleteProduct, getAllProduct }

export default ProductController
