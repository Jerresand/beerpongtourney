import React from 'react';
import { Tournament, Match, Team, Player, isRegularMatch } from '@/types/tournament';
import MatchSchedule from './MatchSchedule';
import StandingsTable from './StandingsTable';
import StatisticsTable from './StatisticsTable';
import { Standing } from '@/utils/tournamentUtils';

interface RegularSeasonViewProps {
  tournament: Tournament;
  onTournamentUpdate: (tournament: Tournament) => void;
  isPlayoffsStarted?: boolean;
}

const RegularSeasonView: React.FC<RegularSeasonViewProps> = ({ 
  tournament, 
  onTournamentUpdate,
  isPlayoffsStarted = false 
}) => {
  const handleMatchUpdate = (updatedMatch: Match, updatedTeams: Team[], updatedPlayers: Player[]) => {
    // Update the tournament with new data
    const updatedTournament: Tournament = {
      ...tournament,
      teams: updatedTeams,
      players: updatedPlayers,
      regularMatches: tournament.regularMatches.map(match => 
        match.id === updatedMatch.id ? { ...updatedMatch, isPlayoff: false, round: isRegularMatch(match) ? match.round : 1 } : match
      )
    };

    // Save to localStorage
    const tournaments = JSON.parse(localStorage.getItem("activeTournaments") || "[]");
    const updatedTournaments = tournaments.map((t: Tournament) => 
      t.id === tournament.id ? updatedTournament : t
    );
    localStorage.setItem("activeTournaments", JSON.stringify(updatedTournaments));

    // Update parent state
    onTournamentUpdate(updatedTournament);
  };

  // Calculate standings
  const standings: Standing[] = tournament.teams.map(team => ({
    name: team.name,
    wins: team.stats?.wins || 0,
    losses: team.stats?.losses || 0,
    winPercentage: team.stats?.gamesPlayed 
      ? (team.stats.wins / team.stats.gamesPlayed) * 100 
      : 0,
    matchesPlayed: team.stats?.gamesPlayed || 0,
    points: team.stats?.wins || 0,
    pointsAgainst: team.stats?.losses || 0
  })).sort((a, b) => {
    // First, sort by wins
    if (a.wins !== b.wins) {
      return b.wins - a.wins;
    }
    // If wins are equal, sort by fewer losses (prioritize teams that played fewer games)
    return a.losses - b.losses;
  });

  return (
    <div className="space-y-6">
      <MatchSchedule 
        matches={tournament.regularMatches}
        tournament={tournament}
        onMatchUpdate={handleMatchUpdate}
        isEditingDisabled={isPlayoffsStarted}
      />
      <StandingsTable standings={standings} />
      <StatisticsTable players={tournament.players} />
    </div>
  );
};

export default RegularSeasonView;