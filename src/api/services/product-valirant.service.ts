import { ReasonPhrases, StatusCodes } from "http-status-codes"
import ProductVariant, { IProductVariant } from "../../models/product-variant.model"
import Product from "../../models/product.model"
import { GlobalResponse, GlobalResponseData } from "../../global/globalResponse"
import { Response } from "express"

const createProductVariantService = async (
  data: Omit<IProductVariant, "productId">,
  productId: string,
  res: Response,
) => {
  try {
    const checkProduct = await Product.findById(productId)
    if (!checkProduct) {
      return res.status(StatusCodes.NOT_FOUND).json(GlobalResponse(StatusCodes.NOT_FOUND, "ProductId isvalid!"))
    }

    const productData = { productId, ...data }
    const createProductValirant = await ProductVariant.create(productData)
    return res.status(StatusCodes.OK).json(GlobalResponseData(StatusCodes.OK, ReasonPhrases.OK, createProductValirant))
  } catch {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(GlobalResponse(StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR))
  }
}

const ProductVariantService = {
  createProductVariantService,
}

export default ProductVariantService
