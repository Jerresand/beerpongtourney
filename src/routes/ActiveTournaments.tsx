import Layout from "@/components/dashboard/Layout";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Player {
  name: string;
}

interface Tournament {
  id: string;
  name: string;
  players: Player[];
  format: "singles" | "doubles";
  matchesPerTeam: number;
  type: "playoffs" | "regular+playoffs";
  createdAt: string;
  lastVisited?: string;
}

const ActiveTournaments = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadTournaments = () => {
      const savedTournaments = JSON.parse(localStorage.getItem('activeTournaments') || '[]');
      // Sort tournaments by lastVisited (most recent first), then by createdAt
      const sortedTournaments = savedTournaments.sort((a: Tournament, b: Tournament) => {
        if (a.lastVisited && b.lastVisited) {
          return new Date(b.lastVisited).getTime() - new Date(a.lastVisited).getTime();
        }
        if (a.lastVisited) return -1;
        if (b.lastVisited) return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      setTournaments(sortedTournaments);
    };

    loadTournaments();
    window.addEventListener('storage', loadTournaments);
    
    return () => {
      window.removeEventListener('storage', loadTournaments);
    };
  }, []);

  const handleDelete = (id: string) => {
    const updatedTournaments = tournaments.filter(t => t.id !== id);
    localStorage.setItem('activeTournaments', JSON.stringify(updatedTournaments));
    setTournaments(updatedTournaments);
  };

  const handleEdit = (id: string) => {
    // Update lastVisited timestamp
    const updatedTournaments = tournaments.map(t => 
      t.id === id 
        ? { ...t, lastVisited: new Date().toISOString() }
        : t
    );
    localStorage.setItem('activeTournaments', JSON.stringify(updatedTournaments));
    setTournaments(updatedTournaments);
    
    navigate(`/tournament/${id}`);
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-white">Active Tournaments</h2>
          <p className="text-dashboard-text mt-2">View and manage ongoing tournaments.</p>
        </div>

        <div className="bg-dashboard-card p-6 rounded-lg">
          {tournaments.length === 0 ? (
            <div className="text-center py-8 text-dashboard-text">
              No active tournaments. Create one to get started!
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tournament Name</TableHead>
                  <TableHead>Format</TableHead>
                  <TableHead>Players</TableHead>
                  <TableHead>Last Visited</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tournaments.map((tournament) => (
                  <TableRow key={tournament.id}>
                    <TableCell className="text-white">{tournament.name}</TableCell>
                    <TableCell className="text-dashboard-text">{tournament.format}</TableCell>
                    <TableCell className="text-dashboard-text">{tournament.players.length}</TableCell>
                    <TableCell className="text-dashboard-text">
                      {tournament.lastVisited 
                        ? new Date(tournament.lastVisited).toLocaleString()
                        : new Date(tournament.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <div className="space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEdit(tournament.id)}
                        >
                          Edit
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDelete(tournament.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ActiveTournaments;