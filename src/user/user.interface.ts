import { Document, ObjectId } from 'mongoose';

export interface User extends Document {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  accessToken: string;
  secret?: string,
  authEnabled: boolean
}

export interface QRCode {
  qrCodeUrl?: string;
}

export interface VerifyCode {
  tokenVerified?: boolean;
  user: User
}

export interface Secret {
  base32: string
}