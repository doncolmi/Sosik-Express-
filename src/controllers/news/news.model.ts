import { Schema, model, Document } from "mongoose";
import { News } from "./news.interface";

const newsSchema = new Schema({
  newsId: { type: String, index: true, required: true, unique: true },
  title: String,
  contents: String,
  newsDate: String,
  href: String,
  pressId: { type: String, index: true },
  pressName: String,
  topicName: { type: String, index: true },
  fakeNews: { type: Number, default: 0 },
  createdDate: { type: Date, default: Date.now, index: true },
  modifiedDate: { type: Date, default: Date.now },
});

export default model<News & Document>("News", newsSchema);
