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
import { useToast } from "@/components/ui/use-toast";

const ActiveTournaments = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchTournaments = () => {
      try {
        const storedTournaments = JSON.parse(localStorage.getItem('tournaments') || '[]');
        setTournaments(storedTournaments);
      } catch (error) {
        console.error('Failed to fetch tournaments:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load tournaments. Please try again."
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTournaments();
  }, [toast]);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-dashboard-accent"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-dashboard-text">Active Tournaments</h1>
          <Button
            onClick={() => navigate('/tournament')}
            className="bg-dashboard-accent hover:bg-dashboard-accent/90"
          >
            Create New Tournament
          </Button>
        </div>

        {tournaments.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-dashboard-text mb-4">No Active Tournaments</h2>
            <p className="text-dashboard-muted mb-8">Create your first tournament to get started!</p>
            <Button
              onClick={() => navigate('/tournament')}
              className="bg-dashboard-accent hover:bg-dashboard-accent/90"
            >
              Create Tournament
            </Button>
          </div>
        ) : (
          <div className="bg-dashboard-card rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tournament Name</TableHead>
                  <TableHead>Format</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Phase</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tournaments.map((tournament) => (
                  <TableRow key={tournament.id}>
                    <TableCell className="font-medium text-dashboard-text">
                      {tournament.name}
                    </TableCell>
                    <TableCell className="text-dashboard-text">
                      {tournament.format === "singles" ? "Singles" : "Doubles"}
                    </TableCell>
                    <TableCell className="text-dashboard-text">
                      {tournament.type === "playoffs" ? "Playoffs Only" : "Regular + Playoffs"}
                    </TableCell>
                    <TableCell className="text-dashboard-text">
                      {tournament.currentPhase === "regular" ? "Regular Season" : "Playoffs"}
                    </TableCell>
                    <TableCell className="text-dashboard-text">
                      {new Date(tournament.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        onClick={() => navigate(`/tournament/${tournament.id}`)}
                        variant="ghost"
                        className="text-dashboard-accent hover:text-dashboard-accent/90"
                      >
                        View <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ActiveTournaments;