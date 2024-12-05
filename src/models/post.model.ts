import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPost extends Document {
  title: string;
  description: string;
  image: { imageUrl: string }[]; 
  video: string;
  productId: mongoose.Types.ObjectId; 
}

const postSchema: Schema<IPost> = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true }, 
    image: [
      {
        imageUrl: { type: String, required: false }, 
      },
    ],
    video: { type: String, required: false }, 
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true }, 
  },
  {
    timestamps: true, 
  }
);

const Post: Model<IPost> = mongoose.model<IPost>("Post", postSchema);

export default Post;
