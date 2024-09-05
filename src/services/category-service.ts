import { ObjectId } from 'mongoose';
import Category, { ICategory } from '../models/category';

const getAllCategoryService = ()  => {
  return new Promise(async (resolve, reject) => {
    try {
      const allCategory = await Category.find({});
      resolve({
        status: 'OK',
        message: 'Get alll category complete!',
        data: allCategory,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const updateCategoryService = (id:string,data:ICategory) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkCategory = await Category.findById(id);
      if (!checkCategory) {
        resolve({
          status: 'Error',
          message: 'Dont know category',
        });
        return;
      }
      const updateCategory = await Category.findByIdAndUpdate(id,data,{new:true});

      resolve({
        status: 'OK',
        message: 'Category update successfully!',
        data: updateCategory,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const createCategoryService = (data:ICategory) => {
  return new Promise(async (resolve, reject) => {
    try {
      const {name} = data;
      const checkCategory = await Category.findOne({name});
      if (checkCategory) {
        resolve({
          status: 'Error',
          message: 'Category already exists!',
        });
        return;
      }
      const createCategory = await Category.create(data);

      resolve({
        status: 'OK',
        message: 'Category created successfully!',
        data: createCategory,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const deleteCategoryService = (id:string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkCategory = await Category.findById(id);
      if (!checkCategory) {
        resolve({
          status: 'Error',
          message: 'Category not found!',
        });
        return;
      }
      const deleteCategory = await Category.findByIdAndDelete(id);

      resolve({
        status: 'OK',
        message: 'Category delete successfully!',
        data: deleteCategory,
      });
    } catch (e) {
      reject(e);
    }
  });
};


const CategoryService = { getAllCategoryService,createCategoryService,updateCategoryService,deleteCategoryService };

export default CategoryService;
