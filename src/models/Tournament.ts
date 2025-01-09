import mongoose from 'mongoose';
import { IUser } from './User';

export interface ITournament {
  name: string;
  createdBy: mongoose.Types.ObjectId | IUser;
  participants: mongoose.Types.ObjectId[] | IUser[];
  startDate: Date;
  endDate?: Date;
  status: 'upcoming' | 'active' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

const tournamentSchema = new mongoose.Schema<ITournament>(
  {
    name: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    participants: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    startDate: {
      type: Date,
      required: true,
    },
    endDate: Date,
    status: {
      type: String,
      enum: ['upcoming', 'active', 'completed'],
      default: 'upcoming',
    },
  },
  {
    timestamps: true,
  }
);

export const Tournament = mongoose.models.Tournament || mongoose.model<ITournament>('Tournament', tournamentSchema); 