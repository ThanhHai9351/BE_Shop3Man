
import mongoose, { Model, Schema } from "mongoose";

interface IRoom  {
  user: String,
  message: String,
};

interface Room {
  idRoom: String,
  user: String,
  chat: IRoom[],
}

const roomSchema:Schema<Room> = new Schema({
  idRoom : {type: String, require: true},
  user:  {type: String, require: true},
  chat: [
    {
      user : {type: String, require: true},
      message: {type:String, require: true}
    }
  ]
});

const Room: Model<Room> = mongoose.model<Room>("Room", roomSchema)

export default Room

