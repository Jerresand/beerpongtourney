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
import { ArrowRight } from "lucide-react";
import { Tournament } from "@/types/tournament";
import { tournamentApi } from "@/services/api";
import { useToast } from "@/components/ui/use-toast";

const ActiveTournaments = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
        const userId = userProfile.id;

        if (!userId) {
          throw new Error('User not authenticated');
        }

        const response = await tournamentApi.getTournaments(userId);
        if (!response.success || !response.data) {
          throw new Error(response.error || 'Failed to fetch tournaments');
        }
        setTournaments(response.data);
      } catch (error) {
        console.error('Failed to fetch tournaments:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to load tournaments. Please try again."
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTournaments();
  }, [toast]);

  const handleEdit = async (id: string) => {
    try {
      // Update lastVisited timestamp in MongoDB
      const tournament = tournaments.find(t => t.id === id);
      if (tournament) {
        const response = await tournamentApi.updateTournament(id, {
          ...tournament,
          lastVisited: new Date().toISOString()
        });
        
        if (!response.success) {
          throw new Error(response.error);
        }
      }
      
      navigate(`/tournament/${id}`);
    } catch (error) {
      console.error('Failed to update tournament:', error);
      // Still navigate even if update fails
      navigate(`/tournament/${id}`);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-dashboard-text">Loading tournaments...</div>
        </div>
      </Layout>
    );
  }

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
                    <TableCell className="font-medium text-white">
                      {tournament.name}
                    </TableCell>
                    <TableCell className="text-dashboard-text">
                      {tournament.format === "singles" ? "Singles" : "Doubles"}
                    </TableCell>
                    <TableCell className="text-dashboard-text">
                      {tournament.players.length}
                    </TableCell>
                    <TableCell className="text-dashboard-text">
                      {tournament.lastVisited
                        ? new Date(tournament.lastVisited).toLocaleDateString()
                        : "Never"}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(tournament.id)}
                        className="hover:bg-dashboard-background"
                      >
                        <ArrowRight className="h-5 w-5 text-dashboard-text" />
                      </Button>
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