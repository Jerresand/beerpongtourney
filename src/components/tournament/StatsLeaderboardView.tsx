import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Match, Player } from '@/types/tournament';

interface StatsLeaderboardProps {
  matches: Match[];
}

const StatsLeaderboardView = ({ matches }: StatsLeaderboardProps) => {
  const uniquePlayers = new Map<string, Player>();
  
  matches.forEach(match => {
    match.teams.forEach(team => {
      team.playerStats.forEach(({ player }) => {
        uniquePlayers.set(player.id, player);
      });
    });
  });

  const players = Array.from(uniquePlayers.values())
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="bg-dashboard-card p-6 rounded-lg">
      <h3 className="text-xl font-bold text-white mb-4">Player Stats</h3>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Player</TableHead>
            <TableHead className="text-right">Games</TableHead>
            <TableHead className="text-right">Cups</TableHead>
            <TableHead className="text-right">Cups/G</TableHead>
            <TableHead className="text-right">Ices</TableHead>
            <TableHead className="text-right">Ices/G</TableHead>
            <TableHead className="text-right">Defense</TableHead>
            <TableHead className="text-right">Def/G</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {players.map((player) => {
            const gamesPlayed = player.gamesPlayed || 0;
            const totalCups = player.totalCups || 0;
            const totalIces = player.iced || 0;
            const totalDefense = player.defense || 0;

            return (
              <TableRow key={player.name} className="hover:bg-muted/5">
                <TableCell className="text-white font-medium">
                  {player.name}
                </TableCell>
                <TableCell className="text-dashboard-text text-right">
                  {gamesPlayed}
                </TableCell>
                <TableCell className="text-dashboard-text text-right">
                  {totalCups}
                </TableCell>
                <TableCell className="text-dashboard-text text-right">
                  {gamesPlayed > 0 ? (totalCups / gamesPlayed).toFixed(1) : '0.0'}
                </TableCell>
                <TableCell className="text-dashboard-text text-right">
                  {totalIces}
                </TableCell>
                <TableCell className="text-dashboard-text text-right">
                  {gamesPlayed > 0 ? (totalIces / gamesPlayed).toFixed(1) : '0.0'}
                </TableCell>
                <TableCell className="text-dashboard-text text-right">
                  {totalDefense}
                </TableCell>
                <TableCell className="text-dashboard-text text-right">
                  {gamesPlayed > 0 ? (totalDefense / gamesPlayed).toFixed(1) : '0.0'}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default StatsLeaderboardView;
