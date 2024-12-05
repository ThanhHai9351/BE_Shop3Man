import mongoose, { Schema, Document, Model } from "mongoose"

export interface INotification extends Document {
  user: mongoose.Schema.Types.ObjectId
  message: String
}

const notificationSchema: Schema<INotification> = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    message: { type: String, required: true },
  },
  {
    timestamps: true,
  },
)

const Notification: Model<INotification> = mongoose.model<INotification>("Notification", notificationSchema)

export default Notification
