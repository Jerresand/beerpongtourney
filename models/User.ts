import mongoose, { Document, Model } from 'mongoose';

export interface IUser {
  facebookId: string;
  name: string;
  email?: string;
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
        enum: ['en', 'es', 'fr'],
        default: 'en',
      },
    },
  },
  {
    timestamps: true,
  }
);

export const User: Model<IUserDocument> = mongoose.models.User || mongoose.model<IUserDocument>('User', userSchema); 