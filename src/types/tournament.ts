export interface Player {
  name: string;
  totalCups?: number;
  iced?: number;
  defense?: number;
}

// Base match type
export interface BaseMatch {
  id: string;
  team1Score: number;
  team2Score: number;
  team1Players: {
    player: Player;
    cups: number;
    defense: number;
    ices: number;
  }[];
  team2Players: {
    player: Player;
    cups: number;
    defense: number;
    ices: number;
  }[];
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

export interface Team {
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