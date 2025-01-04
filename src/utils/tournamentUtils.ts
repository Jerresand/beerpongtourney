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

  // For each match, update stats based on team scores
  tournament.regularMatches.forEach(match => {
    const team1Score = match.teams[0].score;
    const team2Score = match.teams[1].score;

    if (team1Score > team2Score) {
      match.teams[0].playerStats.forEach(stat => {
        const stats = playerStats.get(stat.player.name)!;
        stats.wins++;
        stats.matchesPlayed++;
      });
      match.teams[1].playerStats.forEach(stat => {
        const stats = playerStats.get(stat.player.name)!;
        stats.losses++;
        stats.matchesPlayed++;
      });
    } else if (team2Score > team1Score) {
      match.teams[1].playerStats.forEach(stat => {
        const stats = playerStats.get(stat.player.name)!;
        stats.wins++;
        stats.matchesPlayed++;
      });
      match.teams[0].playerStats.forEach(stat => {
        const stats = playerStats.get(stat.player.name)!;
        stats.losses++;
        stats.matchesPlayed++;
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

export const generateTeams = (players: Player[], format: "singles" | "doubles"): Team[] | undefined => {
  if (format === "singles") return undefined;
  
  const teams: Team[] = [];
  for (let i = 0; i < players.length; i += 2) {
    teams.push({
      id: crypto.randomUUID(),
      name: `${players[i].name} & ${players[i + 1].name}`,
      players: [players[i], players[i + 1]]
    });
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