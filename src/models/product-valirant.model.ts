import mongoose, { Schema, Model } from "mongoose"

export interface IProductValirant {
  productId: mongoose.Schema.Types.ObjectId
  color: String
  size: Number
  stockQuantity: Number
  price: Number
}

const productValirantSchema: Schema<IProductValirant> = new Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Product",
    },
    color: { type: String, required: true },
    size: { type: Number, required: true },
    stockQuantity: { type: Number, required: true },
    price: { type: Number, required: true },
  },
  {
    timestamps: true,
  },
)

const ProductValirantSchema: Model<IProductValirant> = mongoose.model<IProductValirant>(
  "ProductValirant",
  productValirantSchema,
)

export default ProductValirantSchema
