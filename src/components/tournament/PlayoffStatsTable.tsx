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
import { Player, Tournament, PlayoffMatch } from '@/types/tournament';

type StatType = 'cups' | 'ices' | 'defense';

interface PlayoffStatsTableProps {
  tournament: Tournament;
}

interface PlayoffPlayerStats {
  playerId: string;
  name: string;
  cups: number;
  ices: number;
  defense: number;
}

const PlayoffStatsTable: React.FC<PlayoffStatsTableProps> = ({ tournament }) => {
  const [currentStat, setCurrentStat] = useState<StatType>('cups');
  const [isVisible, setIsVisible] = useState(true);
  const [showAll, setShowAll] = useState(false);

  // Calculate playoff stats for each player
  const calculatePlayoffStats = (): PlayoffPlayerStats[] => {
    const playerStats: Record<string, PlayoffPlayerStats> = {};

    // Initialize stats for all players
    tournament.players.forEach(player => {
      playerStats[player.id] = {
        playerId: player.id,
        name: player.name,
        cups: player.stats.totalPlayoffCups || 0,
        ices: player.stats.totalPlayoffIces || 0,
        defense: player.stats.totalPlayoffDefenses || 0
      };
    });

    return Object.values(playerStats);
  };

  const getSortedPlayers = (stat: StatType) => {
    const playoffStats = calculatePlayoffStats();
    return [...playoffStats].sort((a, b) => {
      switch (stat) {
        case 'cups':
          return b.cups - a.cups;
        case 'ices':
          return b.ices - a.ices;
        case 'defense':
          return b.defense - a.defense;
        default:
          return 0;
      }
    });
  };

  const getStatValue = (player: PlayoffPlayerStats, stat: StatType) => {
    switch (stat) {
      case 'cups':
        return player.cups;
      case 'ices':
        return player.ices;
      case 'defense':
        return player.defense;
    }
  };

  const getDisplayPlayers = (sortedPlayers: PlayoffPlayerStats[]) => {
    return showAll ? sortedPlayers : sortedPlayers.slice(0, 5);
  };

  return (
    <div className="bg-dashboard-card p-6 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-white">Playoff Statistics</h3>
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
                <TableRow key={player.playerId} className={`hover:bg-muted/5 ${index === 0 ? "bg-[#FFD700]/30" : ""}`}>
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
          {tournament.players.length > 5 && (
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

export default PlayoffStatsTable; 