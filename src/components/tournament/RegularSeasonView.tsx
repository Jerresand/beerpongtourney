import React from 'react';
import { Tournament, Match, Team, Player } from '@/types/tournament';
import MatchSchedule from './MatchSchedule';
import TeamView from './TeamView';
import StandingsTable from './StandingsTable';
import { calculateRegularStandings } from '@/utils/tournamentUtils';

interface RegularSeasonViewProps {
  tournament: Tournament;
}

const RegularSeasonView = ({ tournament }: RegularSeasonViewProps) => {
  const standings = calculateRegularStandings(tournament);

  const handleMatchUpdate = (match: Match, updatedTeams: Team[], updatedPlayers: Player[]) => {
    // Get the current tournament data
    const tournaments = JSON.parse(localStorage.getItem('activeTournaments') || '[]');
    const tournamentIndex = tournaments.findIndex((t: Tournament) => t.id === tournament.id);
    
    if (tournamentIndex === -1) {
      console.error('Tournament not found');
      return;
    }

    // Update the tournament with new match data and team stats
    const updatedTournament = {
      ...tournaments[tournamentIndex],
      regularMatches: tournaments[tournamentIndex].regularMatches.map((m: Match) =>
        m.id === match.id ? match : m
      ),
      teams: updatedTeams,
      players: updatedPlayers
    };

    // Save the updated tournament
    tournaments[tournamentIndex] = updatedTournament;
    localStorage.setItem('activeTournaments', JSON.stringify(tournaments));

    // Force a re-render by updating the URL
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <div className="space-y-6">
      <StandingsTable standings={standings} />
      <MatchSchedule 
        matches={tournament.regularMatches}
        tournament={tournament}
        onMatchUpdate={handleMatchUpdate} 
      />
      <TeamView 
        tournament={tournament} 
        onTeamNameUpdate={(teamId, name) => {
          // Handle team name update
        }} 
      />
    </div>
  );
};

export default RegularSeasonView; 