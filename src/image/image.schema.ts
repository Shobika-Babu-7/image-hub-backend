import { Schema } from 'mongoose';

export const ImageSchema = new Schema({
  image: { type: String, required: true },
  mimeType: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  createdAt: { type: String, required: true },
  updatedAt: { type: String, required: true },
});