import React from 'react';
import { Tournament } from '@/types/tournament';

interface PlayoffViewProps {
  tournament: Tournament;
}

const PlayoffView = ({ tournament }: PlayoffViewProps) => {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-white">Playoff Bracket</h3>
      {/* Add playoff bracket visualization here */}
    </div>
  );
};

export default PlayoffView; 