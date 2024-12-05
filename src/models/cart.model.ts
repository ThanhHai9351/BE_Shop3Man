import mongoose, { Schema, Document, Model } from "mongoose"

export interface ICart extends Document {
  userId: mongoose.Schema.Types.ObjectId
  items: ICartItem[]
  totalMoney: number
}

export interface ICartItem {
  productId: mongoose.Schema.Types.ObjectId
  color: string
  size: number
  quantity: number
  price: number
  totalPrice: number
}

const cartSchema: Schema<ICart> = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    items:[
      {
        productId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Product" },
        color: { type: String, required: true },
        size: { type: String, required: true }, 
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        totalPrice: { type: Number, required: true },
      }
    ],
    totalMoney: { type: Number, required: true },
  },
  {
    timestamps: true,
  },
)

const Cart: Model<ICart> = mongoose.model<ICart>("Cart", cartSchema)

export default Cart
