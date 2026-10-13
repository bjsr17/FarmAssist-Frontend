import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { Footer } from './components/common/Footer';
import { QuickLoginBar } from './components/common/QuickLoginBar';

// Public Pages
import { LandingPage } from './pages/LandingPage';
import { CatalogPage } from './pages/CatalogPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { TrackPublicPage } from './pages/TrackPublicPage';

// Farmer Pages
import { FarmerDashboard } from './pages/FarmerDashboard';
import { BookServicePage } from './pages/BookServicePage';
import { FarmerRequestsPage } from './pages/FarmerRequestsPage';
import { FarmerProfilePage } from './pages/FarmerProfilePage';

// Provider Pages
import { ProviderDashboard } from './pages/ProviderDashboard';
import { ProviderQueuePage } from './pages/ProviderQueuePage';
import { ProviderProfilePage } from './pages/ProviderProfilePage';

// Admin Pages
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminRequestsPage } from './pages/AdminRequestsPage';
import { AdminCatalogPage } from './pages/AdminCatalogPage';
import { AdminUsersPage } from './pages/AdminUsersPage';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-xs text-slate-500">
        Authenticating...
      </div>
    );
  }

  if (!user) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export const App = () => {
  const { user } = useAuth();
  const location = useLocation();

  const isDashboardRoute =
    location.pathname.startsWith('/farmer/') ||
    location.pathname.startsWith('/provider/') ||
    location.pathname.startsWith('/admin/');

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Quick Interactive Demo Persona Switcher */}
      <QuickLoginBar />

      {/* Main Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <div className="flex-1 flex">
        {user && isDashboardRoute && <Sidebar />}

        <main className={`flex-1 ${isDashboardRoute ? 'p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full' : ''}`}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/catalog" element={<CatalogPage />} />
            <Route path="/track" element={<TrackPublicPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Farmer Protected Routes */}
            <Route
              path="/farmer/dashboard"
              element={
                <ProtectedRoute allowedRoles={['ROLE_FARMER', 'ROLE_ADMIN']}>
                  <FarmerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/farmer/book"
              element={
                <ProtectedRoute allowedRoles={['ROLE_FARMER', 'ROLE_ADMIN']}>
                  <BookServicePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/farmer/requests"
              element={
                <ProtectedRoute allowedRoles={['ROLE_FARMER', 'ROLE_ADMIN']}>
                  <FarmerRequestsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/farmer/profile"
              element={
                <ProtectedRoute allowedRoles={['ROLE_FARMER', 'ROLE_ADMIN']}>
                  <FarmerProfilePage />
                </ProtectedRoute>
              }
            />

            {/* Provider Protected Routes */}
            <Route
              path="/provider/dashboard"
              element={
                <ProtectedRoute allowedRoles={['ROLE_PROVIDER', 'ROLE_ADMIN']}>
                  <ProviderDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/provider/queue"
              element={
                <ProtectedRoute allowedRoles={['ROLE_PROVIDER', 'ROLE_ADMIN']}>
                  <ProviderQueuePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/provider/active-jobs"
              element={
                <ProtectedRoute allowedRoles={['ROLE_PROVIDER', 'ROLE_ADMIN']}>
                  <ProviderQueuePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/provider/history"
              element={
                <ProtectedRoute allowedRoles={['ROLE_PROVIDER', 'ROLE_ADMIN']}>
                  <ProviderQueuePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/provider/profile"
              element={
                <ProtectedRoute allowedRoles={['ROLE_PROVIDER', 'ROLE_ADMIN']}>
                  <ProviderProfilePage />
                </ProtectedRoute>
              }
            />

            {/* Admin Protected Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/requests"
              element={
                <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                  <AdminRequestsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/catalog"
              element={
                <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                  <AdminCatalogPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                  <AdminUsersPage />
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>

      {/* Global Footer */}
      <Footer />
    </div>
  );
};
