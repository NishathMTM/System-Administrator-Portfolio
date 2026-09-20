import { Link } from 'react-router-dom';
import { usePortfolio } from '../../context/portfolioContext';
import NetworkTopology from '../../components/NetworkTopology';
import ProfilePortrait from '../../components/ProfilePortrait';
import Reveal from '../../components/Reveal';
import MotionControl from '../../components/MotionControl';
import Icon from '../../components/Icon';
import './home-motion.css';

const focusAreas = [
  { icon: 'network', title: 'Networking', text: 'Connecting devices, understanding traffic, and building the foundations for reliable communication.', tags: ['TCP/IP', 'Routing & switching', 'LAN / WAN'] },
  { icon: 'headset', title: 'IT support', text: 'Helping people get back to work. A practical focus on technical issues, everyday devices, and clear communication.', tags: ['Desktop support', 'Troubleshooting', 'User support'] },
  { icon: 'shield', title: 'Systems & security', text: 'The infrastructure behind the experience. Exploring secure access, system services, and dependable connections.', tags: ['Infrastructure', 'Access control', 'Monitoring'] },
];
const supportTopics = [
  { icon: 'monitor', title: 'Devices & desktops', text: 'Operating systems, applications, peripherals, and the tools people use every day.' },
  { icon: 'route', title: 'Connectivity issues', text: 'A methodical approach to Wi-Fi, local networks, and access to shared services.' },
  { icon: 'headset', title: 'People-first support', text: 'Listening to the problem, explaining the next step, and documenting the resolution.' },
];

export default function Home() {
  const profile = usePortfolio();
  return <>
    <section className="hero-section photo-hero">
      <div className="hero-grid-background" aria-hidden="true"/>
      <div className="signal-background" aria-hidden="true"><i/><i/><i/></div>
      <div className="container hero-layout">
        <div className="hero-copy hero-enter">
          <div className="hero-eyebrow"><span className="eyebrow-line"/> NETWORKING & IT SUPPORT</div>
          <p className="hero-intro">Hi, I’m {profile.full_name} <span className="wave-mark" aria-hidden="true">↗</span></p>
          <h1>Connecting systems.<br/><span>Supporting people.</span></h1>
          <p className="hero-description">{profile.bio}</p>
          <div className="hero-actions"><Link to="/projects" className="btn btn-primary">Explore projects & labs <Icon name="arrow-up-right" size={19}/></Link><Link to="/contact" className="btn btn-secondary">Let’s connect <Icon name="arrow-right" size={17}/></Link></div>
          <div className="hero-signature"><span className="signature-symbol"><Icon name="terminal" size={17}/></span><span>Technology with purpose.<br/><strong>Support with a human touch.</strong></span><span className="signature-divider"/><span className="signature-role">{profile.title}</span></div>
        </div>
        <div className="portrait-stage hero-enter">
          <div className="portrait-orbit orbit-outer" aria-hidden="true"><span/></div><div className="portrait-orbit orbit-inner" aria-hidden="true"><span/></div>
          <div className="portrait-frame"><ProfilePortrait className="hero-portrait"/><div className="portrait-shade"/><div className="portrait-caption"><span className="portrait-caption-line"/><span>{profile.full_name}<small>{profile.title}</small></span><Icon name="arrow-up-right" size={22}/></div></div>
          <a href="#network-map" className="floating-label label-network"><span><Icon name="network" size={21}/></span><div>Well connected<small>NETWORKING & SYSTEMS</small></div><span className="status-dot"/></a>
          <a href="#it-support" className="floating-label label-support"><span><Icon name="headset" size={21}/></span><div>Here to help<small>IT SUPPORT</small></div><Icon name="arrow-up-right" size={14}/></a>
          <span className="portrait-corner corner-top" aria-hidden="true"/><span className="portrait-corner corner-bottom" aria-hidden="true"/>
        </div>
      </div>
      <div className="container hero-bottom"><a href="#focus">Explore what I do <Icon name="arrow-down" size={16}/></a><span className="hero-coordinate">NETWORKING / IT SUPPORT / INFRASTRUCTURE</span><MotionControl/></div>
    </section>
    <section className="technology-strip" aria-label="Areas of focus"><div className="container"><span className="strip-label">CONNECTED BY PURPOSE</span>{[{name:'Networking',icon:'network'},{name:'IT support',icon:'headset'},{name:'Troubleshooting',icon:'tools'},{name:'Infrastructure',icon:'server'}].map(topic => <span className="strip-topic" key={topic.name}><Icon name={topic.icon} size={22}/>{topic.name}</span>)}</div></section>
    <section className="container focus-section" id="focus"><Reveal><div className="section-heading"><div><p className="eyebrow">01 / AREAS OF FOCUS</p><h2>Connected technology.<br/><span className="muted-heading">Confident people.</span></h2></div><p>From the network behind the scenes<br className="desktop-break"/> to the person on the other side of the screen.</p></div></Reveal><div className="focus-grid">{focusAreas.map((area, i) => <Reveal key={area.title} delay={i * 100}><article className="focus-card"><div className="focus-card-top"><span className="focus-icon"><Icon name={area.icon} size={27}/></span><span className="mono">/0{i + 1}</span></div><h3>{area.title}</h3><p>{area.text}</p><div className="tag-list">{area.tags.map(tag => <span key={tag}>{tag}</span>)}</div></article></Reveal>)}</div></section>
    <section className="container support-section" id="it-support"><Reveal><div className="support-heading"><span className="focus-icon"><Icon name="headset" size={27}/></span><p className="eyebrow">02 / IT SUPPORT</p><h2>A technical problem.<br/><span className="accent-text">A human solution.</span></h2><p>Good support starts with understanding what someone needs to do. These are the everyday connections that matter.</p></div></Reveal><div className="support-topics">{supportTopics.map((topic, i) => <Reveal key={topic.title} delay={i * 90}><div className="support-topic"><Icon name={topic.icon} size={24}/><div><h3>{topic.title}</h3><p>{topic.text}</p></div><span className="mono">0{i + 1}</span></div></Reveal>)}<Link to="/contact" className="text-link">Let’s talk about IT support <Icon name="arrow-up-right" size={18}/></Link></div></section>
    <section className="container network-feature" id="network-map"><Reveal><div className="network-feature-copy"><p className="eyebrow">03 / BEHIND THE CONNECTION</p><h2>Every device.<br/>Part of a bigger picture.</h2><p>A working network brings it all together: people, devices, and the services they rely on. Explore the diagram to see how each part connects.</p><div className="network-feature-note"><Icon name="network"/><span>Select a device to explore its role.</span></div></div></Reveal><Reveal delay={120}><NetworkTopology/></Reveal></section>
    <section className="container about-preview about-preview-dynamic"><Reveal><div className="about-visual" aria-hidden="true"><span className="mono">A HUMAN BEHIND THE NETWORK</span><div className="about-network"><span className="about-ring"/><span className="about-ring ring-two"/><span className="about-center">{profile.full_name.split(' ').map(name => name[0]).slice(0,2).join('')}<span>NETWORKING + IT SUPPORT</span></span><span className="orbit-dot dot-one"/><span className="orbit-dot dot-two"/><span className="orbit-tag tag-one"><Icon name="network" size={15}/> Connect</span><span className="orbit-tag tag-two"><Icon name="headset" size={15}/> Support</span></div><span className="mono">PEOPLE + TECHNOLOGY</span></div></Reveal><Reveal delay={120}><div className="about-preview-copy"><p className="eyebrow">04 / ABOUT ME</p><h2>{profile.about_heading}</h2><p>{profile.about_body?.split('\n').filter(Boolean)[0]}</p>{profile.skills.length > 0 && <div className="tag-list about-skill-tags">{profile.skills.slice(0,6).map(skill => <span key={skill}>{skill}</span>)}</div>}<Link to="/about" className="text-link">Get to know me <Icon name="arrow-up-right" size={18}/></Link></div></Reveal></section>
    <section className="container"><Reveal><div className="contact-banner"><div><p className="eyebrow">LET’S MAKE A CONNECTION</p><h2>Let’s put technology<br/>to work for people.</h2><p>Networking, IT support, or a new opportunity. Let’s talk.</p></div><Link to="/contact" className="btn btn-primary">Get in touch <Icon name="arrow-up-right" size={20}/></Link><Icon name="network" className="banner-network" size={210}/></div></Reveal></section>
  </>;
}
