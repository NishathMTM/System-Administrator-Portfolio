import { Link } from 'react-router-dom';
import { usePortfolio } from '../context/portfolioContext';
import Icon from './Icon';

export default function Footer() {
  const profile = usePortfolio();
  return <footer className="site-footer"><div className="container footer-top">
    <Link to="/" className="brand"><span className="brand-icon"><Icon name="network"/></span><span className="brand-name">{profile.full_name}<span>CONNECTED BY CURIOSITY.</span></span></Link>
    <p>Connecting people. Supporting possibilities.</p>
    <div className="footer-links">{profile.linkedin_url && <a href={profile.linkedin_url} target="_blank" rel="noreferrer">LinkedIn <Icon name="arrow-up-right" size={14}/></a>}<Link to="/contact">Get in touch <Icon name="arrow-up-right" size={15}/></Link></div>
  </div><div className="container footer-bottom"><span>© {new Date().getFullYear()} {profile.full_name}. All rights reserved.</span><div><span className="footer-note"><span className="status-dot"/> Networking. IT support. People.</span></div></div></footer>;
}
