import { Eye, EyeOff } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Standing } from "@/utils/tournamentUtils";
import { useState } from "react";

interface StandingsTableProps {
  standings: Standing[];
}

const StandingsTable = ({ standings }: StandingsTableProps) => {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <div className="bg-dashboard-card p-6 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-white">Team Standings</h3>
        <Button
          variant="outline"
          onClick={() => setIsVisible(!isVisible)}
          className="text-dashboard-text hover:text-white"
        >
          {isVisible ? (
            <>
              <EyeOff className="h-4 w-4 mr-2" />
              Hide Standings
            </>
          ) : (
            <>
              <Eye className="h-4 w-4 mr-2" />
              Show Standings
            </>
          )}
        </Button>
      </div>
      
      {isVisible && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-dashboard-text">Team</TableHead>
              <TableHead className="text-dashboard-text">W</TableHead>
              <TableHead className="text-dashboard-text">L</TableHead>
              <TableHead className="text-dashboard-text">Win %</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {standings?.map((standing, index) => (
              <TableRow key={standing.name} className={`hover:bg-muted/5 ${index === 0 ? "bg-[#FFD700]/30" : ""}`}>
                <TableCell className={index === 0 ? "text-[#FFD700] font-bold" : "text-white font-medium"}>
                  {standing.name}
                </TableCell>
                <TableCell className={index === 0 ? "text-[#FFD700] font-bold" : "text-dashboard-text"}>
                  {standing.wins}
                </TableCell>
                <TableCell className={index === 0 ? "text-[#FFD700] font-bold" : "text-dashboard-text"}>
                  {standing.losses}
                </TableCell>
                <TableCell className={index === 0 ? "text-[#FFD700] font-bold" : "text-dashboard-text"}>
                  {standing.winPercentage.toFixed(1)}%
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default StandingsTable;