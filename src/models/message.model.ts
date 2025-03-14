import mongoose, { Document, Model } from "mongoose"

export enum EStatusMessage {
  SENT = "sent",
  DELIVERED = "delivered",
  READ = "read",
}

export interface IMessage extends Document {
  conversationId: mongoose.Types.ObjectId
  senderId: mongoose.Types.ObjectId
  content: string
  timestamp: Date
  status: EStatusMessage
}

const MessageSchema = new mongoose.Schema(
  {
    conversationId: { type: mongoose.Schema.Types.ObjectId, ref: "Conversation", required: true },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    status: { type: String, enum: EStatusMessage.SENT, default: EStatusMessage.SENT },
  },
  {
    timestamps: true,
  },
)

const Message: Model<IMessage> = mongoose.model<IMessage>("Message", MessageSchema)

export default Message
