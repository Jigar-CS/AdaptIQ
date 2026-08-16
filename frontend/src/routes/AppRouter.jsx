import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import ProtectedRoute from './ProtectedRoute';
import RoleRoute from './RoleRoute';

import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import Dashboard from '../pages/student/Dashboard';
import Profile from '../pages/student/Profile';
import { TopicPractice, AdaptiveTest, PerformanceDashboard } from '../pages/student/StubPages';
import AdminDashboard from '../pages/admin/AdminDashboard';
import TopicManagement from '../pages/admin/TopicManagement';
import QuestionManagement from '../pages/admin/QuestionManagement';
import CsvImport from '../pages/admin/CsvImport';

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
        <Route path="/admin"            element={<RoleRoute requiredRole="admin"><AdminDashboard /></RoleRoute>} />
        <Route path="/admin/topics"     element={<RoleRoute requiredRole="admin"><TopicManagement /></RoleRoute>} />
        <Route path="/admin/questions"  element={<RoleRoute requiredRole="admin"><QuestionManagement /></RoleRoute>} />
        <Route path="/admin/csv-import" element={<RoleRoute requiredRole="admin"><CsvImport /></RoleRoute>} />

        {/* Default */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AuthProvider>
  </BrowserRouter>
);

export default AppRouter;
