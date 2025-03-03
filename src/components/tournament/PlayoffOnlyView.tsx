import React, { useState } from 'react';
import { Tournament, Match, Team, Player, PlayoffMatch } from '@/types/tournament';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, ChevronLeft, ChevronRight } from "lucide-react";
import MatchStatisticsManager from './MatchStatisticsManager';
import PlayoffStatsTable from './PlayoffStatsTable';

interface PlayoffOnlyViewProps {
  tournament: Tournament;
  onTournamentUpdate: (tournament: Tournament) => void;
}

const PlayoffOnlyView: React.FC<PlayoffOnlyViewProps> = ({ tournament, onTournamentUpdate }) => {
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [selectedGames, setSelectedGames] = useState<Record<string, number>>({}); // matchId -> gameIndex

  // Get matches grouped by round
  const getMatchesByRound = () => {
    const matchesByRound: PlayoffMatch[][] = [];
    let currentRound = 1;
    let currentMatches: PlayoffMatch[] = [];

    tournament.playoffMatches.forEach(match => {
      if (match.series === currentRound) {
        currentMatches.push(match);
      } else {
        if (currentMatches.length > 0) {
          matchesByRound.push(currentMatches);
        }
        currentRound = match.series;
        currentMatches = [match];
      }
    });

    if (currentMatches.length > 0) {
      matchesByRound.push(currentMatches);
    }

    return matchesByRound;
  };

  // Get round name based on round index and total rounds
  const getRoundName = (roundIndex: number, roundMatches: PlayoffMatch[]) => {
    const numSeries = roundMatches.length;
    if (numSeries === 4) return "Quarter-Finals";
    if (numSeries === 2) return "Semi-Finals";
    if (numSeries === 1) return "Finals";
    return `Round ${roundIndex + 1}`;
  };

  const handleMatchUpdate = (
    updatedMatch: Match,
    updatedTeams: Team[],
    updatedPlayers: Player[]
  ) => {
    if (!updatedMatch.isPlayoff) return;

    // Get the current game index for this match
    const currentGame = selectedGames[updatedMatch.id] || 0;

    // Create an updated match with the new game scores
    const matchToUpdate = tournament.playoffMatches.find(m => m.id === updatedMatch.id);
    if (!matchToUpdate) return;

    // Store the previous winner before updating
    const { team1Wins: prevTeam1Wins, team2Wins: prevTeam2Wins } = getSeriesScore(matchToUpdate);
    const previousWinnerId = prevTeam1Wins > prevTeam2Wins ? matchToUpdate.team1Id : 
                           prevTeam2Wins > prevTeam1Wins ? matchToUpdate.team2Id : null;

    const updatedGames = [...matchToUpdate.games];
    updatedGames[currentGame] = {
      team1Score: updatedMatch.team1Score,
      team2Score: updatedMatch.team2Score,
      team1PlayerStats: updatedMatch.team1PlayerStats,
      team2PlayerStats: updatedMatch.team2PlayerStats,
      isComplete: updatedMatch.isComplete
    };

    const updatedPlayoffMatch: PlayoffMatch = {
      ...matchToUpdate,
      games: updatedGames,
      team1Score: updatedMatch.team1Score,
      team2Score: updatedMatch.team2Score,
      team1PlayerStats: updatedMatch.team1PlayerStats,
      team2PlayerStats: updatedMatch.team2PlayerStats,
      isComplete: isSeriesComplete({ ...matchToUpdate, games: updatedGames })
    };

    // Check if the winner has changed
    const { team1Wins: newTeam1Wins, team2Wins: newTeam2Wins } = getSeriesScore(updatedPlayoffMatch);
    const newWinnerId = newTeam1Wins > newTeam2Wins ? updatedPlayoffMatch.team1Id : 
                       newTeam2Wins > newTeam1Wins ? updatedPlayoffMatch.team2Id : null;

    // If the winner has changed and this isn't the final round, we need to reset subsequent rounds
    const matchesByRound = getMatchesByRound();
    const currentRoundIndex = matchesByRound.findIndex(round => 
      round.some(m => m.id === updatedMatch.id)
    );
    
    let updatedPlayoffMatches = [...tournament.playoffMatches];
    
    if (previousWinnerId !== newWinnerId && currentRoundIndex < matchesByRound.length - 1) {
      // Keep matches up to and including the current round
      updatedPlayoffMatches = tournament.playoffMatches.filter(match => {
        const matchRoundIndex = matchesByRound.findIndex(round => 
          round.some(m => m.id === match.id)
        );
        return matchRoundIndex <= currentRoundIndex;
      });

      // Update the current match
      updatedPlayoffMatches = updatedPlayoffMatches.map(match =>
        match.id === updatedMatch.id ? updatedPlayoffMatch : match
      );
    } else {
      // Just update the current match without affecting other rounds
      updatedPlayoffMatches = updatedPlayoffMatches.map(match =>
        match.id === updatedMatch.id ? updatedPlayoffMatch : match
      );
    }

    const updatedTournament: Tournament = {
      ...tournament,
      teams: updatedTeams,
      players: updatedPlayers,
      playoffMatches: updatedPlayoffMatches
    };

    // Save to localStorage
    const tournaments = JSON.parse(localStorage.getItem("activeTournaments") || "[]");
    const updatedTournaments = tournaments.map((t: Tournament) =>
      t.id === tournament.id ? updatedTournament : t
    );
    localStorage.setItem("activeTournaments", JSON.stringify(updatedTournaments));

    onTournamentUpdate(updatedTournament);
  };

  const getSeriesScore = (match: PlayoffMatch) => {
    let team1Wins = 0;
    let team2Wins = 0;
    match.games.forEach(game => {
      if (game.isComplete) {
        if (game.team1Score > game.team2Score) team1Wins++;
        if (game.team2Score > game.team1Score) team2Wins++;
      }
    });
    return { team1Wins, team2Wins };
  };

  const isSeriesComplete = (match: PlayoffMatch) => {
    const { team1Wins, team2Wins } = getSeriesScore(match);
    if (match.bestOf === 1) {
      return match.games[0].isComplete;
    }
    const winsNeeded = Math.ceil(match.bestOf / 2);
    return team1Wins >= winsNeeded || team2Wins >= winsNeeded;
  };

  const handleGameChange = (match: PlayoffMatch, direction: 'prev' | 'next') => {
    const currentGame = selectedGames[match.id] || 0;
    const newGame = direction === 'next' 
      ? Math.min(currentGame + 1, match.games.length - 1)
      : Math.max(currentGame - 1, 0);
    
    setSelectedGames({
      ...selectedGames,
      [match.id]: newGame
    });
    
    // Close the statistics manager if it's open for this match
    if (selectedMatch?.id === match.id) {
      setSelectedMatch(null);
    }
  };

  // Create a modified match object with the current game's data for the statistics manager
  const getMatchWithCurrentGameData = (match: PlayoffMatch) => {
    const currentGame = selectedGames[match.id] || 0;
    const currentGameData = match.games[currentGame];
    
    return {
      ...match,
      team1Score: currentGameData.team1Score,
      team2Score: currentGameData.team2Score,
      team1PlayerStats: currentGameData.team1PlayerStats,
      team2PlayerStats: currentGameData.team2PlayerStats,
      isComplete: currentGameData.isComplete
    };
  };

  const isRoundComplete = (roundMatches: PlayoffMatch[]) => {
    return roundMatches.every(match => isSeriesComplete(match));
  };

  // Get the name of the next round
  const getNextRoundName = (currentRoundMatches: PlayoffMatch[]) => {
    const numSeries = currentRoundMatches.length;
    if (numSeries === 4) return "Semi-Finals";
    if (numSeries === 2) return "Finals";
    return "";
  };

  const handleEnterNextRound = (currentRoundIndex: number) => {
    const currentRoundMatches = matchesByRound[currentRoundIndex];
    const nextRoundMatches: PlayoffMatch[] = [];

    // Get the bestOf value from the current round to carry over
    const bestOf = currentRoundMatches[0].bestOf;

    for (let i = 0; i < currentRoundMatches.length; i += 2) {
      const match1 = currentRoundMatches[i];
      const match2 = currentRoundMatches[i + 1];
      const { team1Wins: match1Team1Wins, team2Wins: match1Team2Wins } = getSeriesScore(match1);
      const { team1Wins: match2Team1Wins, team2Wins: match2Team2Wins } = getSeriesScore(match2);

      // Get winners
      const team1Id = match1Team1Wins > match1Team2Wins ? match1.team1Id : match1.team2Id;
      const team2Id = match2Team1Wins > match2Team2Wins ? match2.team1Id : match2.team2Id;

      // Create the next round match
      nextRoundMatches.push({
        id: crypto.randomUUID(),
        team1Id,
        team2Id,
        team1Score: 0,
        team2Score: 0,
        team1PlayerStats: [],
        team2PlayerStats: [],
        isComplete: false,
        isPlayoff: true,
        series: currentRoundIndex + 2,
        bestOf,
        games: Array.from({ length: bestOf }, () => ({
          team1Score: 0,
          team2Score: 0,
          team1PlayerStats: [],
          team2PlayerStats: [],
          isComplete: false
        }))
      });
    }

    const updatedTournament: Tournament = {
      ...tournament,
      playoffMatches: [...tournament.playoffMatches, ...nextRoundMatches]
    };

    // Save to localStorage
    const tournaments = JSON.parse(localStorage.getItem("activeTournaments") || "[]");
    const updatedTournaments = tournaments.map((t: Tournament) =>
      t.id === tournament.id ? updatedTournament : t
    );
    localStorage.setItem("activeTournaments", JSON.stringify(updatedTournaments));

    onTournamentUpdate(updatedTournament);
  };

  const matchesByRound = getMatchesByRound();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Tournament Bracket</h2>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {matchesByRound.map((roundMatches, roundIndex) => (
          <Card key={roundIndex} className="bg-dashboard-card">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-white">
                {getRoundName(roundIndex, roundMatches)}
                {tournament.bestOf && tournament.bestOf > 1 && (
                  <span className="text-sm font-normal text-dashboard-text ml-2">
                    Best of {tournament.bestOf}
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {roundMatches.map((match, matchIndex) => {
                  const team1 = tournament.teams.find(t => t.id === match.team1Id);
                  const team2 = tournament.teams.find(t => t.id === match.team2Id);
                  const currentGame = selectedGames[match.id] || 0;
                  const { team1Wins, team2Wins } = getSeriesScore(match);
                  const isBestOfOne = tournament.bestOf === 1;

                  return (
                    <Card key={match.id} className="bg-dashboard-background p-4">
                      <div className="flex flex-col space-y-4">
                        <div className="flex justify-between items-center">
                          <div className="text-lg font-bold text-white">
                            Series {matchIndex + 1}
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedMatch(match)}
                              className="text-dashboard-text hover:text-white flex items-center"
                            >
                              <Pencil className="h-4 w-4 mr-2" />
                              Edit Game {currentGame + 1}
                            </Button>
                          </div>
                        </div>

                        {!isBestOfOne && (
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleGameChange(match, 'prev')}
                                disabled={currentGame === 0}
                                className="h-8 w-8 p-0 hover:bg-dashboard-card disabled:opacity-50"
                              >
                                <ChevronLeft className="h-4 w-4 text-white" />
                              </Button>
                              <span className="text-sm text-white w-20 text-center">
                                Game {currentGame + 1}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleGameChange(match, 'next')}
                                disabled={currentGame === match.bestOf - 1}
                                className="h-8 w-8 p-0 hover:bg-dashboard-card disabled:opacity-50"
                              >
                                <ChevronRight className="h-4 w-4 text-white" />
                              </Button>
                            </div>
                            <div className="text-sm text-white">
                              Series: {team1Wins}-{team2Wins}
                            </div>
                          </div>
                        )}

                        <div className="space-y-2">
                          <div className={`flex justify-between items-center p-2 rounded ${match.games[currentGame].isComplete && match.games[currentGame].team1Score > match.games[currentGame].team2Score ? 'bg-green-900/20' : ''}`}>
                            <span className="text-white">{team1?.name}</span>
                            <span className="text-white font-bold">{match.games[currentGame].team1Score}</span>
                          </div>
                          <div className={`flex justify-between items-center p-2 rounded ${match.games[currentGame].isComplete && match.games[currentGame].team2Score > match.games[currentGame].team1Score ? 'bg-green-900/20' : ''}`}>
                            <span className="text-white">{team2?.name}</span>
                            <span className="text-white font-bold">{match.games[currentGame].team2Score}</span>
                          </div>
                        </div>

                        {isSeriesComplete(match) && (
                          <div className="text-sm text-green-400 text-center font-medium">
                            Series Winner: {team1Wins > team2Wins ? team1?.name : team2?.name}
                          </div>
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {matchesByRound.length > 0 && 
       isRoundComplete(matchesByRound[matchesByRound.length - 1]) && 
       matchesByRound.length < (tournament.playoffMatches.length > 8 ? 4 : tournament.playoffMatches.length > 4 ? 3 : 2) && (
        <div className="flex justify-end pt-4">
          <Button
            onClick={() => handleEnterNextRound(matchesByRound.length - 1)}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            Enter {getNextRoundName(matchesByRound[matchesByRound.length - 1])}
          </Button>
        </div>
      )}

      {selectedMatch && (
        <MatchStatisticsManager
          match={getMatchWithCurrentGameData(selectedMatch as PlayoffMatch)}
          tournament={tournament}
          isOpen={true}
          onClose={() => setSelectedMatch(null)}
          onSave={handleMatchUpdate}
        />
      )}

      {/* Tournament Statistics Section */}
      <PlayoffStatsTable tournament={tournament} />
    </div>
  );
};

export default PlayoffOnlyView; 