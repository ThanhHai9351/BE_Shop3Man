import { HttpMessage, HttpStatus } from "../global/globalEnum"
import ProductVariant, { IProductVariant } from "../models/product-variant.model"
import Product from "../models/product.model"

const createProductVariantService = (data: Omit<IProductVariant, "productId">, productId: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkProduct = await Product.findById(productId)
      if (!checkProduct) {
        resolve({
          status: HttpStatus.NOT_FOUND,
          message: "ProductId isvalid!",
        })
      }

      const productData = { productId, ...data }
      const createProductValirant = await ProductVariant.create(productData)
      resolve({
        status: HttpStatus.OK,
        message: HttpMessage.OK,
        data: createProductValirant,
      })
    } catch (e) {
      reject(e)
    }
  })
}

const ProductVariantService = {
  createProductVariantService,
}

export default ProductVariantService
