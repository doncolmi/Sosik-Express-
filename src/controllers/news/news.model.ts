import { Schema, model, Document } from "mongoose";
import { News } from "./news.interface";

const newsSchema = new Schema({
  newsId: { type: String, index: true, required: true },
  title: String,
  contents: String,
  newsDate: String,
  href: String,
  pressId: String,
  topicName: String,
  createdDate: Date,
  modifiedDate: Date,
});

export default model<News & Document>("News", newsSchema);
