import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useEffect } from "react";

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
  // Reset matchesPerTeam to "3" when switching to regular+playoffs
  useEffect(() => {
    if (tournamentType === "regular+playoffs") {
      setMatchesPerTeam("3");
    } else {
      setMatchesPerTeam("3"); // Default to Best of 3 for playoffs
    }
  }, [tournamentType, setMatchesPerTeam]);

  const handleMatchesChange = (value: string) => {
    const numValue = parseInt(value);
    if (numValue > 30) {
      setMatchesPerTeam("30");
    } else if (numValue < 1) {
      setMatchesPerTeam("1");
    } else {
      setMatchesPerTeam(numValue.toString());
    }
  };

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
        <label className="text-white text-sm font-medium">
          {tournamentType === "playoffs" ? "Best of" : "Face Each Team"}
        </label>
        {tournamentType === "playoffs" ? (
          <Select value={matchesPerTeam} onValueChange={setMatchesPerTeam}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Best of 1</SelectItem>
              <SelectItem value="3">Best of 3</SelectItem>
              <SelectItem value="5">Best of 5</SelectItem>
            </SelectContent>
          </Select>
        ) : (
          <Input
            type="number"
            min="1"
            max="30"
            value={matchesPerTeam}
            onChange={(e) => handleMatchesChange(e.target.value)}
            className="bg-white text-black"
          />
        )}
      </div>
    </div>
  );
};

export default TournamentSettings;