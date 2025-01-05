import React from 'react';
import { Tournament, Match, Team, Player } from '@/types/tournament';
import MatchSchedule from './MatchSchedule';

interface RegularSeasonViewProps {
  tournament: Tournament;
  onTournamentUpdate: (tournament: Tournament) => void;
}

const RegularSeasonView: React.FC<RegularSeasonViewProps> = ({ tournament, onTournamentUpdate }) => {
  const handleMatchUpdate = (updatedMatch: Match, updatedTeams: Team[], updatedPlayers: Player[]) => {
    // Update the tournament with new data
    const updatedTournament: Tournament = {
      ...tournament,
      teams: updatedTeams,
      players: updatedPlayers,
      regularMatches: tournament.regularMatches.map(match => 
        match.id === updatedMatch.id ? { ...updatedMatch, isPlayoff: false, round: match.round } : match
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

  return (
    <div className="space-y-6">
      <MatchSchedule 
        matches={tournament.regularMatches}
        tournament={tournament}
        onMatchUpdate={handleMatchUpdate}
      />
    </div>
  );
};

export default RegularSeasonView;