import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Icon from './Icon';
import '../pages/admin/admin.css';

const navigation = [
  { to: '/admin', label: 'Overview', icon: 'monitor', end: true },
  { to: '/admin/profile', label: 'About & profile', icon: 'shield' },
  { to: '/admin/projects', label: 'Projects', icon: 'network' },
  { to: '/admin/blogs', label: 'Technical notes', icon: 'book' },
  { to: '/admin/contacts', label: 'Messages', icon: 'mail' },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [signingOut, setSigningOut] = useState(false);
  const [error, setError] = useState('');

  async function signOut() {
    setSigningOut(true);
    setError('');
    try {
      await logout();
      navigate('/admin/login', { replace: true });
    } catch {
      setError('Could not sign out. Please try again.');
      setSigningOut(false);
    }
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link to="/admin" className="admin-brand"><span><Icon name="network" size={24} /></span><div>Portfolio studio<small>PRIVATE WORKSPACE</small></div></Link>
        <nav className="admin-navigation" aria-label="Administration">{navigation.map(item => (
          <NavLink key={item.to} to={item.to} end={item.end}><Icon name={item.icon} size={19} />{item.label}</NavLink>
        ))}</nav>
        <div className="admin-sidebar-bottom">
          <Link to="/" className="admin-website-link"><Icon name="globe" size={18} />View website<Icon name="arrow-up-right" size={15} /></Link>
          <div className="admin-account"><span className="admin-avatar">{(user?.name || 'A').slice(0, 1)}</span><div><strong>{user?.name || 'Administrator'}</strong><small>Administrator</small></div></div>
          <button className="admin-button admin-button-full" onClick={signOut} disabled={signingOut}>{signingOut ? 'Signing out…' : 'Sign out'}</button>
          {error && <p className="admin-notice admin-notice-error" role="alert">{error}</p>}
        </div>
      </aside>
      <section className="admin-workspace" aria-label="Portfolio management"><div className="admin-workspace-bar"><span><span className="admin-status-dot" />Administrator access</span><span>NETWORKING & IT SUPPORT</span></div><div className="admin-content"><Outlet /></div></section>
    </div>
  );
}
