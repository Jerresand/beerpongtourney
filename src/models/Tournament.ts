import mongoose, { Model } from 'mongoose';

// Keep track of whether the model has been compiled
let Tournament: Model<any>;

try {
  // Try to get existing model
  Tournament = mongoose.model('Tournament');
} catch {
  // Model doesn't exist, create new one
  const TournamentSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    format: {
      type: String,
      enum: ['singles', 'doubles'],
      required: true,
    },
    matchesPerTeam: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: ['playoffs', 'regular+playoffs'],
      required: true,
    },
    players: [{
      id: String,
      name: String,
      stats: {
        gamesPlayed: { type: Number, default: 0 },
        totalRegularSeasonCups: { type: Number, default: 0 },
        totalRegularSeasonIces: { type: Number, default: 0 },
        totalRegularSeasonDefenses: { type: Number, default: 0 },
        totalPlayoffGamesPlayed: { type: Number, default: 0 },
        totalPlayoffCups: { type: Number, default: 0 },
        totalPlayoffIces: { type: Number, default: 0 },
        totalPlayoffDefenses: { type: Number, default: 0 }
      }
    }],
    teams: [{
      id: String,
      name: String,
      players: [{
        id: String,
        name: String,
        stats: {
          gamesPlayed: { type: Number, default: 0 },
          totalRegularSeasonCups: { type: Number, default: 0 },
          totalRegularSeasonIces: { type: Number, default: 0 },
          totalRegularSeasonDefenses: { type: Number, default: 0 },
          totalPlayoffGamesPlayed: { type: Number, default: 0 },
          totalPlayoffCups: { type: Number, default: 0 },
          totalPlayoffIces: { type: Number, default: 0 },
          totalPlayoffDefenses: { type: Number, default: 0 }
        }
      }],
      wins: {
        type: Number,
        default: 0,
      },
      losses: {
        type: Number,
        default: 0,
      },
    }],
    regularMatches: [{
      id: String,
      team1Id: String,
      team2Id: String,
      team1Score: { type: Number, default: 0 },
      team2Score: { type: Number, default: 0 },
      team1PlayerStats: [{
        playerId: String,
        cups: { type: Number, default: 0 },
        ices: { type: Number, default: 0 },
        defense: { type: Number, default: 0 }
      }],
      team2PlayerStats: [{
        playerId: String,
        cups: { type: Number, default: 0 },
        ices: { type: Number, default: 0 },
        defense: { type: Number, default: 0 }
      }],
      isPlayoff: { type: Boolean, default: false },
      round: Number,
      isComplete: { type: Boolean, default: false }
    }],
    playoffMatches: [{
      id: String,
      team1Id: String,
      team2Id: String,
      team1Score: { type: Number, default: 0 },
      team2Score: { type: Number, default: 0 },
      team1PlayerStats: [{
        playerId: String,
        cups: { type: Number, default: 0 },
        ices: { type: Number, default: 0 },
        defense: { type: Number, default: 0 }
      }],
      team2PlayerStats: [{
        playerId: String,
        cups: { type: Number, default: 0 },
        ices: { type: Number, default: 0 },
        defense: { type: Number, default: 0 }
      }],
      isComplete: { type: Boolean, default: false },
      isPlayoff: { type: Boolean, default: true },
      series: Number,
      bestOf: Number,
      games: [{
        team1Score: { type: Number, default: 0 },
        team2Score: { type: Number, default: 0 },
        team1PlayerStats: [{
          playerId: String,
          cups: { type: Number, default: 0 },
          ices: { type: Number, default: 0 },
          defense: { type: Number, default: 0 }
        }],
        team2PlayerStats: [{
          playerId: String,
          cups: { type: Number, default: 0 },
          ices: { type: Number, default: 0 },
          defense: { type: Number, default: 0 }
        }],
        isComplete: { type: Boolean, default: false }
      }]
    }],
    currentPhase: {
      type: String,
      enum: ['regular', 'playoffs'],
      default: 'regular'
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    lastVisited: {
      type: Date,
    },
    userId: {
      type: String,
      required: true,
    },
    playoffSeedMap: {
      type: Map,
      of: Number
    },
    bestOf: {
      type: Number,
      required: true
    }
  });

  Tournament = mongoose.model('Tournament', TournamentSchema);
}

export default Tournament; 