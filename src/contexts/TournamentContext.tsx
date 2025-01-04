import { createContext, useContext, useState, ReactNode } from 'react';
import { Tournament } from '../types/tournament';

interface TournamentContextType {
  tournament: Tournament | null;
  updateTournament: (tournament: Tournament) => void;
}

const TournamentContext = createContext<TournamentContextType>({
  tournament: null,
  updateTournament: () => {},
});

export const TournamentProvider = ({ children }: { children: ReactNode }) => {
  const [tournament, setTournament] = useState<Tournament | null>(() => {
    const saved = localStorage.getItem('tournament');
    const parsed = saved ? JSON.parse(saved) : null;
    console.log("TournamentProvider init:", parsed);
    return parsed;
  });

  const updateTournament = (newTournament: Tournament) => {
    console.log("Updating tournament:", newTournament);
    setTournament(newTournament);
    localStorage.setItem('tournament', JSON.stringify(newTournament));
  };

  console.log("TournamentProvider rendering, tournament:", tournament);

  return (
    <TournamentContext.Provider value={{ tournament, updateTournament }}>
      {children}
    </TournamentContext.Provider>
  );
};

export const useTournament = () => useContext(TournamentContext); 