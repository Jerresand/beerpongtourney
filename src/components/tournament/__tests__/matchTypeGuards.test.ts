import { describe, it, expect } from 'vitest';
import { isRegularMatch, isPlayoffMatch, isPlayoffPhase } from '@/types/tournament';
import type { Match, Tournament } from '@/types/tournament';

describe('Match Type Guards', () => {
  const baseMatch = {
    id: '1',
    team1Id: 'team1',
    team2Id: 'team2',
    team1Score: 0,
    team2Score: 0,
    team1PlayerStats: [],
    team2PlayerStats: [],
    isComplete: false
  };

  describe('isRegularMatch', () => {
    it('should identify regular matches', () => {
      const regularMatch: Match = {
        ...baseMatch,
        isPlayoff: false,
        round: 1
      };
      expect(isRegularMatch(regularMatch)).toBe(true);
    });

    it('should reject playoff matches', () => {
      const playoffMatch: Match = {
        ...baseMatch,
        isPlayoff: true,
        series: 1
      };
      expect(isRegularMatch(playoffMatch)).toBe(false);
    });
  });

  describe('isPlayoffMatch', () => {
    it('should identify playoff matches', () => {
      const playoffMatch: Match = {
        ...baseMatch,
        isPlayoff: true,
        series: 1
      };
      expect(isPlayoffMatch(playoffMatch)).toBe(true);
    });

    it('should reject regular matches', () => {
      const regularMatch: Match = {
        ...baseMatch,
        isPlayoff: false,
        round: 1
      };
      expect(isPlayoffMatch(regularMatch)).toBe(false);
    });
  });

  describe('isPlayoffPhase', () => {
    it('should identify playoff phase', () => {
      const tournament = {
        currentPhase: 'playoffs'
      } as Tournament;
      expect(isPlayoffPhase(tournament)).toBe(true);
    });

    it('should identify regular phase', () => {
      const tournament = {
        currentPhase: 'regular'
      } as Tournament;
      expect(isPlayoffPhase(tournament)).toBe(false);
    });
  });
}); 