import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePortfolio } from '../context/portfolioContext';
import Icon from './Icon';

export default function Navbar() {
  const { user, logout } = useAuth();
  const profile = usePortfolio();
  const { pathname } = useLocation();
  const [openPath, setOpenPath] = useState(null);
  const open = openPath === pathname;
  return (
    <header className="site-header">
      <a href="#main-content" className="skip-link">Skip to content</a>
      <nav className="container navigation" aria-label="Main navigation">
        <Link to="/" className="brand" onClick={() => setOpenPath(null)} aria-label={`${profile.full_name}, home`}>
          <span className="brand-icon"><Icon name="network" size={25}/></span>
          <span className="brand-name">{profile.full_name || 'Network Portfolio'}<span>NETWORKING & IT SUPPORT</span></span>
        </Link>
        <button className="menu-toggle" type="button" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="primary-menu" onClick={() => setOpenPath(open ? null : pathname)}><Icon name={open ? 'close' : 'menu'}/></button>
        <div id="primary-menu" className={`navigation-links ${open ? 'is-open' : ''}`} onKeyDown={event => { if (event.key === 'Escape') setOpenPath(null); }}>
          <NavLink to="/" end onClick={() => setOpenPath(null)}>Home</NavLink>
          <NavLink to="/about" onClick={() => setOpenPath(null)}>About</NavLink>
          <NavLink to="/projects" onClick={() => setOpenPath(null)}>Projects & labs</NavLink>
          <NavLink to="/blogs" onClick={() => setOpenPath(null)}>Notes</NavLink>
          {user?.is_admin === true && <Link to="/admin" onClick={() => setOpenPath(null)}>Admin</Link>}
          {user?.is_admin === true && <button className="text-link" onClick={logout}>Sign out</button>}
          <Link to="/contact" className="nav-contact" onClick={() => setOpenPath(null)}>Let’s connect <Icon name="arrow-up-right" size={17}/></Link>
        </div>
      </nav>
    </header>
  );
}
