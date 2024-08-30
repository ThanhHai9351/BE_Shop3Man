import { Request, Response } from 'express';
import CategoryService from '../services/category-service';

const getAllCategories = async (req: Request, res: Response): Promise<Response> => {
  try {
    const respon = await CategoryService.getAllCategoryService();
    return res.status(200).json(respon);
  } catch (error) {
    return res.status(404).json({error});
  }
};


const CategoryController = {getAllCategories}
export default CategoryController;
