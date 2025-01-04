import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Team, Tournament } from '@/types/tournament';
import { useToast } from "@/hooks/use-toast";

interface TeamViewProps {
  tournament: Tournament;
  onTeamNameUpdate: (teamId: string, name: string) => void;
}

const TeamView = ({ tournament, onTeamNameUpdate }: TeamViewProps) => {
  const [editingTeamId, setEditingTeamId] = useState<string | null>(null);
  const [newTeamName, setNewTeamName] = useState('');
  const { toast } = useToast();

  const handleEditClick = (team: Team) => {
    setEditingTeamId(team.id);
    setNewTeamName(team.name);
  };

  const handleSave = (teamId: string) => {
    if (newTeamName.trim()) {
      onTeamNameUpdate(teamId, newTeamName.trim());
      setEditingTeamId(null);
      setNewTeamName('');
      toast({
        title: "Team name updated",
        description: "The team name has been successfully updated.",
      });
    }
  };

  const handleCancel = () => {
    setEditingTeamId(null);
    setNewTeamName('');
  };

  if (!tournament.teams || tournament.teams.length === 0) {
    return (
      <div className="bg-dashboard-card p-6 rounded-lg">
        <h3 className="text-xl font-bold text-white mb-4">Teams</h3>
        <p className="text-dashboard-text">No teams created yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-dashboard-card p-6 rounded-lg">
      <h3 className="text-xl font-bold text-white mb-4">Teams</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead key="name">Team Name</TableHead>
            <TableHead key="players">Players</TableHead>
            <TableHead key="stats">Stats</TableHead>
            <TableHead key="actions">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tournament.teams.map((team) => (
            <TableRow key={team.id}>
              <TableCell key={`${team.id}-name`} className="text-white">
                {editingTeamId === team.id ? (
                  <Input
                    value={newTeamName}
                    onChange={(e) => setNewTeamName(e.target.value)}
                    className="max-w-[200px] bg-white text-black"
                    placeholder="Enter new name"
                  />
                ) : (
                  team.name
                )}
              </TableCell>
              <TableCell key={`${team.id}-players`} className="text-dashboard-text">
                {team.players.map(p => p.name).join(' & ')}
              </TableCell>
              <TableCell key={`${team.id}-stats`} className="text-dashboard-text">
                <div className="text-sm">
                  W: {team.stats?.wins || 0} L: {team.stats?.losses || 0} ({team.stats?.gamesPlayed || 0} games)
                </div>
              </TableCell>
              <TableCell key={`${team.id}-actions`}>
                <div className="flex gap-2">
                  {editingTeamId === team.id ? (
                    <>
                      <Button 
                        variant="default"
                        onClick={() => handleSave(team.id)}
                        size="sm"
                      >
                        Save
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={handleCancel}
                        size="sm"
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button 
                      variant="outline"
                      onClick={() => handleEditClick(team)}
                      size="sm"
                    >
                      Edit Name
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TeamView;