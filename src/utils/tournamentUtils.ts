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

export const calculateStandings = (tournament: Tournament | null): Standing[] => {
  if (!tournament?.players || !tournament?.regularMatches) {
    return [];
  }

  const playerStats: { [key: string]: Standing } = {};

  // Initialize stats for all players
  tournament.players.forEach(player => {
    playerStats[player.name] = {
      name: player.name,
      matchesPlayed: 0,
      wins: 0,
      losses: 0,
      points: 0,
      pointsAgainst: 0,
      winPercentage: 0
    };
  });

  // Only process matches that have scores
  tournament.regularMatches
    .filter(match => match.team1Score !== undefined && match.team2Score !== undefined)
    .forEach(match => {
      // Process match statistics only if both scores exist
      const team1Players = match.team1Players || [];
      const team2Players = match.team2Players || [];
      
      if (match.team1Score! > match.team2Score!) {
        // Team 1 won
        team1Players.forEach(({ player }) => {
          playerStats[player.name].wins++;
          playerStats[player.name].matchesPlayed++;
          playerStats[player.name].points += match.team1Score!;
          playerStats[player.name].pointsAgainst += match.team2Score!;
        });
        team2Players.forEach(({player}) => {
          playerStats[player.name].losses++;
          playerStats[player.name].matchesPlayed++;
          playerStats[player.name].points += match.team2Score!;
          playerStats[player.name].pointsAgainst += match.team1Score!;
        });
      } else if (match.team2Score! > match.team1Score!) {
        // Team 2 won
        team2Players.forEach(({ player }) => {
          playerStats[player.name].wins++;
          playerStats[player.name].matchesPlayed++;
          playerStats[player.name].points += match.team2Score!;
          playerStats[player.name].pointsAgainst += match.team1Score!;
        });
        team1Players.forEach(({player}) => {
          playerStats[player.name].losses++;
          playerStats[player.name].matchesPlayed++;
          playerStats[player.name].points += match.team1Score!;
          playerStats[player.name].pointsAgainst += match.team2Score!;
        });
      }
    });

  // Calculate win percentages and convert to array
  return Object.values(playerStats)
    .map(stats => ({
      ...stats,
      winPercentage: stats.matchesPlayed > 0 
        ? (stats.wins / stats.matchesPlayed) * 100 
        : 0
    }))
    .sort((a, b) => b.winPercentage - a.winPercentage);
};