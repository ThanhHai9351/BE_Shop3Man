import { Request, Response } from 'express';
import CategoryService from '../services/category-service';
import Joi from 'joi';

const getAllCategories = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { limit, page, filter} = req.query;
    const respon = await CategoryService.getAllCategoryService(
      Number(limit) || 5,
      Number(page) || 0,
      filter as string || ""
    );
    return res.status(200).json(respon);
  } catch (error) {
    return res.status(404).json({error});
  }
};

const createCategory = async (req: Request, res: Response): Promise<Response> => {
  const schema = Joi.object({
    name: Joi.string().required(),
  });

  try {
    const { error, value } = schema.validate(req.body);

    if (error) {
      return res.status(400).json({
        status: "ERROR",
        message: error.details[0].message,
      });
    }

    const respon = await CategoryService.createCategoryService(value);
    return res.status(200).json(respon);

  } catch (err) {
    return res.status(500).json({
      status: "ERROR",
      message: err instanceof Error ? err.message : 'Unknown error occurred',
    });
  }
};

const updateCategory = async (req: Request, res: Response): Promise<Response> => {
  const schema = Joi.object({
    name: Joi.string().required(),
  });

  try {
    const { error, value } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: "ERROR",
        message: error.details[0].message,
      });
    }
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({
        status: "ERROR",
        message: "Id isvalid",
      });
    }

    const respon = await CategoryService.updateCategoryService(id,value);
    return res.status(200).json(respon);

  } catch (err) {
    return res.status(500).json({
      status: "ERROR",
      message: err instanceof Error ? err.message : 'Unknown error occurred',
    });
  }
};

const deleteCategory = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({
        status: "ERROR",
        message: "ID not found!",
      });
    }

    const respon = await CategoryService.deleteCategoryService(id);
    return res.status(200).json(respon);
  } catch (err) {
    return res.status(500).json({
      status: "ERROR",
      message: err instanceof Error ? err.message : 'Unknown error occurred',
    });
  }
};

const detailCategory = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({
        status: "ERROR",
        message: "ID not found!",
      });
    }

    const respon = await CategoryService.detailCategoryService(id);
    return res.status(200).json(respon);
  } catch (err) {
    return res.status(500).json({
      status: "ERROR",
      message: err instanceof Error ? err.message : 'Unknown error occurred',
    });
  }
};

const CategoryController = {getAllCategories,createCategory,updateCategory,deleteCategory, detailCategory}
export default CategoryController;
