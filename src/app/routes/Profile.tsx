import { useUser } from "@/contexts/UserContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Medal, Calendar, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { user } = useUser();
  const navigate = useNavigate();

  if (!user) return null;

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="min-h-screen bg-dashboard-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="text-dashboard-muted hover:text-white"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        {/* Profile Header */}
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="absolute inset-0 -m-1 rounded-full bg-gradient-to-r from-dashboard-accent to-dashboard-highlight animate-pulse"></div>
            <Avatar className="h-32 w-32 border-4 border-white">
              <AvatarImage src={user.profilePicture} alt={user.name} />
              <AvatarFallback className="text-3xl">{initials}</AvatarFallback>
            </Avatar>
          </div>
          <h1 className="text-4xl font-bold text-white">{user.name}</h1>
          <p className="text-dashboard-muted">
            {user.email || "No email provided"}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 bg-dashboard-card border-dashboard-accent/20">
            <div className="flex items-center space-x-4">
              <Trophy className="h-10 w-10 text-dashboard-accent" />
              <div>
                <h3 className="text-lg font-semibold text-white">Tournaments</h3>
                <p className="text-3xl font-bold text-dashboard-accent">12</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-dashboard-card border-dashboard-accent/20">
            <div className="flex items-center space-x-4">
              <Medal className="h-10 w-10 text-dashboard-accent" />
              <div>
                <h3 className="text-lg font-semibold text-white">Wins</h3>
                <p className="text-3xl font-bold text-dashboard-accent">24</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-dashboard-card border-dashboard-accent/20">
            <div className="flex items-center space-x-4">
              <Calendar className="h-10 w-10 text-dashboard-accent" />
              <div>
                <h3 className="text-lg font-semibold text-white">Member Since</h3>
                <p className="text-lg font-medium text-dashboard-accent">
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="p-6 bg-dashboard-card border-dashboard-accent/20">
          <h2 className="text-2xl font-bold text-white mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-dashboard-accent/20">
              <div>
                <p className="text-white">Won Tournament</p>
                <p className="text-sm text-dashboard-muted">Friday Night Tourney</p>
              </div>
              <span className="text-dashboard-muted">2 days ago</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-dashboard-accent/20">
              <div>
                <p className="text-white">Created Tournament</p>
                <p className="text-sm text-dashboard-muted">Weekend Championship</p>
              </div>
              <span className="text-dashboard-muted">5 days ago</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-white">Joined Tournament</p>
                <p className="text-sm text-dashboard-muted">Pro League Season 1</p>
              </div>
              <span className="text-dashboard-muted">1 week ago</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
} 