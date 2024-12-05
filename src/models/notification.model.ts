import mongoose, { Schema, Document, Model } from "mongoose";

export enum NotificationType {
  COMMENT = "info",
  GLOBAL = "global",
}


export interface INotification extends Document {
  userId: mongoose.Types.ObjectId; 
  message: string; 
  type: NotificationType; 
}


const notificationSchema: Schema<INotification> = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
    message: { type: String, required: true }, 
    type: {
      type: String,
      enum: Object.values(NotificationType), 
      default: NotificationType.GLOBAL, 
      required: true,
    },
  },
  {
    timestamps: true, 
  }
);

const Notification: Model<INotification> = mongoose.model<INotification>(
  "Notification",
  notificationSchema
);

export default Notification;
