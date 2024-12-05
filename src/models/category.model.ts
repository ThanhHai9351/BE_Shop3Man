import mongoose, { Schema, Document, Model } from "mongoose"

export interface ICategory extends Document {
  name: String
  imageUrl: String
  decription: String
  slug: String
}

const categorySchema: Schema<ICategory> = new Schema(
  {
    name: { type: String, required: true },
    imageUrl: { type: String, required: false },
    decription: {type:String, required: false},
    slug: {type: String, required: true}
  },
  {
    timestamps: true,
  },
)

const Category: Model<ICategory> = mongoose.model<ICategory>("Category", categorySchema)

export default Category
