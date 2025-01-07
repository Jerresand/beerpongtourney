import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import TeamStatsSection from './TeamStatsSection';
import { 
  Match, 
  Team, 
  Player, 
  Tournament,
  MatchPlayerStats
} from '@/types/tournament';

interface MatchStatisticsManagerProps {
  match: Match;
  tournament: Tournament;
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    updatedMatch: Match,
    updatedTeams: Team[],
    updatedPlayers: Player[]
  ) => void;
}

interface TeamInputSection {
  teamId: string;
  score: number;
  playerStats: MatchPlayerStats[];
}

const MatchStatisticsManager = ({
  match,
  tournament,
  isOpen,
  onClose,
  onSave,
}: MatchStatisticsManagerProps) => {
  const { toast } = useToast();
  
  const team1 = tournament.teams.find(t => t.id === match.team1Id)!;
  const team2 = tournament.teams.find(t => t.id === match.team2Id)!;

  const [team1Section, setTeam1Section] = useState<TeamInputSection>({
    teamId: team1.id,
    score: match.team1Score,
    playerStats: match.team1PlayerStats?.length > 0 
      ? match.team1PlayerStats 
      : team1.players.map(p => ({
          playerId: p.id,
          cups: 0,
          ices: 0,
          defense: 0
        }))
  });

  const [team2Section, setTeam2Section] = useState<TeamInputSection>({
    teamId: team2.id,
    score: match.team2Score,
    playerStats: match.team2PlayerStats?.length > 0 
      ? match.team2PlayerStats 
      : team2.players.map(p => ({
          playerId: p.id,
          cups: 0,
          ices: 0,
          defense: 0
        }))
  });

  const handleSave = () => {
    // Allow 0-0 as a special case to indicate unplayed game
    if (team1Section.score === team2Section.score && (team1Section.score !== 0 || team2Section.score !== 0)) {
      toast({
        title: "Invalid Score",
        description: "Games cannot end in a tie, except 0-0 for unplayed games.",
        variant: "destructive"
      });
      return;
    }

    // First, remove the previous match stats if this is an edit
    if (match.isComplete) {
      // For playoff matches, we don't need to update team stats as they're tracked per series
      if (!match.isPlayoff) {
        // Remove previous team stats
        const previousWinner = match.team1Score > match.team2Score ? team1 : team2;
        const previousLoser = match.team1Score > match.team2Score ? team2 : team1;

        previousWinner.stats.wins--;
        previousWinner.stats.gamesPlayed--;
        previousLoser.stats.losses--;
        previousLoser.stats.gamesPlayed--;
      }

      // Remove previous player stats
      tournament.players.forEach(player => {
        const previousTeam1Stat = match.team1PlayerStats.find(ps => ps.playerId === player.id);
        const previousTeam2Stat = match.team2PlayerStats.find(ps => ps.playerId === player.id);
        const previousStats = previousTeam1Stat || previousTeam2Stat;

        if (previousStats) {
          player.stats.gamesPlayed--;
          if (match.isPlayoff) {
            player.stats.totalPlayoffGamesPlayed--;
            player.stats.totalPlayoffCups -= previousStats.cups;
            player.stats.totalPlayoffIces -= previousStats.ices;
            player.stats.totalPlayoffDefenses -= previousStats.defense;
          } else {
            player.stats.totalRegularSeasonCups -= previousStats.cups;
            player.stats.totalRegularSeasonIces -= previousStats.ices;
            player.stats.totalRegularSeasonDefenses -= previousStats.defense;
          }
        }
      });
    }

    // Only update stats if the game is actually played (not 0-0)
    if (team1Section.score !== 0 || team2Section.score !== 0) {
      // Now add the new stats
      const winner = team1Section.score > team2Section.score ? team1 : team2;
      const loser = team1Section.score > team2Section.score ? team2 : team1;

      // Update team stats only for regular season matches
      const updatedTeams = tournament.teams.map(team => {
        if (!match.isPlayoff) {
          if (team.id === winner.id) {
            return {
              ...team,
              stats: {
                ...team.stats,
                wins: (team.stats?.wins || 0) + 1,
                gamesPlayed: (team.stats?.gamesPlayed || 0) + 1
              }
            };
          }
          if (team.id === loser.id) {
            return {
              ...team,
              stats: {
                ...team.stats,
                losses: (team.stats?.losses || 0) + 1,
                gamesPlayed: (team.stats?.gamesPlayed || 0) + 1
              }
            };
          }
        }
        return team;
      });

      // Update player stats
      const updatedPlayers = tournament.players.map(player => {
        const team1Stats = team1Section.playerStats.find(ps => ps.playerId === player.id);
        const team2Stats = team2Section.playerStats.find(ps => ps.playerId === player.id);
        const matchStats = team1Stats || team2Stats;

        if (matchStats) {
          const updatedStats = { ...player.stats };
          updatedStats.gamesPlayed = (updatedStats.gamesPlayed || 0) + 1;

          if (match.isPlayoff) {
            updatedStats.totalPlayoffGamesPlayed = (updatedStats.totalPlayoffGamesPlayed || 0) + 1;
            updatedStats.totalPlayoffCups = (updatedStats.totalPlayoffCups || 0) + matchStats.cups;
            updatedStats.totalPlayoffIces = (updatedStats.totalPlayoffIces || 0) + matchStats.ices;
            updatedStats.totalPlayoffDefenses = (updatedStats.totalPlayoffDefenses || 0) + matchStats.defense;
          } else {
            updatedStats.totalRegularSeasonCups = (updatedStats.totalRegularSeasonCups || 0) + matchStats.cups;
            updatedStats.totalRegularSeasonIces = (updatedStats.totalRegularSeasonIces || 0) + matchStats.ices;
            updatedStats.totalRegularSeasonDefenses = (updatedStats.totalRegularSeasonDefenses || 0) + matchStats.defense;
          }

          return {
            ...player,
            stats: updatedStats
          };
        }
        return player;
      });

      // Create updated match
      const updatedMatch: Match = {
        ...match,
        team1Score: team1Section.score,
        team2Score: team2Section.score,
        team1PlayerStats: team1Section.playerStats,
        team2PlayerStats: team2Section.playerStats,
        isComplete: true
      };

      onSave(updatedMatch, updatedTeams, updatedPlayers);
      onClose();
    } else {
      // For 0-0 games, just update the match without affecting stats
      const updatedMatch: Match = {
        ...match,
        team1Score: 0,
        team2Score: 0,
        team1PlayerStats: team1Section.playerStats,
        team2PlayerStats: team2Section.playerStats,
        isComplete: false  // Mark as incomplete since it's unplayed
      };
      onSave(updatedMatch, tournament.teams, tournament.players);
      onClose();
      return;
    }
  };

  const handleReset = () => {
    // Reset team 1 stats
    setTeam1Section({
      teamId: team1.id,
      score: 0,
      playerStats: team1.players.map(p => ({
        playerId: p.id,
        cups: 0,
        ices: 0,
        defense: 0
      }))
    });

    // Reset team 2 stats
    setTeam2Section({
      teamId: team2.id,
      score: 0,
      playerStats: team2.players.map(p => ({
        playerId: p.id,
        cups: 0,
        ices: 0,
        defense: 0
      }))
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-dashboard-background text-dashboard-text max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-dashboard-text">Match Statistics</DialogTitle>
          <DialogDescription className="text-dashboard-muted">
            Enter match statistics for both teams
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <TeamStatsSection
            team={team1}
            score={team1Section.score}
            playerStats={team1Section.playerStats}
            onScoreChange={(score) => setTeam1Section({ ...team1Section, score })}
            onPlayerStatChange={(playerIndex, field, value) => {
              const newStats = [...team1Section.playerStats];
              newStats[playerIndex] = { ...newStats[playerIndex], [field]: value };
              setTeam1Section({ ...team1Section, playerStats: newStats });
            }}
          />
          <div className="border-t border-dashboard-muted" />
          <TeamStatsSection
            team={team2}
            score={team2Section.score}
            playerStats={team2Section.playerStats}
            onScoreChange={(score) => setTeam2Section({ ...team2Section, score })}
            onPlayerStatChange={(playerIndex, field, value) => {
              const newStats = [...team2Section.playerStats];
              newStats[playerIndex] = { ...newStats[playerIndex], [field]: value };
              setTeam2Section({ ...team2Section, playerStats: newStats });
            }}
          />
        </div>

        <div className="flex justify-end gap-2 pt-4 mt-4 border-t border-dashboard-muted">
          <Button 
            variant="outline"
            onClick={handleReset}
            className="bg-dashboard-background text-dashboard-text hover:bg-dashboard-muted"
          >
            Reset Stats
          </Button>
          <Button 
            variant="outline" 
            onClick={onClose}
            className="bg-dashboard-background text-dashboard-text hover:bg-dashboard-muted"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            className="bg-dashboard-accent text-black hover:bg-dashboard-highlight"
          >
            Save Match
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MatchStatisticsManager;