import { Schema, model, Document } from "mongoose";
import { PressFollow } from "./press.interface";

const pressFollowSchema = new Schema({
  pressId: { type: String, required: true },
  userId: { type: String, index: true, required: true },
  createdDate: { type: Date, default: Date.now },
  modifiedDate: { type: Date, default: Date.now },
});

export default model<PressFollow & Document>("PressFollow", pressFollowSchema);
