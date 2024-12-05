import mongoose, { Schema, Document, Model } from "mongoose"

export interface IChat extends Document {
  senderId: mongoose.Schema.Types.ObjectId
  receiverId: mongoose.Schema.Types.ObjectId
  message: String
  isSend: boolean
}

const chatSchema: Schema<IChat> = new Schema(
  {
    senderId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    receiverId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    message: { type: String, required: true },
    isSend: { type: Boolean, required: true },
  },
  {
    timestamps: true,
  },
)

const Chat : Model<IChat> = mongoose.model<IChat>("Chat ", chatSchema)

export default Chat 
