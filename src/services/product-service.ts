import { isNil } from "lodash";
import Product, { IProduct } from "../models/product";
const createProductService = (data: IProduct) => {
  return new Promise(async (resolve, reject) => {
    try {
      const createProduct = await Product.create(data);

      resolve({
        status: "OK",
        message: "Product created successfully!",
        data: createProduct,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const updateProductService = (id: string, data: IProduct) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkProduct = await Product.findById(id);
      if (!checkProduct) {
        resolve({
          status: "Error",
          message: "Dont know product",
        });
        return;
      }
      const updateProduct = await Product.findByIdAndUpdate(id, data, {
        new: true,
      });

      resolve({
        status: "OK",
        message: "product update successfully!",
        data: updateProduct,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const detailProductService = (id: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkProduct = await Product.findById(id);
      if (!checkProduct) {
        resolve({
          status: "Error",
          message: "Dont know product",
        });
        return;
      }
      resolve({
        status: "OK",
        message: "product detail successfully!",
        data: checkProduct,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const deleteProductService = (id: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkProduct = await Product.findById(id);
      if (!checkProduct) {
        resolve({
          status: "Error",
          message: "Dont know product",
        });
        return;
      }
      const deleteProduct = await Product.findByIdAndDelete(id);
      resolve({
        status: "OK",
        message: "product delete successfully!",
        data: deleteProduct,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getAllProductService = async (limit: number, page: number, filter: string) => {
  try {
    let query = {}
    if (filter && filter !== "") {
      query = {
        name: { $regex: filter, $options: 'i' }, 
      };
    }
    console.log(filter)

    console.log(query)
    const totalProduct = await Product.countDocuments(query);
    const allProduct = await Product.find(query)
      .limit(limit)
      .skip(limit * page);

    return {
      status: "OK",
      message: "GET ALL PRODUCTS COMPLETE!",
      data: allProduct,
      total: totalProduct,
      pageCurrent: page + 1,
      totalPage: Math.ceil(totalProduct / limit),
    };
  } catch (e) {
    throw e;
  }
};


const ProductService = {
  createProductService,
  updateProductService,
  detailProductService,
  deleteProductService,
  getAllProductService
};

export default ProductService;
