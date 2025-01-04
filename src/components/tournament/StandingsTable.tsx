import { useTournament } from '@/contexts/TournamentContext';
import { calculateRegularStandings } from '@/utils/tournamentUtils';

const StandingsTable = () => {
  const { tournament } = useTournament();
  
  if (!tournament) return null;

  const standings = calculateRegularStandings(tournament);

  return (
    <div className="bg-dashboard-card p-6 rounded-lg">
      <h3 className="text-xl font-bold text-white mb-4">Standings</h3>
      <div className="space-y-2">
        {standings.map((standing, index) => (
          <div key={index} className="flex justify-between p-3 bg-dashboard-background rounded-lg">
            <span className="text-white">{standing.name}</span>
            <span className="text-white">{standing.wins}W - {standing.losses}L</span>
          </div>
        ))}
      </div>
    </div>
  );
}; 