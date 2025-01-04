import { Tournament, Player, Match, Team } from "@/types/tournament";

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
  if (!tournament?.players || !tournament?.regularMatches) return [];
  
  const playerStats = new Map<string, Standing>();

  // Initialize all players with 0 stats
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

  // For each match, give wins/losses based on score
  tournament.regularMatches.forEach(match => {
    const team1 = tournament.teams.find(t => t.id === match.team1Id);
    const team2 = tournament.teams.find(t => t.id === match.team2Id);

    if (!team1 || !team2) return;

    if (match.team1Score > match.team2Score) {
      team1.players.forEach(p => {
        const stats = playerStats.get(p.name);
        if (stats) {
          stats.wins++;
          stats.matchesPlayed++;
        }
      });
      team2.players.forEach(p => {
        const stats = playerStats.get(p.name);
        if (stats) {
          stats.losses++;
          stats.matchesPlayed++;
        }
      });
    } else if (match.team2Score > match.team1Score) {
      team2.players.forEach(p => {
        const stats = playerStats.get(p.name);
        if (stats) {
          stats.wins++;
          stats.matchesPlayed++;
        }
      });
      team1.players.forEach(p => {
        const stats = playerStats.get(p.name);
        if (stats) {
          stats.losses++;
          stats.matchesPlayed++;
        }
      });
    }
  });

  // Calculate win percentages and convert to array
  return Array.from(playerStats.values())
    .map(stats => ({
      ...stats,
      winPercentage: stats.matchesPlayed > 0 
        ? Math.round((stats.wins / stats.matchesPlayed) * 100) 
        : 0
    }))
    .sort((a, b) => 
      // Sort by win percentage first, then by total points if tied
      b.winPercentage - a.winPercentage || b.points - a.points
    );
};

export const calculatePlayoffStandings = (tournament: Tournament | null): Standing[] => {
  return [];  // Return empty array for now
};

export const calculateStandings = calculateRegularStandings;

export const generateTeams = (players: Player[], format: "singles" | "doubles"): Team[] => {
  if (format === "singles") {
    return players.map(player => ({
      id: crypto.randomUUID(),
      name: player.name,
      players: [player],
      stats: {
        wins: 0,
        losses: 0,
        gamesPlayed: 0
      }
    }));
  }
  
  const teams: Team[] = [];
  for (let i = 0; i < players.length; i += 2) {
    if (i + 1 < players.length) {
      teams.push({
        id: crypto.randomUUID(),
        name: `${players[i].name} & ${players[i + 1].name}`,
        players: [players[i], players[i + 1]],
        stats: {
          wins: 0,
          losses: 0,
          gamesPlayed: 0
        }
      });
    }
  }
  return teams;
};

export const validateTournament = (players: Player[], format: "singles" | "doubles"): { isValid: boolean; error?: string } => {
  if (players.length < 2) {
    return { isValid: false, error: "You need at least 2 players to create a tournament" };
  }

  if (players.length > 256) {
    return { isValid: false, error: "Maximum 256 players allowed in a tournament" };
  }

  if (format === "doubles") {
    if (players.length % 2 !== 0) {
      return { isValid: false, error: "Doubles tournaments require an even number of players" };
    }
    if (players.length < 4) {
      return { isValid: false, error: "Doubles tournaments require at least 4 players (2 teams)" };
    }
  }

  return { isValid: true };
};