import { Tournament, Player, Match } from "@/types/tournament";

export interface Standing {
  name: string;
  matchesPlayed: number;
  wins: number;
  losses: number;
  points: number;
  pointsAgainst: number;
  winPercentage: number;
}

export const calculateRegularStandings = (tournament: Tournament | null): Standing[] => {
  if (!tournament?.players || !tournament?.regularMatches) {
    return [];
  }
  
  const playerStats = new Map<string, Standing>();

  // Initialize standings for all players
  tournament.players.forEach(player => {
    playerStats.set(player.name, {
      name: player.name,
      matchesPlayed: 0,
      wins: 0,
      losses: 0,
      points: 0,
      pointsAgainst: 0,
      winPercentage: 0
    });
  });

  // Calculate wins and losses
  tournament.regularMatches.forEach(match => {
    if (!match.team1Players || !match.team2Players) 
      return;
    if (match.team1Score === undefined || match.team2Score === undefined) 
      return;

    const team1Won = match.team1Score > match.team2Score;
    
    // Process team 1 players
    match.team1Players.forEach(({ player }) => {
      const stats = playerStats.get(player.name);
      if (stats) {
        stats.matchesPlayed++;
        if (team1Won) {
          stats.wins++;
        } else {
          stats.losses++;
        }
        stats.points += match.team1Score;
        stats.pointsAgainst += match.team2Score;
        stats.winPercentage = (stats.wins / stats.matchesPlayed) * 100;
      }
    });

    // Process team 2 players
    match.team2Players.forEach(({ player }) => {
      const stats = playerStats.get(player.name);
      if (stats) {
        stats.matchesPlayed++;
        if (!team1Won) {
          stats.wins++;
        } else {
          stats.losses++;
        }
        stats.points += match.team2Score;
        stats.pointsAgainst += match.team1Score;
        stats.winPercentage = (stats.wins / stats.matchesPlayed) * 100;
      }
    });
  });

  return Array.from(playerStats.values())
    .sort((a, b) => b.winPercentage - a.winPercentage);
};

export const calculateStandings = calculateRegularStandings;