export interface Player {
  name: string;
  totalCups?: number;
  iced?: number;
  defense?: number;
}

export interface Match {
  id: string;
  team1Score: number;
  team2Score: number;
  team1Players: {
    player: Player;
    cups: number;
    defense: number;
    isIcer: boolean;
  }[];
  team2Players: {
    player: Player;
    cups: number;
    defense: number;
    isIcer: boolean;
  }[];
  date: string;
}

export interface Tournament {
  id: string;
  name: string;
  players: Player[];
  matches: Match[];
  format: "singles" | "doubles";
  type: "playoffs" | "regular+playoffs";
}