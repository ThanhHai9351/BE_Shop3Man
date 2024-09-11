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

const ProductService = {
  createProductService,
  updateProductService,
  detailProductService,
  deleteProductService,
};

export default ProductService;
