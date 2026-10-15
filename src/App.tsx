import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import { AppProvider } from './context/AppContext';
import { ProtectedRoute } from './auth/ProtectedRoute';

// Layout
import { AppLayout } from './components/layout/AppLayout';

// Public Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';

// Authenticated Pages
import { OverviewPage } from './pages/OverviewPage';
import { RepositoriesPage } from './pages/RepositoriesPage';
import { CodeAnalysisPage } from './pages/CodeAnalysisPage';
import { PatchesPage } from './pages/PatchesPage';
import { TestsPage } from './pages/TestsPage';
import { ContainerImagesPage } from './pages/ContainerImagesPage';
import { DeploymentsPage } from './pages/DeploymentsPage';
import { MonitoringPage } from './pages/MonitoringPage';
import { IncidentsPage } from './pages/IncidentsPage';
import { ActivityLogsPage } from './pages/ActivityLogsPage';
import { SettingsPage } from './pages/SettingsPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <Routes>
            {/* Public Marketing & Auth Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* Protected Engineering Workspace Routes */}
            <Route
              path="/app"
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/app/overview" replace />} />
              <Route path="overview" element={<OverviewPage />} />
              <Route path="repositories" element={<RepositoriesPage />} />
              <Route path="analysis" element={<CodeAnalysisPage />} />
              <Route path="patches" element={<PatchesPage />} />
              <Route path="tests" element={<TestsPage />} />
              <Route path="containers" element={<ContainerImagesPage />} />
              <Route path="deployments" element={<DeploymentsPage />} />
              <Route path="monitoring" element={<MonitoringPage />} />
              <Route path="incidents" element={<IncidentsPage />} />
              <Route path="activity" element={<ActivityLogsPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>

            {/* Catch-all Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
