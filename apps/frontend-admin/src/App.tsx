import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import AuthLayout from './layouts/AuthLayout';
import LoginPage from './pages/auth/LoginPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import Dashboard from './pages/admin/Dashboard';
import Offers from './pages/admin/Offers';
import Services from './pages/admin/Services';
import Account from './pages/admin/Account';
import Content from './pages/admin/Content';
import { useAppSelector } from './hooks/redux';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

function App() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Route>

      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="offers" element={<Offers />} />
        <Route path="services" element={<Services />} />
        <Route path="account" element={<Account />} />
        <Route path="content" element={<Content />} />
      </Route>

      <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="*" element={<div className="flex items-center justify-center min-h-screen">404 - Not Found</div>} />
    </Routes>
  );
}

export default App;
