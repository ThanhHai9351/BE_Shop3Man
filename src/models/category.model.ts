import mongoose, { Schema, Model } from "mongoose"

export interface ICategory {
  _id: string
  name: string
  imageUrl: string
  decription: string
  slug: string
}

const categorySchema: Schema<ICategory> = new Schema(
  {
    name: { type: String, required: true },
    imageUrl: { type: String, required: false },
    decription: { type: String, required: false },
    slug: { type: String, required: true },
  },
  {
    timestamps: true,
  },
)

const Category: Model<ICategory> = mongoose.model<ICategory>("Category", categorySchema)

export default Category
