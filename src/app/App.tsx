import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Analytics } from '@vercel/analytics/react';
import { UserProvider } from "@/contexts/UserContext";
import PrivateRoute from "@/components/auth/PrivateRoute";
import { UserProfile } from "@/components/user/UserProfile";
import Login from "./routes/Login";
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
        <div className="min-h-screen bg-dashboard-background p-4 sm:p-6 md:p-8 rounded-[2.5rem]">
          <div className="min-h-[calc(100vh-4rem)] bg-dashboard-background border-2 border-[#2c1810] rounded-[2rem] overflow-hidden relative">
            <div className="fixed top-4 right-4 z-50">
              <UserProfile />
            </div>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={
                <PrivateRoute>
                  <Index />
                </PrivateRoute>
              } />
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
              <Route path="/rules" element={
                <PrivateRoute>
                  <Rules />
                </PrivateRoute>
              } />
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
        </div>
        <Toaster />
        <Analytics />
      </Router>
    </UserProvider>
  );
};

export default App;