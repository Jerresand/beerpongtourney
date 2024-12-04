import { Tournament, Player, Match } from "@/types/tournament";

export interface Standing {
  player: Player;
  wins: number;
  losses: number;
  winPercentage: number;
}

export const calculateStandings = (tournament: Tournament | null): Standing[] => {
  if (!tournament?.players || !tournament?.matches) {
    return [];
  }
  
  const playerStats = new Map<string, Standing>();

  // Initialize standings for all players
  tournament.players.forEach(player => {
    playerStats.set(player.name, {
      player: {
        name: player.name,
        totalCups: player.totalCups || 0,
        iced: player.iced || 0,
        defense: player.defense || 0
      },
      wins: 0,
      losses: 0,
      winPercentage: 0
    });
  });

  // Calculate wins and losses
  tournament.matches.forEach(match => {
    if (!match.team1Players || !match.team2Players) return;
    if (match.team1Score === undefined || match.team2Score === undefined) return;

    const team1Won = match.team1Score > match.team2Score;
    
    match.team1Players.forEach(({ player }) => {
      const stats = playerStats.get(player.name);
      if (stats) {
        if (team1Won) stats.wins += 1;
        else stats.losses += 1;
        stats.winPercentage = stats.wins / (stats.wins + stats.losses);
      }
    });

    match.team2Players.forEach(({ player }) => {
      const stats = playerStats.get(player.name);
      if (stats) {
        if (!team1Won) stats.wins += 1;
        else stats.losses += 1;
        stats.winPercentage = stats.wins / (stats.wins + stats.losses);
      }
    });
  });

  return Array.from(playerStats.values()).sort((a, b) => b.winPercentage - a.winPercentage);
};