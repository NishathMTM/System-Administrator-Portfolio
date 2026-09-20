import { useState } from 'react';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Icon from '../components/Icon';
import { errorMessage } from './admin/adminUtils';
import './admin/admin.css';

export default function Login() {
  const { login, user, loading: checkingSession } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login({ email, password });
      navigate('/admin', { replace: true });
    } catch (err) {
      setError(errorMessage(err, 'Unable to sign in. Check your email and password, then try again.'));
      setLoading(false);
    }
  }

  if (checkingSession) return <div className="admin-auth-page"><p role="status">Checking your session…</p></div>;
  if (user?.is_admin === true) return <Navigate to="/admin" replace />;
  return (
    <div className="admin-auth-page"><div className="admin-auth-card">
      <span className="admin-feature-icon"><Icon name="shield" size={30} /></span>
      <p className="admin-eyebrow">PORTFOLIO STUDIO</p><h1>Welcome back.</h1><p>Sign in to your private workspace.</p>
      {error && <p className="admin-notice admin-notice-error" role="alert">{error}</p>}
      <form onSubmit={handleSubmit} className="admin-form">
        <fieldset disabled={loading}>
          <label className="admin-field" htmlFor="email">Email address<input id="email" name="email" type="email" autoComplete="username" value={email} onChange={event => setEmail(event.target.value)} required /></label>
          <label className="admin-field" htmlFor="password">Password<input id="password" name="password" type="password" autoComplete="current-password" value={password} onChange={event => setPassword(event.target.value)} required /></label>
          <button className="admin-button admin-button-primary admin-button-full" type="submit" disabled={loading}>{loading ? 'Signing in…' : 'Sign in'}<Icon name="arrow-right" size={17} /></button>
        </fieldset>
      </form>
      <Link to="/" className="admin-auth-back"><Icon name="arrow-left" size={16} />Back to website</Link>
    </div></div>
  );
}
