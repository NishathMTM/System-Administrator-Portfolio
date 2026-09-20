import { Link } from 'react-router-dom';
import { usePortfolio } from '../../context/portfolioContext';
import ProfilePortrait from '../../components/ProfilePortrait';
import Reveal from '../../components/Reveal';
import Icon from '../../components/Icon';
import './home-motion.css';

export default function About() {
  const profile = usePortfolio();
  const background = [{key:'experience', label:'Experience', icon:'tools'}, {key:'education', label:'Education', icon:'book'}, {key:'certifications',label:'Certifications',icon:'shield'}].filter(section => profile[section.key]);
  return <div className="container page-shell">
    <p className="eyebrow">THE PERSON BEHIND THE CONNECTIONS</p><h1 className="page-heading">Hello, I’m<br/><span className="accent-text">{profile.full_name}.</span></h1>
    <div className="profile-layout"><Reveal><aside className="profile-card"><ProfilePortrait className="profile-photo"/><h2>{profile.full_name}</h2><p>{profile.title}</p><div className="tag-list">{profile.skills.map(skill => <span key={skill}>{skill}</span>)}</div>{profile.resume_file && <a className="btn btn-primary" href={profile.resume_file} target="_blank" rel="noreferrer">View my CV <Icon name="download" size={17}/></a>}{profile.linkedin_url && <a className="text-link" href={profile.linkedin_url} target="_blank" rel="noreferrer">Connect on LinkedIn <Icon name="arrow-up-right" size={16}/></a>}</aside></Reveal><Reveal delay={100}><div className="profile-story"><p className="eyebrow">NETWORKING & IT SUPPORT</p><h2>{profile.about_heading}</h2>{profile.bio && <p className="profile-bio">{profile.bio}</p>}<div className="profile-about-body">{profile.about_body?.split(/\n\s*\n/).filter(Boolean).map((paragraph,i) => <p key={i}>{paragraph}</p>)}</div><div className="profile-principles"><div><Icon name="network"/><h3>Connect the bigger picture</h3><p>Understand how systems, services, and people work together.</p></div><div><Icon name="headset"/><h3>Support the person</h3><p>Approach technical challenges with patience, clarity, and practical next steps.</p></div></div><Link className="text-link" to="/projects">Explore projects & labs <Icon name="arrow-right" size={18}/></Link></div></Reveal></div>
    {background.length > 0 && <section className="professional-background" aria-label="Professional background">{background.map(section => <Reveal key={section.key}><article className="background-entry"><span className="focus-icon"><Icon name={section.icon}/></span><div><h2>{section.label}</h2><p>{profile[section.key]}</p></div></article></Reveal>)}</section>}
    <Reveal><div className="profile-next"><div><p className="eyebrow">LET’S CONNECT</p><h2>Ready for the next conversation.</h2><p>Have a networking challenge, an IT support opportunity, or a project in mind? Get in touch.</p></div><Link className="btn btn-secondary" to="/contact">Start a conversation <Icon name="arrow-up-right" size={18}/></Link></div></Reveal>
  </div>;
}
