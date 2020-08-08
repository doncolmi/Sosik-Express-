import { Schema, model, Document } from "mongoose";
import { User } from "./user.interface";

const userSchema = new Schema({
  userId: { type: String, index: true, required: true },
  name: String,
  profileImage: String,
  thumbnailImage: String,
});

export default model<User & Document>("User", userSchema);
