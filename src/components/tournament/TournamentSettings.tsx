import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TournamentSettingsProps {
  format: "singles" | "doubles";
  setFormat: (format: "singles" | "doubles") => void;
  tournamentType: "playoffs" | "regular+playoffs";
  setTournamentType: (type: "playoffs" | "regular+playoffs") => void;
  matchesPerTeam: string;
  setMatchesPerTeam: (matches: string) => void;
}

const TournamentSettings = ({
  format,
  setFormat,
  tournamentType,
  setTournamentType,
  matchesPerTeam,
  setMatchesPerTeam,
}: TournamentSettingsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Select value={format} onValueChange={(value: "singles" | "doubles") => setFormat(value)}>
        <SelectTrigger className="bg-dashboard-background text-white">
          <SelectValue placeholder="Format" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="singles">Singles</SelectItem>
          <SelectItem value="doubles">Doubles</SelectItem>
        </SelectContent>
      </Select>

      <Select value={tournamentType} onValueChange={(value: "playoffs" | "regular+playoffs") => setTournamentType(value)}>
        <SelectTrigger className="bg-dashboard-background text-white">
          <SelectValue placeholder="Tournament Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="playoffs">Playoffs Only</SelectItem>
          <SelectItem value="regular+playoffs">Regular Season + Playoffs</SelectItem>
        </SelectContent>
      </Select>

      <Select value={matchesPerTeam} onValueChange={setMatchesPerTeam}>
        <SelectTrigger className="bg-dashboard-background text-white">
          <SelectValue placeholder="Matches per Team" />
        </SelectTrigger>
        <SelectContent>
          {[1, 2, 3, 4, 5].map((num) => (
            <SelectItem key={num} value={num.toString()}>
              {num} {num === 1 ? "Match" : "Matches"} per Team
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default TournamentSettings;