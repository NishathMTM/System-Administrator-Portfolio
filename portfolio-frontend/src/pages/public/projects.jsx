import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProjects } from '../../api/projects';
import Icon from '../../components/Icon';
import ContentImage from '../../components/ContentImage';
import { networkLabs, normalizeTags } from '../../data/networkLabs';
import './content-pages.css';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    let active = true;
    const loadProjects = async () => {
      const published = [];
      let page = 1;
      let lastPage = 1;
      do {
        const { data } = await getProjects({ page });
        const records = data?.data ?? data;
        if (!Array.isArray(records)) throw new Error('Invalid projects response');
        if (!active) return;
        published.push(...records.filter(project => project?.slug && project?.title));
        setProjects([...published]);
        lastPage = Number(data?.meta?.last_page) || 1;
        page += 1;
      } while (page <= lastPage);
      if (active) setStatus('ready');
    };
    loadProjects().catch(() => {
      if (active) {
        setStatus('unavailable');
      }
    });
    return () => { active = false; };
  }, []);

  return (
    <div className="container page-shell content-page">
      <header className="content-page-header">
        <span className="eyebrow">Explore the network</span>
        <h1 className="page-heading">Networks. <span className="content-accent">By design.</span></h1>
        <p className="content-intro muted">A closer look at networking, IT support, and the practical work that keeps people and technology connected.</p>
      </header>

      {status === 'loading' && <p className="content-status muted" role="status">Loading published projects…</p>}
      {status === 'unavailable' && <p className="content-status muted" role="status">{projects.length ? 'Some published projects could not be loaded.' : 'Published projects are temporarily unavailable.'} You can still explore the illustrative lab blueprints below.</p>}

      {projects.length > 0 && (
        <section className="content-section" aria-labelledby="published-projects">
          <div className="content-section-top"><h2 id="published-projects" className="section-heading">Published projects</h2><span className="content-count">{String(projects.length).padStart(2, '0')} projects</span></div>
          <div className="content-card-grid">
            {projects.map(project => (
              <article key={project.id ?? project.slug} className="content-card">
                <ContentImage className="content-card-image" src={project.featured_image} resetKey={project.slug} alt="" loading="lazy" fallback="project" />
                <div className="content-card-body">
                  <span className="eyebrow">Project</span>
                  <h3>{project.title}</h3>
                  <p className="muted">{project.description?.slice(0, 180)}{project.description?.length > 180 ? '…' : ''}</p>
                  <div className="tag-list">{normalizeTags(project.tags ?? project.technologies).map(tag => <span key={tag}>{tag}</span>)}</div>
                  <Link className="text-link" to={`/projects/${project.slug}`}>Explore project <Icon name="arrow-up-right" /></Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      <section className="content-section" aria-labelledby="lab-blueprints">
        <div className="content-section-top"><div><span className="eyebrow">The learning lab</span><h2 id="lab-blueprints" className="section-heading">From concepts to connections.</h2></div><span className="content-count">{String(networkLabs.length).padStart(2, '0')} blueprints</span></div>
        <p className="content-section-description muted">Illustrative practice scenarios for networking and IT support. These blueprints are learning resources, not completed client projects.</p>
        <div className="content-card-grid content-lab-grid">
          {networkLabs.map((lab, index) => (
            <article key={lab.slug} className="content-card content-lab-card">
              <div className={`content-lab-visual content-lab-visual-${index}`} aria-hidden="true">
                <span className="content-visual-caption">{lab.category}</span>
                <div className="content-topology">
                  <svg className="content-topology-lines" viewBox="0 0 300 132" preserveAspectRatio="none"><path d="M150 30V68M50 98V68H250V98M150 68V98" /></svg>
                  <div className="content-topology-core"><Icon name={lab.icon} /></div>
                  <div className="content-topology-leaves">{lab.topology.map(node => <span key={node}><Icon name="server" /><small>{node}</small></span>)}</div>
                </div>
                <span className="content-visual-number">0{index + 1}</span>
              </div>
              <div className="content-card-body">
                <span className="eyebrow">Lab blueprint / 0{index + 1}</span>
                <h3>{lab.title}</h3>
                <p className="muted">{lab.description}</p>
                <div className="tag-list">{lab.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
                <Link className="text-link" to={`/labs/${lab.slug}`}>Explore blueprint <Icon name="arrow-up-right" /></Link>
              </div>
            </article>
          ))}
        </div>
      </section>
      <div className="content-bottom-callout"><div><span className="eyebrow">Let’s connect</span><h2>Have a network challenge in mind?</h2></div><Link className="btn btn-primary" to="/contact">Get in touch <Icon name="arrow-up-right" /></Link></div>
    </div>
  );
};

export default Projects;
