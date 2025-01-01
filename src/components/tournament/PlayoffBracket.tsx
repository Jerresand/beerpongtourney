import { Match } from "@/types/tournament";

interface PlayoffBracketProps {
  matches: Match[];
}

const PlayoffBracket = ({ matches }: PlayoffBracketProps) => {
  return (
    <div>
      {/* TODO: Implement playoff bracket visualization */}
      <p>Playoff Bracket Coming Soon</p>
    </div>
  );
};

export default PlayoffBracket; 