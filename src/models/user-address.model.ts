import mongoose, { Schema, Model } from "mongoose"

export interface IUserAddress {
  userId: mongoose.Schema.Types.ObjectId
  city: string
  district: string
  street: string
}

const UserAddressSchema: Schema<IUserAddress> = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    city: { type: String, required: true },
    district: { type: String, required: true },
    street: { type: String, required: true },
  },
  {
    timestamps: true,
  },
)

const UserAddress: Model<IUserAddress> = mongoose.model<IUserAddress>("UserAddress", UserAddressSchema)

export default UserAddress
