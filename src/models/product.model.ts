import mongoose, { Schema, Model } from "mongoose"

export interface IProduct {
  name: string
  price: number
  slug: string
  imageUrl?: string
  description?: string
  categoryId: mongoose.Schema.Types.ObjectId
  items: mongoose.Schema.Types.Mixed
}

const ProductSchema: Schema<IProduct> = new Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    slug: { type: String, required: true },
    imageUrl: { type: String },
    description: { type: String },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Category",
    },
    items: { type: Schema.Types.Mixed },
  },
  {
    timestamps: true,
  },
)

const Product: Model<IProduct> = mongoose.model<IProduct>("Product", ProductSchema)

export default Product
