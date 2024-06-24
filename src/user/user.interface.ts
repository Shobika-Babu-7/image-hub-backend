import { Document, ObjectId } from 'mongoose';

export interface User extends Document {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  accessToken: string;
}