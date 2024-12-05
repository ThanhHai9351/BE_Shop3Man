import mongoose, { Schema, Document, Model } from "mongoose";


export interface IComment extends Document {
  postId: mongoose.Types.ObjectId; 
  userId: mongoose.Types.ObjectId; 
  message: string;
}


const commentSchema: Schema<IComment> = new Schema(
  {
    postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true }, 
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
    message: { type: String, required: true }, 
  },
  {
    timestamps: true, 
  }
);

const Comment: Model<IComment> = mongoose.model<IComment>("Comment", commentSchema);

export default Comment;
