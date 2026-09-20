import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Icon from '../../components/Icon';

const sections = [
  { href: 'profile', icon: 'monitor', title: 'About & profile', copy: 'Your introduction, portrait, skills, experience, and CV.', action: 'Edit your profile' },
  { href: 'projects', icon: 'network', title: 'Projects', copy: 'Showcase networking labs, infrastructure work, and IT support projects.', action: 'Manage projects' },
  { href: 'blogs', icon: 'book', title: 'Technical notes', copy: 'Share troubleshooting guides and what you are learning.', action: 'Manage notes' },
  { href: 'contacts', icon: 'mail', title: 'Messages', copy: 'Read enquiries sent through your portfolio contact form.', action: 'Open inbox' },
];

export default function Dashboard() {
  const { user } = useAuth();
  return (
    <>
      <div className="admin-page-heading">
        <div><p className="admin-eyebrow">YOUR WORKSPACE</p><h1>Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}.</h1><p>Keep your portfolio as current as your skills.</p></div>
        <Link className="admin-button" to="/">View website <Icon name="arrow-up-right" size={16} /></Link>
      </div>
      <div className="admin-welcome-panel">
        <span className="admin-feature-icon"><Icon name="shield" size={32} /></span>
        <div><h2>Your portfolio. Your control.</h2><p>Edit your content here. Visitors see your published profile, projects, and notes; this workspace requires an administrator account.</p></div>
      </div>
      <div className="admin-dashboard-grid">{sections.map(section => (
        <Link key={section.href} to={`/admin/${section.href}`} className="admin-dashboard-card">
          <Icon name={section.icon} size={25} /><h2>{section.title}</h2><p>{section.copy}</p><span>{section.action} <Icon name="arrow-right" size={17} /></span>
        </Link>
      ))}</div>
      <div className="admin-tip"><Icon name="terminal" size={20} /><p>Working on something new? Save a project as a draft, then publish when it is ready.</p></div>
    </>
  );
}
