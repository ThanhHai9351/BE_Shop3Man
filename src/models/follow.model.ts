import mongoose, { model, mongo, Schema } from "mongoose"

interface IFollow {
  followerId: mongoose.Types.ObjectId
  followingId: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const followSchema = new Schema<IFollow>(
  {
    followerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    followingId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  },
)

const Follow = model<IFollow>("Follow", followSchema)

export default Follow
