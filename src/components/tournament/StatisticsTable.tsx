import React, { useState, useMemo } from 'react';
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
import { Player, Tournament } from '@/types/tournament';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

type StatType = 'cups' | 'ices' | 'defense';

interface StatisticsTableProps {
  players: Player[];
  tournament: Tournament;
}

const StatisticsTable: React.FC<StatisticsTableProps> = ({ players, tournament }) => {
  const [currentStat, setCurrentStat] = useState<StatType>('cups');
  const [isVisible, setIsVisible] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [includePlayoffStats, setIncludePlayoffStats] = useState(false);

  const isPlayoffsStarted = useMemo(() => {
    return players.some(player => 
      (player.stats.totalPlayoffCups || 0) > 0 ||
      (player.stats.totalPlayoffIces || 0) > 0 ||
      (player.stats.totalPlayoffDefenses || 0) > 0
    );
  }, [players]);

  const getSortedPlayers = (stat: StatType) => {
    return [...players].sort((a, b) => {
      switch (stat) {
        case 'cups':
          return (getStatValue(b, stat) || 0) - (getStatValue(a, stat) || 0);
        case 'ices':
          return (getStatValue(b, stat) || 0) - (getStatValue(a, stat) || 0);
        case 'defense':
          return (getStatValue(b, stat) || 0) - (getStatValue(a, stat) || 0);
        default:
          return 0;
      }
    });
  };

  const getStatValue = (player: Player, stat: StatType) => {
    const regularSeasonValue = (() => {
      switch (stat) {
        case 'cups':
          return player.stats.totalRegularSeasonCups || 0;
        case 'ices':
          return player.stats.totalRegularSeasonIces || 0;
        case 'defense':
          return player.stats.totalRegularSeasonDefenses || 0;
      }
    })();

    if (!includePlayoffStats) {
      return regularSeasonValue;
    }

    const playoffValue = (() => {
      switch (stat) {
        case 'cups':
          return player.stats.totalPlayoffCups || 0;
        case 'ices':
          return player.stats.totalPlayoffIces || 0;
        case 'defense':
          return player.stats.totalPlayoffDefenses || 0;
      }
    })();

    return regularSeasonValue + playoffValue;
  };

  const getDisplayPlayers = (sortedPlayers: Player[]) => {
    return showAll ? sortedPlayers : sortedPlayers.slice(0, 5);
  };

  return (
    <div className="bg-dashboard-card p-6 rounded-lg">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-white">Player Statistics</h3>
          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="playoff-mode"
                checked={includePlayoffStats}
                onCheckedChange={setIncludePlayoffStats}
                disabled={!isPlayoffsStarted}
                className={`${!isPlayoffsStarted ? 'cursor-not-allowed opacity-50' : ''} ${isPlayoffsStarted ? 'bg-dashboard-accent' : ''}`}
              />
              <Label 
                htmlFor="playoff-mode" 
                className={`text-sm ${isPlayoffsStarted ? 'text-dashboard-accent' : 'text-gray-500'}`}
              >
                {includePlayoffStats ? 'Including Playoff Stats' : 'Regular Season Only'}
              </Label>
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
        </div>

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
      
      {isVisible && (
        <>
          <Table className="mt-4">
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