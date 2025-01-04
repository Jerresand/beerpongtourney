import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useLocation, useNavigate } from "react-router-dom";
import TournamentHeader from "./TournamentHeader";
import TournamentSettings from "./TournamentSettings";
import PlayerManagement from "./PlayerManagement";
import { generateRegularSeasonSchedule } from "@/utils/scheduleGenerator";
import { Player, Tournament, RegularMatch, Team } from "@/types/tournament";
import { validateTournament } from '@/utils/tournamentUtils';
import { createTeam } from '@/utils/teamUtils';
import DoublesTeamCreator from './DoublesTeamCreator';

const TournamentCreator = () => {
  const [tournamentName, setTournamentName] = useState("");
  const [players, setPlayers] = useState<Player[]>([]);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [format, setFormat] = useState<"singles" | "doubles">("singles");
  const [matchesPerTeam, setMatchesPerTeam] = useState("3");
  const [tournamentType, setTournamentType] = useState<"playoffs" | "regular+playoffs">("regular+playoffs");
  const [groups, setGroups] = useState<{ name: string; players: Player[] }[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string>("");
  const [showTeamCreator, setShowTeamCreator] = useState(false);
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Load groups from localStorage
    const loadGroups = () => {
      const groups = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key !== 'activeTournaments') {
          const value = localStorage.getItem(key);
          if (value) {
            groups.push({ name: key, players: JSON.parse(value) });
          }
        }
      }
      setGroups(groups);
    };
    loadGroups();

    // Check if players were passed from group creation
    if (location.state?.players) {
      setPlayers(location.state.players);
    }
  }, [location.state]);

  const handleAddPlayer = () => {
    if (newPlayerName.trim()) {
      setPlayers([...players, {
        id: crypto.randomUUID(),
        name: newPlayerName.trim(),
        stats: {
          gamesPlayed: 0,
          totalCups: 0,
          totalIces: 0,
          totalDefenses: 0
        }
      }]);
      setNewPlayerName("");
    }
  };

  const handleRemovePlayer = (index: number) => {
    setPlayers(players.filter((_, i) => i !== index));
  };

  const handleGroupSelect = (groupName: string) => {
    const group = groups.find(g => g.name === groupName);
    if (group) {
      setPlayers(group.players.map(p => ({
        id: crypto.randomUUID(),
        name: p.name,
        stats: {
          gamesPlayed: 0,
          totalCups: 0,
          totalIces: 0,
          totalDefenses: 0
        }
      })));
      setSelectedGroup(groupName);
    }
  };

  const handleGenerateSchedule = () => {
    const validation = validateTournament(players, format);
    if (!validation.isValid) {
      toast({
        variant: "destructive",
        title: "Error",
        description: validation.error
      });
      return;
    }

    if (format === "doubles") {
      setShowTeamCreator(true);
      return;
    }

    const teams = generateTeams(players, format);
    const regularMatches = generateRegularSeasonSchedule(
      teams,
      parseInt(matchesPerTeam)
    );

    const tournament: Tournament = {
      id: crypto.randomUUID(),
      name: tournamentName || `Tournament ${new Date().toLocaleDateString()}`,
      players,
      format,
      matchesPerTeam: parseInt(matchesPerTeam),
      type: tournamentType,
      regularMatches,
      playoffMatches: [],
      currentPhase: "regular",
      createdAt: new Date().toISOString(),
      teams
    };

    // Save to localStorage
    const existingTournaments = JSON.parse(localStorage.getItem('activeTournaments') || '[]');
    localStorage.setItem('activeTournaments', JSON.stringify([...existingTournaments, tournament]));

    toast({
      title: "Tournament Created! 🎉",
      description: "Head to Active Tournaments to start the regular season",
    });

    navigate('/active-tournaments');
  };

  const handleTeamsCreated = (teams: Team[]) => {
    // Store the teams first to ensure their IDs are preserved
    const tournamentTeams = teams;
    
    const regularMatches = generateRegularSeasonSchedule(
      tournamentTeams,
      parseInt(matchesPerTeam)
    );

    const tournament: Tournament = {
      id: crypto.randomUUID(),
      name: tournamentName || `Tournament ${new Date().toLocaleDateString()}`,
      players,
      format,
      matchesPerTeam: parseInt(matchesPerTeam),
      type: tournamentType,
      regularMatches,
      playoffMatches: [],
      currentPhase: "regular",
      createdAt: new Date().toISOString(),
      teams: tournamentTeams
    };

    // Save to localStorage
    const existingTournaments = JSON.parse(localStorage.getItem('activeTournaments') || '[]');
    localStorage.setItem('activeTournaments', JSON.stringify([...existingTournaments, tournament]));

    toast({
      title: "Tournament Created! 🎉",
      description: "Head to Active Tournaments to start the regular season",
    });

    navigate('/active-tournaments');
  };

  // Helper function to generate teams for singles
  const generateTeams = (players: Player[], format: "singles" | "doubles"): Team[] => {
    if (format === "singles") {
      return players.map(player => ({
        id: crypto.randomUUID(),
        ...createTeam([player])
      }));
    }
    return [];
  };

  if (showTeamCreator && format === "doubles") {
    return (
      <DoublesTeamCreator
        players={players}
        onTeamsCreated={handleTeamsCreated}
      />
    );
  }

  return (
    <div className="space-y-6 bg-dashboard-card p-6 rounded-lg">
      <div className="space-y-4">
        <TournamentHeader 
          tournamentName={tournamentName}
          setTournamentName={setTournamentName}
        />

        <TournamentSettings
          format={format}
          setFormat={setFormat}
          tournamentType={tournamentType}
          setTournamentType={setTournamentType}
          matchesPerTeam={matchesPerTeam}
          setMatchesPerTeam={setMatchesPerTeam}
        />

        <PlayerManagement
          newPlayerName={newPlayerName}
          setNewPlayerName={setNewPlayerName}
          handleAddPlayer={handleAddPlayer}
          players={players}
          handleRemovePlayer={handleRemovePlayer}
          groups={groups}
          selectedGroup={selectedGroup}
          handleGroupSelect={handleGroupSelect}
        />
      </div>

      <Button
        onClick={handleGenerateSchedule}
        className="w-full h-16 text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transform transition-all hover:scale-105"
      >
        Create Tournament 🏆
      </Button>
    </div>
  );
};

export default TournamentCreator;