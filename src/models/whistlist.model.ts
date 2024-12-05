import mongoose, { Schema, Model } from "mongoose"

export interface IWhistList {
  userId: mongoose.Schema.Types.ObjectId
  items: IWhistListItem[]
}

export interface IWhistListItem{
  productId: mongoose.Schema.Types.ObjectId,
  name: String;
  imageUrl: String;
  price: Number
}

const whistlistSchema: Schema<IWhistList> = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Product" },
        name: { type: String, required: true },
        imageUrl: { type: String },
        price: { type: Number, required: true },
      }
    ]
  },
  {
    timestamps: true,
  },
)

const WhistList: Model<IWhistList> = mongoose.model<IWhistList>("WhistList", whistlistSchema)

export default WhistList
