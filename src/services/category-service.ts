import Category, { ICategory } from '../models/category';

const getAllCategoryService = (limit:number, page:number, filter: string)  => {
  return new Promise(async (resolve, reject) => {
    try {
      let query = {};
    if (filter && filter !== "") {
        query = {
          name: { $regex: filter, $options: 'i' }, 
        };
      }
      const totalCategory = await Category.countDocuments(query);
      const allCategory = await Category.find(query)
        .limit(limit)
        .skip(limit * page);
      resolve({
        status: "OK",
        message: "GET ALL Category COMPLETE!",
        data: allCategory,
        total: totalCategory,
        pageCurrent: Number(page + 1),
        totalPage: Math.ceil(totalCategory / limit),
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

const detailCategoryService = (id : string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const category = await Category.findById(id);
      if(!category)
      {
        resolve({
          status: "Error",
          message: "Category not found!",
        });
      }
      resolve({
        status: "OK",
        message: "Get detail category successfully!",
        data: category,
      });
    } catch (e) {
      reject(e);
    }
  });
};


const CategoryService = { getAllCategoryService,createCategoryService,updateCategoryService,deleteCategoryService,detailCategoryService };

export default CategoryService;
