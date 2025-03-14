import mongoose, { Document, Model } from "mongoose"

export enum ConversationType {
  ONE_TO_ONE = "one-to-one",
  GROUP = "group",
}

export interface IConversation extends Document {
  type: ConversationType
  name: string
  members: mongoose.Types.ObjectId[]
  lastMessage: string
}

const ConversationSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ConversationType, default: ConversationType.ONE_TO_ONE },
    name: { type: String, required: false },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    lastMessage: { type: String, required: false },
  },
  {
    timestamps: true,
  },
)

const Conversation: Model<IConversation> = mongoose.model<IConversation>("Conversation", ConversationSchema)

export default Conversation
