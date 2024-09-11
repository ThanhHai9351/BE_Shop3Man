import mongoose, { Schema, Document, Model } from "mongoose";

interface ISize {
    numberSize: number;
    quantity: number;
}

interface IColor {
    name: string;
    size: ISize[];
}

export interface IProduct extends Document {
    name: string;
    price: number;
    imageMain?: string;
    image?: string[];
    description?: string;
    categoryid: mongoose.Schema.Types.ObjectId;
    quantity: number;
    color?: IColor[];
    size?: {
        numberSize: number;
        color: {
            name: string;
            quantity: number;
        }[];
    }[];
}

const ProductSchema: Schema<IProduct> = new Schema(
    {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        imageMain: { type: String },
        image: [{ type: String }],
        description: { type: String },
        categoryid: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Category' },
        quantity: { type: Number, required: true },
        color: [{
            name: { type: String, required: true },
            size: [{
                numberSize: { type: Number, required: true },
                quantity: { type: Number, required: true }
            }]
        }],
        size: [{
            numberSize: { type: Number, required: true },
            color: [{
                name: { type: String, required: true },
                quantity: { type: Number, required: true }
            }]
        }]
    },
    {
        timestamps: true
    }
);

const Product: Model<IProduct> = mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
