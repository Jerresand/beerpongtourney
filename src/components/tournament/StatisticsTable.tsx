import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Player } from '@/types/tournament';

type StatType = 'cups' | 'ices' | 'defense';

interface StatisticsTableProps {
  players: Player[];
}

const StatisticsTable: React.FC<StatisticsTableProps> = ({ players }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentStat, setCurrentStat] = useState<StatType>('cups');

  useEffect(() => {
    console.log('StatisticsTable received players:', players);
    players.forEach(player => {
      console.log(`${player.name}'s stats:`, player.stats);
    });
  }, [players]);

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

  const getStatTitle = (stat: StatType) => {
    switch (stat) {
      case 'cups':
        return 'Cups Leaderboard';
      case 'ices':
        return 'Ices Leaderboard';
      case 'defense':
        return 'Defense Leaderboard';
    }
  };

  if (!isVisible) {
    return (
      <Button 
        onClick={() => setIsVisible(true)}
        className="bg-dashboard-accent text-black hover:bg-dashboard-highlight"
      >
        Show Statistics
      </Button>
    );
  }

  return (
    <Card className="bg-dashboard-card">
      <CardHeader className="space-y-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-white">{getStatTitle(currentStat)}</CardTitle>
          <Button 
            variant="ghost" 
            onClick={() => setIsVisible(false)}
            className="text-dashboard-text hover:bg-dashboard-background"
          >
            Close
          </Button>
        </div>
        <div className="flex gap-2">
          <Button
            variant={currentStat === 'cups' ? 'default' : 'outline'}
            onClick={() => setCurrentStat('cups')}
            className={currentStat === 'cups' 
              ? "bg-dashboard-accent text-black hover:bg-dashboard-highlight"
              : "bg-dashboard-background text-dashboard-text hover:bg-dashboard-muted"}
          >
            Cups
          </Button>
          <Button
            variant={currentStat === 'ices' ? 'default' : 'outline'}
            onClick={() => setCurrentStat('ices')}
            className={currentStat === 'ices'
              ? "bg-dashboard-accent text-black hover:bg-dashboard-highlight"
              : "bg-dashboard-background text-dashboard-text hover:bg-dashboard-muted"}
          >
            Ices
          </Button>
          <Button
            variant={currentStat === 'defense' ? 'default' : 'outline'}
            onClick={() => setCurrentStat('defense')}
            className={currentStat === 'defense'
              ? "bg-dashboard-accent text-black hover:bg-dashboard-highlight"
              : "bg-dashboard-background text-dashboard-text hover:bg-dashboard-muted"}
          >
            Defense
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-dashboard-text">Rank</TableHead>
              <TableHead className="text-dashboard-text">Player</TableHead>
              <TableHead className="text-dashboard-text text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {getSortedPlayers(currentStat).map((player, index) => (
              <TableRow key={player.id} className="hover:bg-muted/5">
                <TableCell className="text-dashboard-text font-medium">
                  #{index + 1}
                </TableCell>
                <TableCell className="text-white">
                  {player.name}
                </TableCell>
                <TableCell className="text-white text-right">
                  {getStatValue(player, currentStat)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default StatisticsTable; 