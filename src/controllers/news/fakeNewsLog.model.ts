import { Schema, model, Document } from "mongoose";
import { fakeNewsLog } from "./news.interface";

const fakeNewsLogModel = new Schema({
  userId: { type: Number, index: true, required: true },
  newsId: { type: String, required: true},
  createdDate: { type: Date, default: Date.now },
  modifiedDate: { type: Date, default: Date.now },
});

export default model<fakeNewsLog & Document>("FakeNewsLog", fakeNewsLogModel);
