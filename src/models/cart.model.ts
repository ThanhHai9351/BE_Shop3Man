import mongoose, { Schema, Document, Model } from "mongoose"
import { IProduct } from "./product.model"

export interface ICart extends Document {
  userId: mongoose.Schema.Types.ObjectId
  product: IProduct
  color: string
  size: number
  quantity: number
  price: number
}

const cartSchema: Schema<ICart> = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    product: { type: Object, required: true },
    color: { type: String, required: true },
    size: { type: Number, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
  },
  {
    timestamps: true,
  },
)

const Cart: Model<ICart> = mongoose.model<ICart>("Cart", cartSchema)

export default Cart
