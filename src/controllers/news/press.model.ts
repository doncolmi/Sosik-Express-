import { Schema, model, Document } from "mongoose";
import { Press } from "./news.interface";

const pressSchema = new Schema({
  pressId: { type: String, index: true, required: true },
  pressName: String,
  pressNewsCount: Number,
});

export default model<Press & Document>("Press", pressSchema);
