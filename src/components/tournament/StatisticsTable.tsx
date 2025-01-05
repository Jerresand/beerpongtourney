import React, { useState } from 'react';
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Player } from '@/types/tournament';

type StatType = 'cups' | 'ices' | 'defense';

interface StatisticsTableProps {
  players: Player[];
}

const StatisticsTable: React.FC<StatisticsTableProps> = ({ players }) => {
  const [currentStat, setCurrentStat] = useState<StatType>('cups');
  const [isVisible, setIsVisible] = useState(true);
  const [showAll, setShowAll] = useState(false);

  const getSortedPlayers = (stat: StatType) => {
    return [...players].sort((a, b) => {
      switch (stat) {
        case 'cups':
          return (b.stats.totalCups || 0) - (a.stats.totalCups || 0);
        case 'ices':
          return (b.stats.totalIces || 0) - (a.stats.totalIces || 0);
        case 'defense':
          return (b.stats.totalDefenses || 0) - (a.stats.totalDefenses || 0);
        default:
          return 0;
      }
    });
  };

  const getStatValue = (player: Player, stat: StatType) => {
    switch (stat) {
      case 'cups':
        return player.stats.totalCups || 0;
      case 'ices':
        return player.stats.totalIces || 0;
      case 'defense':
        return player.stats.totalDefenses || 0;
    }
  };

  const getDisplayPlayers = (sortedPlayers: Player[]) => {
    return showAll ? sortedPlayers : sortedPlayers.slice(0, 5);
  };

  return (
    <div className="bg-dashboard-card p-6 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-white">Player Statistics</h3>
          {isVisible && (
            <div className="flex gap-2">
              <Button
                variant={currentStat === 'cups' ? 'default' : 'outline'}
                onClick={() => setCurrentStat('cups')}
                size="sm"
                className={currentStat === 'cups' 
                  ? "bg-dashboard-accent text-black hover:bg-dashboard-highlight"
                  : "bg-dashboard-background text-dashboard-text hover:bg-dashboard-muted"}
              >
                Cups
              </Button>
              <Button
                variant={currentStat === 'ices' ? 'default' : 'outline'}
                onClick={() => setCurrentStat('ices')}
                size="sm"
                className={currentStat === 'ices'
                  ? "bg-dashboard-accent text-black hover:bg-dashboard-highlight"
                  : "bg-dashboard-background text-dashboard-text hover:bg-dashboard-muted"}
              >
                Ices
              </Button>
              <Button
                variant={currentStat === 'defense' ? 'default' : 'outline'}
                onClick={() => setCurrentStat('defense')}
                size="sm"
                className={currentStat === 'defense'
                  ? "bg-dashboard-accent text-black hover:bg-dashboard-highlight"
                  : "bg-dashboard-background text-dashboard-text hover:bg-dashboard-muted"}
              >
                Defense
              </Button>
            </div>
          )}
        </div>
        <Button
          variant="outline"
          onClick={() => setIsVisible(!isVisible)}
          className="text-dashboard-text hover:text-white"
        >
          {isVisible ? (
            <>
              <EyeOff className="h-4 w-4 mr-2" />
              Hide Stats
            </>
          ) : (
            <>
              <Eye className="h-4 w-4 mr-2" />
              Show Stats
            </>
          )}
        </Button>
      </div>
      
      {isVisible && (
        <>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-dashboard-text">Rank</TableHead>
                <TableHead className="text-dashboard-text">Player</TableHead>
                <TableHead className="text-dashboard-text text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {getDisplayPlayers(getSortedPlayers(currentStat)).map((player, index) => (
                <TableRow key={player.id} className={`hover:bg-muted/5 ${index === 0 ? "bg-[#FFD700]/30" : ""}`}>
                  <TableCell className={`font-medium ${index === 0 ? "text-[#FFD700]" : "text-dashboard-text"}`}>
                    #{index + 1}
                  </TableCell>
                  <TableCell className={index === 0 ? "text-[#FFD700] font-bold" : "text-white"}>
                    {player.name}
                  </TableCell>
                  <TableCell className={`text-right ${index === 0 ? "text-[#FFD700] font-bold" : "text-white"}`}>
                    {getStatValue(player, currentStat)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {players.length > 5 && (
            <div className="mt-2 flex justify-center">
              <Button
                variant="ghost"
                onClick={() => setShowAll(!showAll)}
                size="sm"
                className="text-dashboard-text hover:text-white"
              >
                {showAll ? 'Show Top 5' : 'Show All Players'}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default StatisticsTable; 