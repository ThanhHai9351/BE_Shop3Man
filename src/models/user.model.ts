import mongoose, { Schema, Document, Model } from "mongoose"

export interface IUser extends Document {
  firstName: string
  lastName:String
  email: string
  password: string
  role: string
  dob: Date
  phone?: String
  avatarUrl?: string
}


const UserSchema: Schema<IUser> = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: false },
    password: { type: String, required: true },
    role: { type: String, required: true },
    dob: { type: Date },
    avatarUrl: { type: String },
  },
  {
    timestamps: true,
  },
)

const User: Model<IUser> = mongoose.model<IUser>("User", UserSchema)

export default User
