import { Tournament } from './tournament';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface CreateTournamentResponse extends ApiResponse<Tournament> {}
export interface GetTournamentResponse extends ApiResponse<Tournament> {}
export interface GetTournamentsResponse extends ApiResponse<Tournament[]> {}
export interface UpdateTournamentResponse extends ApiResponse<Tournament> {}

export interface MongoTournament extends Omit<Tournament, 'id'> {
  _id: string;
  userId: string;
  lastVisited?: string;
  updatedAt?: string;
}

export interface TournamentUpdateData extends Partial<Tournament> {
  id: string;
} 