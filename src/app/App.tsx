import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Analytics } from '@vercel/analytics/react';
import { UserProvider } from "@/contexts/UserContext";
import PrivateRoute from "@/components/auth/PrivateRoute";
import { UserProfile } from "@/components/user/UserProfile";
import Index from "./routes/Index";
import Tournament from "./routes/Tournament";
import ActiveTournaments from "./routes/ActiveTournaments";
import TournamentView from "./routes/TournamentView";
import Rules from "./routes/Rules";
import Privacy from "./routes/Privacy";
import Terms from "./routes/Terms";
import DeleteData from "./routes/DeleteData";
import Settings from "./routes/Settings";
import Profile from "./routes/Profile";
import Footer from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/toaster";
import "./App.css";

const App = () => {
  return (
    <UserProvider>
      <Router>
        <div className="min-h-screen bg-dashboard-background rounded-2xl">
          <div className="fixed top-4 right-4 z-50">
            <UserProfile />
          </div>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/tournament" element={
              <PrivateRoute>
                <Tournament />
              </PrivateRoute>
            } />
            <Route path="/tournament/:id" element={
              <PrivateRoute>
                <TournamentView />
              </PrivateRoute>
            } />
            <Route path="/active-tournaments" element={
              <PrivateRoute>
                <ActiveTournaments />
              </PrivateRoute>
            } />
            <Route path="/rules" element={<Rules />} />
            <Route path="/settings" element={
              <PrivateRoute>
                <Settings />
              </PrivateRoute>
            } />
            <Route path="/profile" element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            } />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/delete-data" element={<DeleteData />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Footer />
        </div>
        <Toaster />
        <Analytics />
      </Router>
    </UserProvider>
  );
};

export default App;