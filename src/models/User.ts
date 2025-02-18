import mongoose, { Document, Model } from 'mongoose';

export interface IUser {
  name: string;
  email: string;
  profilePicture?: string;
  preferences?: {
    theme?: 'light' | 'dark';
    notifications?: boolean;
    language?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserDocument extends IUser, Document {}

const userSchema = new mongoose.Schema<IUserDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    profilePicture: String,
    preferences: {
      theme: {
        type: String,
        enum: ['light', 'dark'],
        default: 'dark',
      },
      notifications: {
        type: Boolean,
        default: false,
      },
      language: {
        type: String,
        enum: ['en', 'sv'],
        default: 'en',
      },
    },
  },
  {
    timestamps: true,
  }
);

export const User: Model<IUserDocument> = mongoose.models.User || mongoose.model<IUserDocument>('User', userSchema); 