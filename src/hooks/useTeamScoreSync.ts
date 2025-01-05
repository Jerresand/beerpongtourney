import { useState, useEffect } from 'react';
import { MatchPlayerStats } from '@/types/tournament';

export const useTeamScoreSync = (
  initialScore: number,
  playerStats: MatchPlayerStats[],
  onScoreChange: (score: number) => void
) => {
  const [manualScore, setManualScore] = useState<number | null>(null);
  
  // Calculate total cups from player stats
  const calculateTotalCups = () => {
    return playerStats.reduce((total, player) => total + (player.cups || 0), 0);
  };

  // Update score when player stats change
  useEffect(() => {
    const totalCups = calculateTotalCups();
    // Only update if not manually set
    if (manualScore === null) {
      onScoreChange(totalCups);
    }
  }, [playerStats, manualScore, onScoreChange]);

  // Handle manual score updates
  const handleScoreChange = (newScore: number) => {
    setManualScore(newScore);
    onScoreChange(newScore);
  };

  return {
    score: manualScore !== null ? manualScore : calculateTotalCups(),
    setScore: handleScoreChange,
    resetManualScore: () => setManualScore(null)
  };
};