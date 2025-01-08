import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "./components/auth/PrivateRoute";
import Login from "./routes/Login";
import Index from "./routes/Index";
import Tournament from "./routes/Tournament";
import ActiveTournaments from "./routes/ActiveTournaments";
import TournamentView from "./routes/TournamentView";
import Rules from "./routes/Rules";
import Privacy from "./routes/Privacy";
import Terms from "./routes/Terms";
import DeleteData from "./routes/DeleteData";
import Footer from "./components/layout/Footer";
import { Toaster } from "./components/ui/toaster";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <PrivateRoute>
            <Index />
          </PrivateRoute>
        } />
        
        <Route path="/login" element={<Login />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/delete-data" element={<DeleteData />} />
        <Route
          path="/tournament"
          element={
            <PrivateRoute>
              <Tournament />
            </PrivateRoute>
          }
        />
        <Route
          path="/tournament/:id"
          element={
            <PrivateRoute>
              <TournamentView />
            </PrivateRoute>
          }
        />
        <Route
          path="/active-tournaments"
          element={
            <PrivateRoute>
              <ActiveTournaments />
            </PrivateRoute>
          }
        />
        <Route
          path="/rules"
          element={
            <PrivateRoute>
              <Rules />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      <Footer />
      <Toaster />
      <Analytics />
      <SpeedInsights />
    </Router>
  );
}

export default App;