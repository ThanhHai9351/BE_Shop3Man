import mongoose,{Schema, Document, Model} from "mongoose";

interface ICart extends Document {
    userid: mongoose.Schema.Types.ObjectId;
    productid: mongoose.Schema.Types.ObjectId;
    quantity: Number,
    username: String,
    productname: String
}

const cartSchema: Schema<ICart> = new Schema(
    {
        userid: { type: mongoose.Schema.Types.ObjectId, required: true,ref: 'User' },
        productid: { type: mongoose.Schema.Types.ObjectId, required: true,ref: 'Product' },
        quantity: {type: Number, required: true},
        username: {type:String, required: true},
        productname: {type:String, required: true}
    },
    {
        timestamps: true
    }
);

const Cart: Model<ICart> = mongoose.model<ICart>("Cart", cartSchema);

export default Cart;
