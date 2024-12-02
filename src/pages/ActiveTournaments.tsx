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
}

const ActiveTournaments = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);

  useEffect(() => {
    const loadTournaments = () => {
      const savedTournaments = JSON.parse(localStorage.getItem('activeTournaments') || '[]');
      setTournaments(savedTournaments);
    };

    loadTournaments();
    // Add event listener for storage changes
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
                  <TableHead>Created</TableHead>
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
                      {new Date(tournament.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="space-x-2">
                        <Button variant="outline" size="sm">
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