import { Match } from "@/types/tournament";

interface PlayoffBracketProps {
  matches: Match[];
}

const PlayoffBracket: React.FC<PlayoffBracketProps> = ({ matches }) => {
  return (
    <div>
      {/* TODO: Implement playoff bracket visualization */}
      <p>Playoff Bracket Coming Soon</p>
    </div>
  );
};

export default PlayoffBracket;