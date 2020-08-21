import { Document } from "mongoose";

export interface User extends Document {
  _id: string;
  userId: number;
  name: string;
  profileImage: string;
  thumbnailImage: string;
  createdDate?: Date;
  modifiedDate?: Date;
}
