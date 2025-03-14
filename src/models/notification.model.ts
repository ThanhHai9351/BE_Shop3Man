import mongoose, { Document, Model } from "mongoose"

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId
  type: string
  content: string
  isRead: boolean
}

const NotificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, required: true },
    content: { type: String, required: true },
    isRead: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
)

const Notification: Model<INotification> = mongoose.model<INotification>("Notification", NotificationSchema)

export default Notification
