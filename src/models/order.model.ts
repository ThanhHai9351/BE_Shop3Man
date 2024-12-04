import mongoose, { Schema, Document, Model } from "mongoose"
interface ItemCart {
  productid: mongoose.Schema.Types.ObjectId
  name: String
  price: Number
  quantity: Number
  totalMoney: Number
  size: Number
  color: String
}

interface IAddress {
  city: String
  district: String
  street: String
}

export interface IOrder extends Document {
  userid: mongoose.Schema.Types.ObjectId
  username: String
  items: ItemCart[]
  totalPrice: Number
  address: IAddress
  paymentMethod: String
  paidAt: Date
}

const orderScheme: Schema<IOrder> = new Schema(
  {
    userid: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    username: { type: String, required: true },
    items: [
      {
        productid: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Product" },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        totalMoney: { type: Number, required: true },
        size: { type: Number, required: true },
        color: { type: String, required: true },
      },
    ],
    totalPrice: { type: Number, required: true },
    address: {
      city: { type: String, required: true },
      dictrict: { type: String, required: true },
      street: { type: String, required: true },
    },
    paymentMethod: { type: String, required: true },
    paidAt: { type: Date, required: true },
  },
  {
    timestamps: true,
  },
)

const Order: Model<IOrder> = mongoose.model<IOrder>("Order", orderScheme)

export default Order
