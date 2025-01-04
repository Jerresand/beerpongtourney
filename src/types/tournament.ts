export interface Player { //stores all individual stats for each player and has a unique id, name does not need to be unique
  id: string;
  name: string;
  totalCups?: number;
  iced?: number;
  defense?: number;
  gamesPlayed: number;
}[];

// Base match type
export interface BaseMatch {
  id: string;
  teams: [{
    team: Team;
    score: number;
    playerStats: {
      player: Player;
      cups: number;
      defense: number;
      ices: number;
    }[];
  }, {
    team: Team;
    score: number;
    playerStats: {
      player: Player;
      cups: number;
      defense: number;
      ices: number;
    }[];
  }];  // Tuple type with team data directly in match
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
}

export type Match = RegularMatch | PlayoffMatch;

export interface Team { //each team has unique id, name can be the same, the assigned name should represent the team everywhere in the app
  id: string;
  name: string;
  players: Player[];
}

export interface Tournament {
  id: string;
  name: string;
  players: Player[];
  format: "singles" | "doubles";
  matchesPerTeam: number;
  type: "playoffs" | "regular+playoffs";
  regularMatches: RegularMatch[];
  playoffMatches: PlayoffMatch[];
  currentPhase: "regular" | "playoffs";
  createdAt: string;
  teams?: Team[];
}

export const isRegularMatch = (match: Match): match is RegularMatch => !match.isPlayoff;
export const isPlayoffMatch = (match: Match): match is PlayoffMatch => match.isPlayoff;
export const isPlayoffPhase = (tournament: Tournament) => tournament.currentPhase === "playoffs";