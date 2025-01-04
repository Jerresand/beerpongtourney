import React, { useState, useEffect } from 'react';
import { Tournament, Match, Team, Player } from '@/types/tournament';
import MatchSchedule from './MatchSchedule';
import TeamView from './TeamView';
import StandingsTable from './StandingsTable';
import { calculateRegularStandings } from '@/utils/tournamentUtils';

interface RegularSeasonViewProps {
  tournament: Tournament;
}

const RegularSeasonView = ({ tournament: initialTournament }: RegularSeasonViewProps) => {
  const [tournament, setTournament] = useState(initialTournament);

  // Listen for storage events to update the tournament data
  useEffect(() => {
    const handleStorageChange = () => {
      const tournaments = JSON.parse(localStorage.getItem('activeTournaments') || '[]');
      const updatedTournament = tournaments.find((t: Tournament) => t.id === tournament.id);
      if (updatedTournament) {
        setTournament(updatedTournament);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [tournament.id]);

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
    setTournament(updatedTournament);
  };

  const handleTeamNameUpdate = (teamId: string, newName: string) => {
    // Get the current tournament data
    const tournaments = JSON.parse(localStorage.getItem('activeTournaments') || '[]');
    const tournamentIndex = tournaments.findIndex((t: Tournament) => t.id === tournament.id);
    
    if (tournamentIndex === -1) {
      console.error('Tournament not found');
      return;
    }

    // Update the team name in the tournament's teams array
    const updatedTournament = {
      ...tournaments[tournamentIndex],
      teams: tournaments[tournamentIndex].teams.map((team: Team) =>
        team.id === teamId ? { ...team, name: newName } : team
      )
    };

    // Save the updated tournament
    tournaments[tournamentIndex] = updatedTournament;
    localStorage.setItem('activeTournaments', JSON.stringify(tournaments));
    
    // Update local state
    setTournament(updatedTournament);
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
        onTeamNameUpdate={handleTeamNameUpdate}
      />
    </div>
  );
};

export default RegularSeasonView;