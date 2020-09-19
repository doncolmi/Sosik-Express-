import { Schema, model, Document } from "mongoose";
import { SaveNews } from "./save.interface";

const SaveNewsSchema = new Schema({
  userId: { type: Number, index: true, required: true },
  newsId: { type: String, required: true },
  createdDate: { type: Date, default: Date.now },
  modifiedDate: { type: Date, default: Date.now },
});

export default model<SaveNews & Document>("SaveNews", SaveNewsSchema);
