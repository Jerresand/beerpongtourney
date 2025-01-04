import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "@/components/dashboard/Layout";
import { Tournament } from "@/types/tournament";
import RegularSeasonView from "@/components/tournament/RegularSeasonView";
import PlayoffView from "@/components/tournament/PlayoffView";

const isPlayoffPhase = (tournament: Tournament) => tournament.currentPhase === "playoffs";

const TournamentView = () => {
  const { id } = useParams();
  const [tournament, setTournament] = useState<Tournament | null>(null);

  useEffect(() => {
    const tournaments = JSON.parse(localStorage.getItem("activeTournaments") || "[]");
    const tournament = tournaments.find((t: Tournament) => t.id === id);
    setTournament(tournament || null);
  }, [id]);

  if (!tournament) return <div>Tournament not found</div>;

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-white">{tournament.name}</h2>
          <p className="text-dashboard-text mt-2">
            {tournament.format} - {tournament.type}
          </p>
        </div>
        
        {tournament.currentPhase === "playoffs" ? (
          <PlayoffView tournament={tournament} />
        ) : (
          <RegularSeasonView tournament={tournament} />
        )}
      </div>
    </Layout>
  );
};

export default TournamentView;