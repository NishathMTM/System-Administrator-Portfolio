import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../pages/admin/admin.css';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="admin-auth-page"><p role="status">Checking your session…</p></div>;
  if (!user) return <Navigate to="/admin/login" replace />;
  if (user.is_admin !== true) return <div className="admin-auth-page"><div className="admin-auth-card"><h1>Administrator access required</h1><p>This account does not have permission to manage the portfolio.</p><Link className="admin-button" to="/">Return to website</Link></div></div>;
  return children;
}
