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
  if (!tournament?.teams) return [];
  
  return tournament.teams.map(team => {
    const wins = team.stats?.wins || 0;
    const losses = team.stats?.losses || 0;
    const matchesPlayed = wins + losses;
    
    return {
      name: team.name,
      matchesPlayed,
      wins,
      losses,
      points: 0, // These could be calculated if needed
      pointsAgainst: 0,
      winPercentage: matchesPlayed > 0 ? (wins / matchesPlayed) * 100 : 0
    };
  }).sort((a, b) => 
    // Sort by win percentage first
    b.winPercentage - a.winPercentage || 
    // Then by total wins
    b.wins - a.wins
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

export const validateTournament = (players: Player[], format: "singles" | "doubles", type?: "playoffs" | "regular+playoffs"): { isValid: boolean; error?: string } => {
  if (players.length < 2) {
    return { isValid: false, error: "You need at least 2 players to create a tournament" };
  }

  if (players.length > 256) {
    return { isValid: false, error: "Maximum 256 players allowed in a tournament" };
  }

  if (format === "doubles") {
    if (players.length % 2 !== 0) {
      return { isValid: false, error: "⚠️ Cannot start tournament: Doubles tournaments require an even number of players" };
    }
    if (players.length < 4) {
      return { isValid: false, error: "⚠️ Cannot start tournament: Doubles tournaments require at least 4 players (2 teams)" };
    }
  }

  // Additional validation for playoff-only tournaments
  if (type === "playoffs") {
    const numPlayers = format === "doubles" ? players.length / 2 : players.length;
    const isPowerOfTwo = Math.log2(numPlayers) % 1 === 0;
    const validSizes = [2, 4, 8, 16, 32, 64, 128, 256];
    
    if (!isPowerOfTwo || !validSizes.includes(numPlayers)) {
      const nearestLower = validSizes.filter(size => size <= numPlayers).pop() || 2;
      const nearestHigher = validSizes.find(size => size >= numPlayers) || 256;
      return { 
        isValid: false, 
        error: `⚠️ Cannot start tournament: Playoff tournaments require ${format === "doubles" ? "teams" : "players"} count to be one of: ${validSizes.join(", ")}. Consider adjusting to ${nearestLower} or ${nearestHigher} ${format === "doubles" ? "teams" : "players"}.`
      };
    }
  }

  return { isValid: true };
};
