import { Player, RegularMatch, Team } from "@/types/tournament";

export const generateRegularSeasonSchedule = (
  teams: Team[],
  cyclesCount: number
): RegularMatch[] => {
  const allMatches: RegularMatch[] = [];
  
  if (teams.length < 2) return allMatches;

  const n = teams.length;
  const useTeams = n % 2 !== 0 ? [...teams, null] : teams; // Add null for bye
  const roundsPerCycle = useTeams.length - 1;

  // Generate one complete round-robin cycle
  const generateOneCycle = () => {
    const matches: RegularMatch[] = [];
    const cycleTeams = [...useTeams];
    
    // Each team needs to face every other team once
    for (let round = 0; round < roundsPerCycle; round++) {
      const roundMatches: RegularMatch[] = [];
      
      // Pair up teams for this round
      for (let i = 0; i < cycleTeams.length / 2; i++) {
        const team1 = cycleTeams[i];
        const team2 = cycleTeams[cycleTeams.length - 1 - i];
        
        // Only create match if neither team is null (bye)
        if (team1 && team2) {
          roundMatches.push({
            id: crypto.randomUUID(),
            team1Id: team1.id,
            team2Id: team2.id,
            team1Score: 0,
            team2Score: 0,
            team1PlayerStats: team1.players.map(player => ({
              playerId: player.id,
              cups: 0,
              ices: 0,
              defense: 0
            })),
            team2PlayerStats: team2.players.map(player => ({
              playerId: player.id,
              cups: 0,
              ices: 0,
              defense: 0
            })),
            isPlayoff: false,
            round: round + 1,
            isComplete: false
          });
        }
      }

      matches.push(...roundMatches);
      
      // Rotate teams: keep first team fixed, rotate all others
      cycleTeams.splice(1, 0, cycleTeams.pop()!);
    }
    
    return matches;
  };

  // Generate the specified number of cycles
  for (let cycle = 0; cycle < cyclesCount; cycle++) {
    const cycleMatches = generateOneCycle();
    
    // Update round numbers for this cycle
    cycleMatches.forEach(match => {
      match.round += cycle * roundsPerCycle;
    });
    
    allMatches.push(...cycleMatches);
  }

  return allMatches;
};