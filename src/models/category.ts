import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICategory extends Document {
    name: mongoose.Schema.Types.ObjectId;
    image: mongoose.Schema.Types.String;
}

const categorySchema: Schema<ICategory> = new Schema(
    {
        name: { type: String, required: true },
        image: {type: String, required: false}
    },
    {
        timestamps: true
    }
);

const Category: Model<ICategory> = mongoose.model<ICategory>("Category", categorySchema);

export default Category;
