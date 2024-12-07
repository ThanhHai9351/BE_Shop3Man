import { Request, Response } from "express"
import CategoryService from "../services/category.service"
import { DTOCreateCategory, DTOEditCategory } from "../dto/category.dto"
import { HttpMessage, HttpStatus } from "../global/globalEnum"

const getAllCategories = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { limit, page, search, sortDir } = req.query
    const respon = await CategoryService.getAllCategoryService(
      Number(limit) || 6,
      Number(page) || 0,
      (search as string) || "",
      (sortDir as string) || "asc",
    )
    return res.status(HttpStatus.OK).json(respon)
  } catch {
    return res.status(HttpStatus.SERVER_ERROR).json({
      status: HttpStatus.SERVER_ERROR,
      message: HttpMessage.SERVER_ERROR,
    })
  }
}

const createCategory = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { error, value } = DTOCreateCategory(req.body)

    if (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        status: HttpStatus.BAD_REQUEST,
        message: error.details[0].message,
      })
    }
    const respon = await CategoryService.createCategoryService(value)
    return res.status(HttpStatus.OK).json(respon)
  } catch {
    return res.status(HttpStatus.SERVER_ERROR).json({
      status: HttpStatus.SERVER_ERROR,
      message: HttpMessage.SERVER_ERROR,
    })
  }
}

const updateCategory = async (req: Request, res: Response): Promise<Response> => {
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
    const respon = await CategoryService.updateCategoryService(id, value)
    return res.status(HttpStatus.OK).json(respon)
  } catch {
    return res.status(HttpStatus.SERVER_ERROR).json({
      status: HttpStatus.SERVER_ERROR,
      message: HttpMessage.SERVER_ERROR,
    })
  }
}

const deleteCategory = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = req.params.id
    if (!id) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        status: HttpStatus.BAD_REQUEST,
        message: HttpMessage.BAD_REQUEST,
      })
    }
    const respon = await CategoryService.deleteCategoryService(id)
    return res.status(HttpStatus.OK).json(respon)
  } catch {
    return res.status(HttpStatus.SERVER_ERROR).json({
      status: HttpStatus.SERVER_ERROR,
      message: HttpMessage.SERVER_ERROR,
    })
  }
}

const detailCategory = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = req.params.id
    if (!id) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        status: HttpStatus.BAD_REQUEST,
        message: HttpMessage.BAD_REQUEST,
      })
    }
    const respon = await CategoryService.detailCategoryService(id)
    return res.status(HttpStatus.OK).json(respon)
  } catch {
    return res.status(HttpStatus.SERVER_ERROR).json({
      status: HttpStatus.SERVER_ERROR,
      message: HttpMessage.SERVER_ERROR,
    })
  }
}

const CategoryController = { getAllCategories, createCategory, updateCategory, deleteCategory, detailCategory }
export default CategoryController
