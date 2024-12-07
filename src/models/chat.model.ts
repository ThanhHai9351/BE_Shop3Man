import mongoose, { Schema, Document, Model } from "mongoose"

export interface IChat extends Document {
  userId: mongoose.Types.ObjectId
  userReceiveId: mongoose.Types.ObjectId
  message: string
  isSend: boolean
}

const chatSchema: Schema<IChat> = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    userReceiveId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true },
    isSend: { type: Boolean, default: false, required: true },
  },
  {
    timestamps: true,
  },
)

const Chat: Model<IChat> = mongoose.model<IChat>("Chat", chatSchema)

export default Chat
