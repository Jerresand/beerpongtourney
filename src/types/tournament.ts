export interface Player {
  id: string;
  name: string;
  totalCups?: number;
  iced?: number;
  defense?: number;
  gamesPlayed: number;
}

export interface Team {
  id: string;
  name: string;
  players: Player[];
}

// Base match type with common properties
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
  }];
}

export interface RegularMatch extends BaseMatch {
  isPlayoff: false;
  round: number;
}

export interface PlayoffMatch extends BaseMatch {
  isPlayoff: true;
  series: number;
}

export type Match = RegularMatch | PlayoffMatch;

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