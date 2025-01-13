import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { Toaster } from '@/components/ui/toaster';
import { PrivateRoute } from '@/components/auth/PrivateRoute';
import Login from '@/app/routes/Login';
import Dashboard from '@/app/routes/Dashboard';
import Settings from '@/app/routes/Settings';
import Profile from '@/app/routes/Profile';
import { useAuth } from '@/hooks/useAuth';

export default function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <div className="min-h-screen bg-dashboard-background p-4 md:p-8">
        <div className="min-h-[calc(100vh-4rem)] bg-dashboard-background border-2 border-[#2c1810] rounded-[2.5rem] overflow-hidden">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={
              isAuthenticated ? <Navigate to="/" replace /> : <Login />
            } />
            
            {/* Protected Routes */}
            <Route element={<PrivateRoute />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/profile" element={<Profile />} />
            </Route>

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
      <Analytics />
      <Toaster />
    </Router>
  );
}