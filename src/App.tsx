import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRoute from "./components/auth/PrivateRoute";
import Login from "./routes/Login";
import Index from "./routes/Index";
import Tournament from "./routes/Tournament";
import ActiveTournaments from "./routes/ActiveTournaments";
import TournamentView from "./routes/TournamentView";
import { Toaster } from "./components/ui/toaster";
import "./App.css";

function App() {
  return (
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
      <Toaster />
    </Router>
  );
}

export default App;