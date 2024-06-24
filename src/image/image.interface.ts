import { Document } from 'mongoose';

export interface Image extends Document {
  _id: string;
  image: string;
  mimeType: string;
  createdAt: string;
  updatedAt: string;
}