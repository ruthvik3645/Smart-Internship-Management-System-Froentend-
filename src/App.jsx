import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import { AdminRoute, CompanyRoute, StudentRoute } from './components/RoleRoutes';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/student/Dashboard';
import Browse from './pages/student/Browse';
import Applications from './pages/student/Applications';
import Logs from './pages/student/Logs';
import Postings from './pages/company/Postings';
import Applicants from './pages/company/Applicants';
import Interns from './pages/company/Interns';
import AdminDashboard from './pages/admin/Dashboard';
import Users from './pages/admin/Users';
import Reports from './pages/admin/Reports';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/student" element={<StudentRoute><Layout /></StudentRoute>}>
        <Route index element={<StudentDashboard />} />
        <Route path="internships" element={<Browse />} />
        <Route path="applications" element={<Applications />} />
        <Route path="logs" element={<Logs />} />
      </Route>

      <Route path="/company" element={<CompanyRoute><Layout /></CompanyRoute>}>
        <Route index element={<Navigate to="postings" replace />} />
        <Route path="postings" element={<Postings />} />
        <Route path="applicants" element={<Applicants />} />
        <Route path="interns" element={<Interns />} />
      </Route>

      <Route path="/admin" element={<AdminRoute><Layout /></AdminRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="reports" element={<Reports />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
