import mongoose, { Schema, Document, Model } from "mongoose";

interface ICategory extends Document {
    name: mongoose.Schema.Types.ObjectId;
}

const categorySchema: Schema<ICategory> = new Schema(
    {
        name: { type: String, required: true }
    },
    {
        timestamps: true
    }
);

const Category: Model<ICategory> = mongoose.model<ICategory>("Category", categorySchema);

export default Category;
