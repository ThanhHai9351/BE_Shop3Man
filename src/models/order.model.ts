import mongoose, { Schema, Document, Model } from "mongoose"
import { ICart, cartSchema } from "./cart.model"

export enum EStatus {
  PENDING = "pending",
  SUCCESS = "success",
  CANCEL = "cancel",
}

export enum EPayment {
  CASH = "cash",
  VNPAY = "vnpay",
  MOMO = "momo",
}

export interface IAddress {
  city: string
  district: string
  street: string
}

export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId
  items: ICart[]
  quantity_item: number
  totalMoney: number
  address: IAddress
  paymentMethod: EPayment
  status: EStatus
  paidAt?: Date
}

// Định nghĩa schema cho address
const addressSchema = new Schema<IAddress>({
  city: { type: String, required: true },
  district: { type: String, required: true },
  street: { type: String, required: true },
})

const orderSchema: Schema<IOrder> = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    items: { type: [cartSchema], required: true }, // Sử dụng schema của ICart
    quantity_item: { type: Number, required: true },
    totalMoney: { type: Number, required: true },
    address: { type: addressSchema, required: true }, // Sử dụng schema thay vì TypeScript interface
    paymentMethod: {
      type: String,
      enum: Object.values(EPayment),
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(EStatus),
      default: EStatus.PENDING,
    },
    paidAt: { type: Date, required: false },
  },
  {
    timestamps: true,
  },
)

const Order: Model<IOrder> = mongoose.model<IOrder>("Order", orderSchema)

export default Order
