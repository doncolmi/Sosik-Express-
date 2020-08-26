import { Schema, model, Document } from "mongoose";
import { TopicFollow } from "./topic.interface";

const TopicFollowSchema = new Schema({
  topicName: { type: String, required: true },
  userId: { type: String, index: true, required: true },
  createdDate: { type: Date, default: Date.now },
  modifiedDate: { type: Date, default: Date.now },
});

export default model<TopicFollow & Document>("TopicFollow", TopicFollowSchema);
