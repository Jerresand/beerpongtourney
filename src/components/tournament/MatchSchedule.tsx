import React, { useState } from 'react';
import { useTournament } from '@/contexts/TournamentContext';
import { Match } from '@/types/tournament';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const MatchSchedule = () => {
  const { tournament } = useTournament();
  console.log("MatchSchedule - tournament:", tournament);
  console.log("MatchSchedule - regularMatches:", tournament?.regularMatches);

  if (!tournament || !tournament.regularMatches?.length) {
    console.log("MatchSchedule - returning null");
    return null;
  }

  const [selectedRound, setSelectedRound] = useState<number>(1);

  const rounds = [...new Set(tournament.regularMatches.map(m => m.round))].sort((a, b) => a - b);
  const roundMatches = tournament.regularMatches.filter(match => match.round === selectedRound);

  return (
    <div className="bg-dashboard-card p-6 rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-white">Match Schedule</h3>
        <Select
          value={selectedRound.toString()}
          onValueChange={(value) => setSelectedRound(Number(value))}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Round" />
          </SelectTrigger>
          <SelectContent>
            {rounds.map((round) => (
              <SelectItem key={round} value={round.toString()}>
                Round {round}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        {roundMatches.map((match, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-dashboard-background rounded-lg">
            <div className="flex-1 grid grid-cols-[1fr,auto,1fr] gap-4 items-center">
              <div className="text-right text-white">{match.teams[0].team.name}</div>
              <div className="text-center text-gray-400">
                {`${match.teams[0].score} - ${match.teams[1].score}`}
              </div>
              <div className="text-left text-white">{match.teams[1].team.name}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MatchSchedule;