import { describe, it, expect } from 'vitest';
import { 
  calculateRegularStandings, 
  generateTeams, 
  validateTournament 
} from '../tournamentUtils';
import { Player, Tournament } from '@/types/tournament';

describe('validateTournament', () => {
  it('should validate a singles tournament with valid number of players', () => {
    const players: Player[] = [
      { 
        id: '1', 
        name: 'Player 1', 
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
      },
      { 
        id: '2', 
        name: 'Player 2', 
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
      }
    ];
    const result = validateTournament(players, 'singles');
    expect(result.isValid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('should invalidate a singles tournament with less than 2 players', () => {
    const players: Player[] = [
      { id: '1', name: 'Player 1', stats: { gamesPlayed: 0, totalRegularSeasonCups: 0, totalRegularSeasonIces: 0, totalRegularSeasonDefenses: 0, totalPlayoffGamesPlayed: 0, totalPlayoffCups: 0, totalPlayoffIces: 0, totalPlayoffDefenses: 0 } }
    ];
    const result = validateTournament(players, 'singles');
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('You need at least 2 players to create a tournament');
  });

  it('should validate a doubles tournament with valid number of players', () => {
    const players: Player[] = [
      { id: '1', name: 'Player 1', stats: { gamesPlayed: 0, totalRegularSeasonCups: 0, totalRegularSeasonIces: 0, totalRegularSeasonDefenses: 0, totalPlayoffGamesPlayed: 0, totalPlayoffCups: 0, totalPlayoffIces: 0, totalPlayoffDefenses: 0 } },
      { id: '2', name: 'Player 2', stats: { gamesPlayed: 0, totalRegularSeasonCups: 0, totalRegularSeasonIces: 0, totalRegularSeasonDefenses: 0, totalPlayoffGamesPlayed: 0, totalPlayoffCups: 0, totalPlayoffIces: 0, totalPlayoffDefenses: 0 } },
      { id: '3', name: 'Player 3', stats: { gamesPlayed: 0, totalRegularSeasonCups: 0, totalRegularSeasonIces: 0, totalRegularSeasonDefenses: 0, totalPlayoffGamesPlayed: 0, totalPlayoffCups: 0, totalPlayoffIces: 0, totalPlayoffDefenses: 0 } },
      { id: '4', name: 'Player 4', stats: { gamesPlayed: 0, totalRegularSeasonCups: 0, totalRegularSeasonIces: 0, totalRegularSeasonDefenses: 0, totalPlayoffGamesPlayed: 0, totalPlayoffCups: 0, totalPlayoffIces: 0, totalPlayoffDefenses: 0 } }
    ];
    const result = validateTournament(players, 'doubles');
    expect(result.isValid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('should invalidate a doubles tournament with odd number of players', () => {
    const players: Player[] = [
      { id: '1', name: 'Player 1', stats: { gamesPlayed: 0, totalRegularSeasonCups: 0, totalRegularSeasonIces: 0, totalRegularSeasonDefenses: 0, totalPlayoffGamesPlayed: 0, totalPlayoffCups: 0, totalPlayoffIces: 0, totalPlayoffDefenses: 0 } },
      { id: '2', name: 'Player 2', stats: { gamesPlayed: 0, totalRegularSeasonCups: 0, totalRegularSeasonIces: 0, totalRegularSeasonDefenses: 0, totalPlayoffGamesPlayed: 0, totalPlayoffCups: 0, totalPlayoffIces: 0, totalPlayoffDefenses: 0 } },
      { id: '3', name: 'Player 3', stats: { gamesPlayed: 0, totalRegularSeasonCups: 0, totalRegularSeasonIces: 0, totalRegularSeasonDefenses: 0, totalPlayoffGamesPlayed: 0, totalPlayoffCups: 0, totalPlayoffIces: 0, totalPlayoffDefenses: 0 } }
    ];
    const result = validateTournament(players, 'doubles');
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('⚠️ Cannot start tournament: Doubles tournaments require an even number of players');
  });
});

describe('generateTeams', () => {
  const createTestPlayer = (id: string, name: string): Player => ({
    id,
    name,
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
  });

  it('should generate singles teams correctly', () => {
    const players = [
      createTestPlayer('1', 'Player 1'),
      createTestPlayer('2', 'Player 2')
    ];
    const teams = generateTeams(players, 'singles');
    
    expect(teams).toHaveLength(2);
    expect(teams[0].players).toHaveLength(1);
    expect(teams[1].players).toHaveLength(1);
    expect(teams[0].name).toBe('Player 1');
    expect(teams[1].name).toBe('Player 2');
  });

  it('should generate doubles teams correctly', () => {
    const players = [
      createTestPlayer('1', 'Player 1'),
      createTestPlayer('2', 'Player 2'),
      createTestPlayer('3', 'Player 3'),
      createTestPlayer('4', 'Player 4')
    ];
    const teams = generateTeams(players, 'doubles');
    
    expect(teams).toHaveLength(2);
    expect(teams[0].players).toHaveLength(2);
    expect(teams[1].players).toHaveLength(2);
    expect(teams[0].name).toBe('Player 1 & Player 2');
    expect(teams[1].name).toBe('Player 3 & Player 4');
  });
});

describe('calculateRegularStandings', () => {
  it('should calculate standings correctly', () => {
    const tournament: Tournament = {
      id: '1',
      name: 'Test Tournament',
      players: [],
      teams: [
        {
          id: '1',
          name: 'Team 1',
          players: [{ 
            id: '1', 
            name: 'Player 1', 
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
          }],
          stats: { wins: 2, losses: 1, gamesPlayed: 3 }
        },
        {
          id: '2',
          name: 'Team 2',
          players: [{ 
            id: '2', 
            name: 'Player 2', 
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
          }],
          stats: { wins: 1, losses: 2, gamesPlayed: 3 }
        }
      ],
      format: 'singles',
      type: 'regular+playoffs',
      matchesPerTeam: 3,
      regularMatches: [],
      playoffMatches: [],
      currentPhase: 'regular',
      createdAt: new Date().toISOString()
    };

    const standings = calculateRegularStandings(tournament);
    
    expect(standings).toHaveLength(2);
    expect(standings[0].name).toBe('Team 1');
    expect(standings[0].winPercentage).toBe(66.66666666666666);
    expect(standings[1].name).toBe('Team 2');
    expect(standings[1].winPercentage).toBe(33.33333333333333);
  });

  it('should return empty array for null tournament', () => {
    const standings = calculateRegularStandings(null);
    expect(standings).toEqual([]);
  });
});
