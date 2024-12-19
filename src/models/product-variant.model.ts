import mongoose, { Schema, Model } from "mongoose"

export interface IProductVariant {
  productId: mongoose.Schema.Types.ObjectId
  color: String
  size: Number
  stockQuantity: Number
  price: Number
}

const productVariantSchema: Schema<IProductVariant> = new Schema(
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

const ProductVariant: Model<IProductVariant> = mongoose.model<IProductVariant>("ProductVariant", productVariantSchema)

export default ProductVariant
