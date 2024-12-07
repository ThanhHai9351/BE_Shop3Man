import mongoose, { Schema, Model } from "mongoose"

export interface IUser {
  userId: mongoose.Schema.Types.ObjectId
  city: string
  district: string
  street: string
}

const UserSchema: Schema<IUser> = new Schema(
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

const User: Model<IUser> = mongoose.model<IUser>("User", UserSchema)

export default User
