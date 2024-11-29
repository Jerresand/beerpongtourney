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

const ActiveTournaments = () => {
  const mockTournaments = [
    { id: 1, name: "Summer Tournament 2024", status: "In Progress", players: 8 },
    { id: 2, name: "Spring League", status: "Regular Season", players: 12 },
  ];

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-white">Active Tournaments</h2>
          <p className="text-dashboard-text mt-2">View and manage ongoing tournaments.</p>
        </div>

        <div className="bg-dashboard-card p-6 rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tournament Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Players</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockTournaments.map((tournament) => (
                <TableRow key={tournament.id}>
                  <TableCell className="text-white">{tournament.name}</TableCell>
                  <TableCell className="text-dashboard-text">{tournament.status}</TableCell>
                  <TableCell className="text-dashboard-text">{tournament.players}</TableCell>
                  <TableCell>
                    <div className="space-x-2">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button variant="destructive" size="sm">
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </Layout>
  );
};

export default ActiveTournaments;