import Layout from "@/components/dashboard/Layout";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import TournamentCreator from "@/components/tournament/TournamentCreator";

const Tournament = () => {
  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-white">Beer Pong Tournament 🏆</h2>
          <p className="text-dashboard-text mt-2">Create and manage your tournaments.</p>
        </div>
        <TournamentCreator />
      </div>
    </Layout>
  );
};

export default Tournament;