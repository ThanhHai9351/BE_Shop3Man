import mongoose, { Schema, Model } from "mongoose"
import { IProduct } from "./product.model"

export interface IWhistlist {
  userId: mongoose.Schema.Types.ObjectId
  product: IProduct
}

const whistlistSchema: Schema<IWhistlist> = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    product: {
      _id: { type: String, required: true },
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
    },
  },
  {
    timestamps: true,
  },
)

const Whistlist: Model<IWhistlist> = mongoose.model<IWhistlist>("Whistlist", whistlistSchema)

export default Whistlist
