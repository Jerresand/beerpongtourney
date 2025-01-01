import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tournament } from "@/types/tournament";
import MatchSchedule from "@/components/tournament/MatchSchedule";
import PlayoffBracket from "@/components/tournament/PlayoffBracket";

interface PlayoffViewProps {
  tournament: Tournament;
}

const PlayoffView = ({ tournament }: PlayoffViewProps) => {
  const [showBracket, setShowBracket] = useState(true);

  return (
    <div>
      <div className="flex justify-end gap-2 mb-4">
        <Button
          variant="outline"
          onClick={() => setShowBracket(!showBracket)}
        >
          {showBracket ? "Show Matches" : "Show Bracket"}
        </Button>
      </div>

      {showBracket ? (
        <PlayoffBracket matches={tournament.playoffMatches} />
      ) : (
        <MatchSchedule matches={tournament.playoffMatches} />
      )}
    </div>
  );
};

export default PlayoffView; 