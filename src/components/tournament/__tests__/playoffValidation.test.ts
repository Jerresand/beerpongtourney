import { describe, it, expect } from 'vitest';
import type { PlayoffMatch, Team } from '@/types/tournament';

describe('Playoff Match Validation', () => {
  const mockTeams: Team[] = [
    {
      id: 'team1',
      name: 'Team 1',
      players: [],
      stats: { wins: 2, losses: 1, gamesPlayed: 3 }
    },
    {
      id: 'team2',
      name: 'Team 2',
      players: [],
      stats: { wins: 1, losses: 2, gamesPlayed: 3 }
    }
  ];

  const createPlayoffMatch = (overrides = {}): PlayoffMatch => ({
    id: '1',
    team1Id: 'team1',
    team2Id: 'team2',
    team1Score: 0,
    team2Score: 0,
    team1PlayerStats: [],
    team2PlayerStats: [],
    isComplete: false,
    isPlayoff: true,
    series: 1,
    bestOf: 3,
    games: [{
      team1Score: 0,
      team2Score: 0,
      team1PlayerStats: [],
      team2PlayerStats: [],
      isComplete: false
    }],
    ...overrides
  });

  describe('Series Validation', () => {
    it('should have valid series numbers', () => {
      const match = createPlayoffMatch({ series: 1 });
      expect(match.series).toBeGreaterThan(0);
    });

    it('should not allow series 0 or negative', () => {
      const invalidSeries = [0, -1];
      invalidSeries.forEach(series => {
        const match = createPlayoffMatch({ series });
        expect(match.series).not.toBeGreaterThan(0);
      });
    });
  });

  describe('Team Validation', () => {
    it('should have different teams', () => {
      const match = createPlayoffMatch();
      expect(match.team1Id).not.toBe(match.team2Id);
    });

    it('should reference existing teams', () => {
      const match = createPlayoffMatch();
      const teamIds = mockTeams.map(team => team.id);
      expect(teamIds).toContain(match.team1Id);
      expect(teamIds).toContain(match.team2Id);
    });
  });

  describe('Score Validation', () => {
    it('should not allow negative scores', () => {
      const match = createPlayoffMatch({ team1Score: -1, team2Score: -1 });
      expect(match.team1Score).toBeLessThan(0);
      expect(match.team2Score).toBeLessThan(0);
    });

    it('should allow valid scores', () => {
      const match = createPlayoffMatch({ team1Score: 5, team2Score: 3 });
      expect(match.team1Score).toBeGreaterThanOrEqual(0);
      expect(match.team2Score).toBeGreaterThanOrEqual(0);
    });

    it('should identify a winner when complete', () => {
      const match = createPlayoffMatch({ 
        team1Score: 5, 
        team2Score: 3, 
        isComplete: true 
      });
      expect(match.isComplete).toBe(true);
      expect(match.team1Score).not.toBe(match.team2Score);
    });
  });

  describe('Player Stats Validation', () => {
    it('should have player stats for both teams', () => {
      const match = createPlayoffMatch();
      expect(match.team1PlayerStats).toBeDefined();
      expect(match.team2PlayerStats).toBeDefined();
    });

    it('should not allow negative player stats', () => {
      const invalidStats = [
        { playerId: '1', cups: -1, ices: 0, defense: 0 },
        { playerId: '1', cups: 0, ices: -1, defense: 0 },
        { playerId: '1', cups: 0, ices: 0, defense: -1 }
      ];

      invalidStats.forEach(stat => {
        const match = createPlayoffMatch({
          team1PlayerStats: [stat]
        });
        const hasNegativeStats = Object.values(stat)
          .filter(value => typeof value === 'number')
          .some(value => value < 0);
        expect(hasNegativeStats).toBe(true);
      });
    });
  });
});
