import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { homePath } from '../lib';
import { Spinner } from './ui';

function RoleRoute({ role, children }) {
  const { user, ready } = useAuth();
  if (!ready) return <div className="px-6"><Spinner /></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== role) return <Navigate to={homePath(user.role)} replace />;
  return children;
}

export const StudentRoute = ({ children }) => <RoleRoute role="STUDENT">{children}</RoleRoute>;
export const CompanyRoute = ({ children }) => <RoleRoute role="COMPANY">{children}</RoleRoute>;
export const AdminRoute = ({ children }) => <RoleRoute role="ADMIN">{children}</RoleRoute>;
