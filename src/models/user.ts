import mongoose, { Schema, Document, Model } from "mongoose";

interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: string;
    address?: string;  
    dob?: Date;        
}

const UserSchema: Schema<IUser> = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true },
        password: { type: String, required: true },
        role: { type: String, required: true },
        address: { type: String },
        dob: { type: Date }
    },
    {
        timestamps: true
    }
);

const User: Model<IUser> = mongoose.model<IUser>("User", UserSchema);

export default User;