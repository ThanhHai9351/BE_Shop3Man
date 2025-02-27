import { Request, Response } from "express"
import CategoryService from "../services/category.service"
import { DTOCategory } from "../../dto/category.dto"
import { ReasonPhrases } from "http-status-codes"
import { StatusCodes } from "http-status-codes"
import { GlobalResponse } from "../../global/globalResponse"

const getAllCategories = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { limit, page, search, sortDir } = req.query
    return await CategoryService.getAllCategoryService(
      Number(limit) || 10,
      Number(page) || 0,
      (search as string) || "",
      (sortDir as string) || "asc",
      res,
    )
  } catch {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(GlobalResponse(StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR))
  }
}

const createCategory = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { error, value } = DTOCategory(req.body)

    if (error) {
      return res.status(StatusCodes.BAD_REQUEST).json(GlobalResponse(StatusCodes.BAD_REQUEST, error.details[0].message))
    }
    return await CategoryService.createCategoryService(value, res)
  } catch {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(GlobalResponse(StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR))
  }
}

const updateCategory = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { error, value } = DTOCategory(req.body)
    if (error) {
      return res.status(StatusCodes.BAD_REQUEST).json(GlobalResponse(StatusCodes.BAD_REQUEST, error.details[0].message))
    }
    const id = req.params.id
    if (!id) {
      return res.status(StatusCodes.BAD_REQUEST).json(GlobalResponse(StatusCodes.BAD_REQUEST, "Category id not found!"))
    }
    return await CategoryService.updateCategoryService(id, value, res)
  } catch {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(GlobalResponse(StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR))
  }
}

const deleteCategory = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = req.params.id
    if (!id) {
      return res.status(StatusCodes.BAD_REQUEST).json(GlobalResponse(StatusCodes.BAD_REQUEST, "Category id not found!"))
    }
    return await CategoryService.deleteCategoryService(id, res)
  } catch {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(GlobalResponse(StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR))
  }
}

const detailCategory = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = req.params.id
    if (!id) {
      return res.status(StatusCodes.BAD_REQUEST).json(GlobalResponse(StatusCodes.BAD_REQUEST, "Category id not found!"))
    }
    return await CategoryService.detailCategoryService(id, res)
  } catch {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(GlobalResponse(StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR))
  }
}

const CategoryController = { getAllCategories, createCategory, updateCategory, deleteCategory, detailCategory }
export default CategoryController
