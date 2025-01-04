import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Standing } from "@/utils/tournamentUtils";

interface StandingsTableProps {
  standings: Standing[];
}

const StandingsTable = ({ standings }: StandingsTableProps) => {
  return (
    <div className="bg-dashboard-card p-6 rounded-lg">
      <h3 className="text-xl font-bold text-white mb-4">Standings</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Player</TableHead>
            <TableHead>W</TableHead>
            <TableHead>L</TableHead>
            <TableHead>Win %</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {standings?.map((standing) => (
            <TableRow key={standing.name}>
              <TableCell className="text-white">{standing.name}</TableCell>
              <TableCell className="text-dashboard-text">{standing.wins}</TableCell>
              <TableCell className="text-dashboard-text">{standing.losses}</TableCell>
              <TableCell className="text-dashboard-text">
                {standing.winPercentage.toFixed(1)}%
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default StandingsTable;