import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import ProtectedRoute from './ProtectedRoute';

import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import Dashboard from '../pages/student/Dashboard';
<<<<<<< HEAD
import { TopicPractice, AdaptiveTest, PerformanceDashboard, Profile } from '../pages/student/StubPages';
=======
import Profile from '../pages/student/Profile';
import { TopicPractice, AdaptiveTest, PerformanceDashboard } from '../pages/student/StubPages';
>>>>>>> 1826be6 (Updated Phase 1 & 2)
import AdminDashboard from '../pages/admin/AdminDashboard';

const AppRouter = () => (
  <BrowserRouter>
    <AuthProvider>
      <Routes>
        {/* Public */}
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Student */}
        <Route path="/dashboard"   element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/practice"    element={<ProtectedRoute><TopicPractice /></ProtectedRoute>} />
        <Route path="/adaptive"    element={<ProtectedRoute><AdaptiveTest /></ProtectedRoute>} />
        <Route path="/performance" element={<ProtectedRoute><PerformanceDashboard /></ProtectedRoute>} />
        <Route path="/profile"     element={<ProtectedRoute><Profile /></ProtectedRoute>} />

        {/* Admin */}
        <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />

        {/* Default */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AuthProvider>
  </BrowserRouter>
);

export default AppRouter;
