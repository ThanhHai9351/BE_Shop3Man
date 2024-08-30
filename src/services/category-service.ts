import Category, { ICategory } from '../models/category';

interface ServiceResponse<T> {
  status: string;
  message: string;
  data: T;
}

const getAllCategoryService = (): Promise<ServiceResponse<ICategory[]>> => {
  return new Promise(async (resolve, reject) => {
    try {
      const allCategory = await Category.find({});
      resolve({
        status: 'OK',
        message: 'GET ALL Category COMPLETE!',
        data: allCategory,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const CategoryService = { getAllCategoryService };

export default CategoryService;
