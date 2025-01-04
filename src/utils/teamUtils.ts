import { Player, Team } from "@/types/tournament";

export const createTeam = (players: Player[]): Omit<Team, 'id'> => {
  return {
    name: players.length === 1 
      ? players[0].name 
      : `${players[0].name} & ${players[1].name}`,
    players: players,
    stats: {
      wins: 0,
      losses: 0,
      gamesPlayed: 0
    }
  };
}; 