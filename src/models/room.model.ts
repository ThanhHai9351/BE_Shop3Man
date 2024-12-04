import mongoose, { Model, Schema } from "mongoose"

interface IRoomItem {
  user: String
  message: String
}

export interface IRoom {
  idRoom: String
  userA_id: mongoose.Schema.Types.ObjectId
  userB_id: mongoose.Schema.Types.ObjectId
  userA: String
  userB: String
  chat: IRoomItem[]
}

const roomSchema: Schema<IRoom> = new Schema({
  idRoom: { type: String, require: true },
  userA_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "user" },
  userB_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "user" },
  userA: { type: String, require: true },
  userB: { type: String, require: true },
  chat: [
    {
      user: { type: String, require: true },
      message: { type: String, require: true },
    },
  ],
})

const Room: Model<IRoom> = mongoose.model<IRoom>("Room", roomSchema)

export default Room
