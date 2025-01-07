export interface PlayerStats {
  gamesPlayed: number;
  totalRegularSeasonCups: number;
  totalRegularSeasonIces: number;
  totalRegularSeasonDefenses: number;
  totalPlayoffGamesPlayed: number;
  totalPlayoffCups: number;
  totalPlayoffIces: number;
  totalPlayoffDefenses: number;
}

export interface Player {
  id: string;
  name: string;
  stats: PlayerStats;
}

export interface TeamStats {
  wins: number;
  losses: number;
  gamesPlayed: number;
}

export interface Team {
  id: string;
  name: string;
  players: Player[];
  stats: TeamStats;
}

export interface MatchPlayerStats {
  playerId: string;
  cups: number;
  ices: number;
  defense: number;
}

// Base match type
export interface BaseMatch {
  id: string;
  team1Id: string;
  team2Id: string;
  team1Score: number;
  team2Score: number;
  team1PlayerStats: MatchPlayerStats[];
  team2PlayerStats: MatchPlayerStats[];
  isComplete: boolean;
}

// Regular season match
export interface RegularMatch extends BaseMatch {
  isPlayoff: false;
  round: number;
}

// Playoff match
export interface PlayoffMatch extends BaseMatch {
  isPlayoff: true;
  series: number;
  bestOf: number; // Number of games needed to win the series (1, 3, or 5)
  games: {
    team1Score: number;
    team2Score: number;
    team1PlayerStats: MatchPlayerStats[];
    team2PlayerStats: MatchPlayerStats[];
    isComplete: boolean;
  }[];
}

export type Match = RegularMatch | PlayoffMatch;

export interface Tournament {
  id: string;
  name: string;
  players: Player[];
  teams: Team[];
  format: "singles" | "doubles";
  matchesPerTeam: number;
  type: "playoffs" | "regular+playoffs";
  regularMatches: Match[];
  playoffMatches: PlayoffMatch[];
  currentPhase: "regular" | "playoffs";
  createdAt: string;
  lastVisited?: string;
  playoffSeedMap?: Record<string, number>; // Maps team IDs to their playoff seeds
  bestOf?: number; // Add this to track tournament-wide series length
}

export const isRegularMatch = (match: Match): match is RegularMatch => !match.isPlayoff;
export const isPlayoffMatch = (match: Match): match is PlayoffMatch => match.isPlayoff;
export const isPlayoffPhase = (tournament: Tournament) => tournament.currentPhase === "playoffs";