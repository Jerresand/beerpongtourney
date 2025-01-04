import React from 'react';
import { Match } from '@/types/tournament';

interface TeamViewProps {
  matches: Match[];
  onTeamNameUpdate: (teamId: string, newName: string) => void;
}

const TeamView: React.FC<TeamViewProps> = ({ matches, onTeamNameUpdate }) => {
  return (
    <div>
      {matches.map((match) => (
        <div key={match.id} className="match">
          <h4>{match.teams[0].team.name} vs {match.teams[1].team.name}</h4>
          <div>
            <input
              type="text"
              defaultValue={match.teams[0].team.name}
              onBlur={(e) => onTeamNameUpdate(match.teams[0].team.id, e.target.value)}
            />
            <input
              type="text"
              defaultValue={match.teams[1].team.name}
              onBlur={(e) => onTeamNameUpdate(match.teams[1].team.id, e.target.value)}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default TeamView;
