import connectDB from '@/lib/db';
import Tournament from '@/models/Tournament';
import { Tournament as TournamentType } from '@/types/tournament';
import { 
  MongoTournament, 
  TournamentUpdateData,
  CreateTournamentResponse,
  GetTournamentResponse,
  GetTournamentsResponse,
  UpdateTournamentResponse,
  ApiResponse
} from '@/types/api';

// Helper function to convert MongoDB document to our Tournament type
const convertMongoTournament = (mongoTournament: MongoTournament): TournamentType => {
  const { _id, userId, updatedAt, ...rest } = mongoTournament;
  return {
    ...rest,
    id: _id
  };
};

export const tournamentApi = {
  async createTournament(tournamentData: Omit<TournamentType, 'id'> & { userId: string }): Promise<CreateTournamentResponse> {
    try {
      await connectDB();
      const tournament = await Tournament.create(tournamentData);
      return {
        success: true,
        data: convertMongoTournament(tournament.toObject())
      };
    } catch (error) {
      console.error('Failed to create tournament:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create tournament'
      };
    }
  },

  async getTournaments(userId: string): Promise<GetTournamentsResponse> {
    try {
      await connectDB();
      const tournaments = await Tournament.find({ userId }).sort({ lastVisited: -1, createdAt: -1 });
      return {
        success: true,
        data: tournaments.map(t => convertMongoTournament(t.toObject()))
      };
    } catch (error) {
      console.error('Failed to fetch tournaments:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch tournaments'
      };
    }
  },

  async getTournament(id: string): Promise<GetTournamentResponse> {
    try {
      await connectDB();
      const tournament = await Tournament.findById(id);
      if (!tournament) {
        return {
          success: false,
          error: 'Tournament not found'
        };
      }
      return {
        success: true,
        data: convertMongoTournament(tournament.toObject())
      };
    } catch (error) {
      console.error('Failed to fetch tournament:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch tournament'
      };
    }
  },

  async updateTournament(id: string, updateData: TournamentUpdateData): Promise<UpdateTournamentResponse> {
    try {
      await connectDB();
      const { id: _, ...updateFields } = updateData;
      const tournament = await Tournament.findByIdAndUpdate(
        id,
        { ...updateFields, updatedAt: new Date().toISOString() },
        { new: true }
      );
      if (!tournament) {
        return {
          success: false,
          error: 'Tournament not found'
        };
      }
      return {
        success: true,
        data: convertMongoTournament(tournament.toObject())
      };
    } catch (error) {
      console.error('Failed to update tournament:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update tournament'
      };
    }
  },

  async deleteTournament(id: string): Promise<ApiResponse<void>> {
    try {
      await connectDB();
      await Tournament.findByIdAndDelete(id);
      return {
        success: true
      };
    } catch (error) {
      console.error('Failed to delete tournament:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete tournament'
      };
    }
  }
}; 