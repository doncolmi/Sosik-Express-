import { Schema, model, Document } from "mongoose";
import { Press } from "./press.interface";

const pressSchema = new Schema({
  pressId: { type: String, index: true, required: true, unique: true },
  pressName: String,
});

export default model<Press & Document>("Press", pressSchema);
