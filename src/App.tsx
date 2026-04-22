/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { Layout } from './components/common/Layout';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Nutrition } from './pages/Nutrition';
import { Workouts } from './pages/Workouts';
import { Progress } from './pages/Progress';
import { Profile } from './pages/Profile';
import { Premium } from './pages/Premium';

export default function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/nutrition" element={<Nutrition />} />
              <Route path="/workouts" element={<Workouts />} />
              <Route path="/progress" element={<Progress />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/premium" element={<Premium />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}
