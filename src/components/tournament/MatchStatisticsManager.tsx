import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
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

  const updateTeamScore = (teamSection: TeamInputSection, score: number) => {
    if (teamSection.teamId === team1.id) {
      setTeam1Section({ ...team1Section, score });
    } else {
      setTeam2Section({ ...team2Section, score });
    }
  };

  const updatePlayerStats = (
    teamSection: TeamInputSection,
    playerIndex: number,
    field: keyof Omit<MatchPlayerStats, 'playerId'>,
    value: number
  ) => {
    const newStats = [...teamSection.playerStats];
    newStats[playerIndex] = { ...newStats[playerIndex], [field]: value };

    if (teamSection.teamId === team1.id) {
      setTeam1Section({ ...team1Section, playerStats: newStats });
    } else {
      setTeam2Section({ ...team2Section, playerStats: newStats });
    }
  };

  const handleSave = () => {
    if (team1Section.score === team2Section.score) {
      toast({
        title: "Invalid Score",
        description: "Games cannot end in a tie.",
        variant: "destructive"
      });
      return;
    }

    const winner = team1Section.score > team2Section.score ? team1 : team2;
    const loser = team1Section.score > team2Section.score ? team2 : team1;

    // Update team stats
    const updatedTeams = tournament.teams.map(team => {
      if (team.id === winner.id) {
        return {
          ...team,
          stats: {
            wins: (team.stats?.wins || 0) + 1,
            losses: team.stats?.losses || 0,
            gamesPlayed: (team.stats?.gamesPlayed || 0) + 1
          }
        };
      }
      if (team.id === loser.id) {
        return {
          ...team,
          stats: {
            wins: team.stats?.wins || 0,
            losses: (team.stats?.losses || 0) + 1,
            gamesPlayed: (team.stats?.gamesPlayed || 0) + 1
          }
        };
      }
      return team;
    });

    // Update player stats
    const updatedPlayers = tournament.players.map(player => {
      const team1Stats = team1Section.playerStats.find(ps => ps.playerId === player.id);
      const team2Stats = team2Section.playerStats.find(ps => ps.playerId === player.id);
      const matchStats = team1Stats || team2Stats;

      if (matchStats) {
        return {
          ...player,
          stats: {
            gamesPlayed: (player.stats?.gamesPlayed || 0) + 1,
            totalCups: (player.stats?.totalCups || 0) + matchStats.cups,
            totalIces: (player.stats?.totalIces || 0) + matchStats.ices,
            totalDefenses: (player.stats?.totalDefenses || 0) + matchStats.defense
          }
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
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-dashboard-card text-white max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Match Statistics</DialogTitle>
          <DialogDescription className="text-gray-400">
            Enter match statistics for both teams
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <TeamStatsSection
            team={team1}
            score={team1Section.score}
            playerStats={team1Section.playerStats}
            onScoreChange={(score) => updateTeamScore(team1Section, score)}
            onPlayerStatChange={(playerIndex, field, value) => 
              updatePlayerStats(team1Section, playerIndex, field, value)
            }
          />
          <div className="border-t border-gray-700" />
          <TeamStatsSection
            team={team2}
            score={team2Section.score}
            playerStats={team2Section.playerStats}
            onScoreChange={(score) => updateTeamScore(team2Section, score)}
            onPlayerStatChange={(playerIndex, field, value) => 
              updatePlayerStats(team2Section, playerIndex, field, value)
            }
          />
        </div>

        <div className="flex justify-end gap-2 pt-4 mt-4 border-t border-gray-700">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            className="bg-green-600 hover:bg-green-700"
          >
            Save Match
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MatchStatisticsManager;
