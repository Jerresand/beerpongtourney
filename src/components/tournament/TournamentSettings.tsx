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
    <div className="space-y-4">
      <div>
        <label className="text-white text-sm font-medium">Format</label>
        <Select value={format} onValueChange={setFormat}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="singles">Singles</SelectItem>
            <SelectItem value="doubles">Doubles</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-white text-sm font-medium">Tournament Type</label>
        <Select value={tournamentType} onValueChange={setTournamentType}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="playoffs">Playoffs Only</SelectItem>
            <SelectItem value="regular+playoffs">Regular Season + Playoffs</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-white text-sm font-medium">Face Each Team</label>
        <Select value={matchesPerTeam} onValueChange={setMatchesPerTeam}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Once</SelectItem>
            <SelectItem value="2">Twice</SelectItem>
            <SelectItem value="3">Three Times</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default TournamentSettings;