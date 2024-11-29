import { Input } from "@/components/ui/input";

interface TournamentHeaderProps {
  tournamentName: string;
  setTournamentName: (name: string) => void;
}

const TournamentHeader = ({ tournamentName, setTournamentName }: TournamentHeaderProps) => {
  return (
    <Input
      placeholder="Tournament Name"
      value={tournamentName}
      onChange={(e) => setTournamentName(e.target.value)}
      className="bg-dashboard-background text-white"
    />
  );
};

export default TournamentHeader;