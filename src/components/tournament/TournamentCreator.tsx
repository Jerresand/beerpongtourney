import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useLocation, useNavigate } from "react-router-dom";
import TournamentHeader from "./TournamentHeader";
import TournamentSettings from "./TournamentSettings";
import PlayerManagement from "./PlayerManagement";
import { generateRegularSeasonSchedule } from "@/utils/scheduleGenerator";
import { Player, Tournament, RegularMatch, Team, PlayoffMatch } from "@/types/tournament";
import { validateTournament } from '@/utils/tournamentUtils';
import { createTeam } from '@/utils/teamUtils';
import DoublesTeamCreator from './DoublesTeamCreator';
import { Trophy } from "lucide-react";

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
        if (key && key !== 'tournaments' && key !== 'activeTournaments') {
          try {
            const value = localStorage.getItem(key);
            if (value) {
              const parsedValue = JSON.parse(value);
              // Only add if it's an array (which groups should be)
              if (Array.isArray(parsedValue)) {
                groups.push({ name: key, players: parsedValue });
              }
            }
          } catch (error) {
            console.warn(`Failed to parse group ${key}, skipping:`, error);
            continue;
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
          totalRegularSeasonCups: 0,
          totalRegularSeasonIces: 0,
          totalRegularSeasonDefenses: 0,
          totalPlayoffGamesPlayed: 0,
          totalPlayoffCups: 0,
          totalPlayoffIces: 0,
          totalPlayoffDefenses: 0
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
          totalRegularSeasonCups: 0,
          totalRegularSeasonIces: 0,
          totalRegularSeasonDefenses: 0,
          totalPlayoffGamesPlayed: 0,
          totalPlayoffCups: 0,
          totalPlayoffIces: 0,
          totalPlayoffDefenses: 0
        }
      })));
      setSelectedGroup(groupName);
    }
  };

  // Helper function to create playoff matches
  const createInitialPlayoffMatches = (teams: Team[]): PlayoffMatch[] => {
    // Randomize team order for seeding
    const shuffledTeams = [...teams].sort(() => Math.random() - 0.5);
    const matches: PlayoffMatch[] = [];
    
    // Create matchups based on team count (8 teams = quarter finals, 4 teams = semi finals, 2 teams = finals)
    const numTeams = teams.length;
    const matchupPairs = [];
    
    if (numTeams === 8) {
      matchupPairs.push([0, 7], [3, 4], [1, 6], [2, 5]); // 1v8, 4v5, 2v7, 3v6
    } else if (numTeams === 4) {
      matchupPairs.push([0, 3], [1, 2]); // 1v4, 2v3
    } else if (numTeams === 2) {
      matchupPairs.push([0, 1]); // 1v2
    }

    // Create seed map for the randomized teams
    const seedMap: Record<string, number> = {};
    shuffledTeams.forEach((team, index) => {
      seedMap[team.id] = index + 1;
    });

    // Create the playoff matches
    for (const [highSeedIndex, lowSeedIndex] of matchupPairs) {
      matches.push({
        id: crypto.randomUUID(),
        team1Id: shuffledTeams[highSeedIndex].id,
        team2Id: shuffledTeams[lowSeedIndex].id,
        team1Score: 0,
        team2Score: 0,
        team1PlayerStats: [],
        team2PlayerStats: [],
        isComplete: false,
        isPlayoff: true,
        series: 1,
        bestOf: parseInt(matchesPerTeam), // Use matchesPerTeam as bestOf for playoffs
        games: Array(parseInt(matchesPerTeam)).fill(null).map(() => ({
          team1Score: 0,
          team2Score: 0,
          team1PlayerStats: [],
          team2PlayerStats: [],
          isComplete: false
        }))
      });
    }

    return matches;
  };

  const handleGenerateSchedule = async () => {
    const validation = validateTournament(players, format, tournamentType);
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
    
    // Create tournament based on type
    const tournament: Tournament = {
      id: crypto.randomUUID(),
      name: tournamentName || `Tournament ${new Date().toLocaleDateString()}`,
      players,
      format,
      matchesPerTeam: parseInt(matchesPerTeam),
      type: tournamentType,
      regularMatches: tournamentType === "playoffs" ? [] : generateRegularSeasonSchedule(teams, parseInt(matchesPerTeam)),
      playoffMatches: tournamentType === "playoffs" ? createInitialPlayoffMatches(teams) : [],
      currentPhase: tournamentType === "playoffs" ? "playoffs" : "regular",
      createdAt: new Date().toISOString(),
      teams,
      bestOf: tournamentType === "playoffs" ? parseInt(matchesPerTeam) : 3
    };

    // If it's a playoff tournament, also set the playoff seed map
    if (tournamentType === "playoffs") {
      const seedMap: Record<string, number> = {};
      teams.forEach((team, index) => {
        seedMap[team.id] = index + 1;
      });
      tournament.playoffSeedMap = seedMap;
    }

    try {
      // Store tournament in localStorage
      const tournaments = JSON.parse(localStorage.getItem('tournaments') || '[]');
      const newTournament = {
        ...tournament,
        createdAt: new Date().toISOString()
      };
      tournaments.push(newTournament);
      localStorage.setItem('tournaments', JSON.stringify(tournaments));

      toast({
        title: "Tournament Created! 🎉",
        description: tournamentType === "playoffs" 
          ? "Head to Active Tournaments to start the playoffs"
          : "Head to Active Tournaments to start the regular season",
      });

      navigate('/active-tournaments');
    } catch (error) {
      console.error('Failed to create tournament:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create tournament. Please try again."
      });
    }
  };

  const handleTeamsCreated = (teams: Team[]) => {
    // Create tournament based on type
    const tournament: Tournament = {
      id: crypto.randomUUID(),
      name: tournamentName || `Tournament ${new Date().toLocaleDateString()}`,
      players,
      format,
      matchesPerTeam: parseInt(matchesPerTeam),
      type: tournamentType,
      regularMatches: tournamentType === "playoffs" ? [] : generateRegularSeasonSchedule(teams, parseInt(matchesPerTeam)),
      playoffMatches: tournamentType === "playoffs" ? createInitialPlayoffMatches(teams) : [],
      currentPhase: tournamentType === "playoffs" ? "playoffs" : "regular",
      createdAt: new Date().toISOString(),
      teams,
      bestOf: tournamentType === "playoffs" ? parseInt(matchesPerTeam) : 3
    };

    // If it's a playoff tournament, also set the playoff seed map
    if (tournamentType === "playoffs") {
      const seedMap: Record<string, number> = {};
      teams.forEach((team, index) => {
        seedMap[team.id] = index + 1;
      });
      tournament.playoffSeedMap = seedMap;
    }

    try {
      // Store tournament in localStorage
      const tournaments = JSON.parse(localStorage.getItem('tournaments') || '[]');
      tournaments.push(tournament);
      localStorage.setItem('tournaments', JSON.stringify(tournaments));

      toast({
        title: "Tournament Created! 🎉",
        description: tournamentType === "playoffs" 
          ? "Head to Active Tournaments to start the playoffs"
          : "Head to Active Tournaments to start the regular season",
      });

      navigate('/active-tournaments');
    } catch (error) {
      console.error('Failed to create tournament:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create tournament. Please try again."
      });
    }
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