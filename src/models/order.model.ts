import mongoose, { Schema, Document, Model } from "mongoose";

interface ItemCart {
  productId: mongoose.Types.ObjectId;
  color: string;
  size: number;
  quantity: number;
  price: number;
  totalPrice: number;
}


interface IAddress {
  city: string; 
  district: string;
  street: string;
}

export enum EStatus {
  PEDDING = "Pedding",
  PROCCESS = "Process",
  SUCCESS = "Success",
}

export enum EPayment {
  CASH = "Cash",
  VNPAY = "VNPay",
  MOMO = "MoMo",
}

export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId;
  items: ItemCart[];
  quantity_item: number;
  totalMoney: number; 
  address: IAddress;
  paymentMethod: EPayment;
  status: EStatus;
  paidAt: Date;
}

const itemCartSchema: Schema<ItemCart> = new Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Product" },
    color: { type: String, required: true },
    size: { type: Number, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
  },
  { _id: false } 
);


const addressSchema: Schema<IAddress> = new Schema(
  {
    city: { type: String, required: true },
    district: { type: String, required: true },
    street: { type: String, required: true },
  },
  { _id: false } 
);


const orderSchema: Schema<IOrder> = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    items: { type: [itemCartSchema], required: true }, 
    quantity_item: { type: Number, required: true },
    totalMoney: { type: Number, required: true },
    address: { type: addressSchema, required: true }, 
    paymentMethod: {
      type: String,
      enum: Object.values(EPayment), 
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(EStatus), 
      default: EStatus.PEDDING, 
    },
    paidAt: { type: Date, required: false },
  },
  {
    timestamps: true, 
  }
);

const Order: Model<IOrder> = mongoose.model<IOrder>("Order", orderSchema);

export default Order;
