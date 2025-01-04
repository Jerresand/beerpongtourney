import { Player, RegularMatch, Team } from "@/types/tournament";

export const generateRegularSeasonSchedule = (
  players: Player[], 
  cyclesCount: number,
  format: "singles" | "doubles"
): RegularMatch[] => {
  const allMatches: RegularMatch[] = [];
  
  if (players.length < 2) return allMatches;

  // Convert players into teams based on format
  const teams = format === "doubles" 
    ? Array.from({ length: Math.floor(players.length / 2) }, (_, i) => ({
        id: crypto.randomUUID(),
        name: `${players[i * 2].name} & ${players[(i * 2) + 1].name}`,
        players: [players[i * 2], players[(i * 2) + 1]]
      }))
    : players.map(player => ({
        id: crypto.randomUUID(),
        name: player.name,
        players: [player]
      }));

  const n = teams.length;
  const useTeams = n % 2 !== 0 ? [...teams, null] : teams;
  const roundsPerCycle = useTeams.length - 1;

  const generateOneCycle = () => {
    const matches: RegularMatch[] = [];
    const cycleTeams = [...useTeams];
    
    for (let round = 0; round < roundsPerCycle; round++) {
      const roundMatches: RegularMatch[] = [];
      
      for (let i = 0; i < cycleTeams.length / 2; i++) {
        const team1 = cycleTeams[i] as Team | null;
        const team2 = cycleTeams[cycleTeams.length - 1 - i] as Team | null;
        
        if (team1 && team2) {
          roundMatches.push({
            id: crypto.randomUUID(),
            isPlayoff: false,
            round: round + 1,
            teams: [{
              team: team1,
              score: 0,
              playerStats: team1.players.map(player => ({
                player,
                cups: 0,
                defense: 0,
                ices: 0
              }))
            }, {
              team: team2,
              score: 0,
              playerStats: team2.players.map(player => ({
                player,
                cups: 0,
                defense: 0,
                ices: 0
              }))
            }]
          });
        }
      }

      matches.push(...roundMatches);
      cycleTeams.splice(1, 0, cycleTeams.pop()!);
    }
    
    return matches;
  };

  for (let cycle = 0; cycle < cyclesCount; cycle++) {
    const cycleMatches = generateOneCycle();
    cycleMatches.forEach(match => {
      match.round += cycle * roundsPerCycle;
    });
    allMatches.push(...cycleMatches);
  }

  return allMatches;
};