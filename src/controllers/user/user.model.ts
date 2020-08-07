import { Schema, model, Document } from 'mongoose';
import { User } from './user.interface';

const userSchema = new Schema({
    user_id: Number,
    name: String,
    profile_image: String,
    thumbnail_image: String,
});

export default model<User & Document>('User', userSchema);