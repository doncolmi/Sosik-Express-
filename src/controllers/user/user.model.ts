import { Schema, model, Document } from "mongoose";
import { User } from "./user.interface";

const userSchema = new Schema({
  userId: { type: String, index: true, required: true },
  name: String,
  profileImage: String,
  thumbnailImage: String,
  createdDate: { type: Date, default: Date.now },
  modifiedDate: { type: Date, default: Date.now },
});

export default model<User>("User", userSchema);
