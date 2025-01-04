import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { TournamentProvider } from '@/contexts/TournamentContext';
import PrivateRoute from "./components/auth/PrivateRoute";
import Login from "./pages/Login";
import Index from "./pages/Index";
import Tournament from "./pages/Tournament";
import ActiveTournaments from "./pages/ActiveTournaments";
import TournamentView from "./pages/TournamentView";
import "./App.css";

function App() {
  return (
    <TournamentProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Index />
              </PrivateRoute>
            }
          />
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
        </Routes>
      </Router>
    </TournamentProvider>
  );
}

export default App;