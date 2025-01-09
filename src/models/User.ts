import mongoose, { Document, Model } from 'mongoose';

export interface IUser {
  facebookId: string;
  name: string;
  email?: string;
  profilePicture?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserDocument extends IUser, Document {}

const userSchema = new mongoose.Schema<IUserDocument>(
  {
    facebookId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: String,
    profilePicture: String,
  },
  {
    timestamps: true,
  }
);

export const User: Model<IUserDocument> = mongoose.models.User || mongoose.model<IUserDocument>('User', userSchema); 