import { describe, it, expect } from 'vitest';
import { createTeam } from '../teamUtils';
import { Player } from '@/types/tournament';

describe('createTeam', () => {
  it('should create a team with a single player', () => {
    const player: Player = { 
      id: '1', 
      name: 'John Doe',
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
    };
    const team = createTeam([player]);
    
    expect(team.name).toBe('John Doe');
    expect(team.players).toHaveLength(1);
    expect(team.players[0]).toBe(player);
    expect(team.stats).toEqual({
      wins: 0,
      losses: 0,
      gamesPlayed: 0
    });
  });

  it('should create a team with two players', () => {
    const player1: Player = { 
      id: '1', 
      name: 'John Doe',
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
    };
    const player2: Player = { 
      id: '2', 
      name: 'Jane Smith',
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
    };
    const team = createTeam([player1, player2]);
    
    expect(team.name).toBe('John Doe & Jane Smith');
    expect(team.players).toHaveLength(2);
    expect(team.players).toContain(player1);
    expect(team.players).toContain(player2);
    expect(team.stats).toEqual({
      wins: 0,
      losses: 0,
      gamesPlayed: 0
    });
  });
});