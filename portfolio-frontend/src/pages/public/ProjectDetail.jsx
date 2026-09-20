import { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { getProject } from '../../api/projects';
import Icon from '../../components/Icon';
import ContentImage from '../../components/ContentImage';
import { networkLabs, normalizeTags } from '../../data/networkLabs';
import './content-pages.css';

const ProjectDetail = () => {
  const { slug } = useParams();
  const { pathname } = useLocation();
  const isLab = pathname.startsWith('/labs/');
  const lab = isLab ? networkLabs.find(item => item.slug === slug) : null;
  const [result, setResult] = useState({ slug: null, project: null, status: 'loading' });

  useEffect(() => {
    if (isLab) return;
    let active = true;
    getProject(slug).then(({ data }) => {
      const record = data?.data ?? data;
      const project = record?.title && record?.slug === slug ? record : null;
      if (active) setResult({ slug, project, status: project ? 'ready' : 'missing' });
    }).catch(error => {
      if (active) setResult({ slug, project: null, status: error.response?.status === 404 ? 'missing' : 'unavailable' });
    });
    return () => { active = false; };
  }, [slug, isLab]);

  const project = isLab ? lab : (result.slug === slug ? result.project : null);
  const status = isLab ? (lab ? 'ready' : 'missing') : result.slug === slug ? result.status : 'loading';

  if (status === 'loading') return <div className="container page-shell content-page"><p className="content-status muted" role="status">Loading project details…</p></div>;

  if (!project) return (
    <div className="container page-shell content-page">
      <div className="content-empty"><Icon name="network" /><span className="eyebrow">Project library</span><h1 className="section-heading">{status === 'unavailable' ? 'Project unavailable.' : 'Project not found.'}</h1><p className="muted">{status === 'unavailable' ? 'The project service is currently unavailable. Please try again later, or explore the lab blueprints.' : 'There is no published project or lab blueprint at this address.'}</p><Link className="btn btn-primary" to="/projects"><Icon name="arrow-left" /> Back to projects</Link></div>
    </div>
  );

  return (
    <div className="container page-shell content-page">
      <Link to="/projects" className="text-link content-back-link"><Icon name="arrow-left" /> All projects & labs</Link>
      <header className="content-page-header content-detail-header"><span className="eyebrow">{lab ? 'Illustrative lab blueprint' : 'Project / Overview'}</span><h1 className="page-heading">{project.title}</h1><p className="content-intro muted">{project.description}</p><div className="tag-list">{normalizeTags(project.tags ?? project.technologies).map(tag => <span key={tag}>{tag}</span>)}</div></header>
      <ContentImage className="content-detail-image" src={project.featured_image} resetKey={slug} alt={project.title} />
      {lab ? (
        <div className="content-detail-layout">
          <div>
            <section className="content-article-panel"><span className="eyebrow">01 / The objective</span><h2 className="section-heading">What this lab explores</h2><p className="muted">{lab.objective}</p></section>
            <section className="content-article-panel"><span className="eyebrow">02 / The approach</span><h2 className="section-heading">Build it, step by step.</h2><ol className="content-step-list">{lab.steps.map((step, index) => <li key={step.title}><span className="content-step-number">0{index + 1}</span><div><h3>{step.title}</h3><p className="muted">{step.description}</p></div></li>)}</ol></section>
          </div>
          <aside className="content-blueprint-aside"><Icon name={lab.icon} /><span className="eyebrow">Verification checklist</span><h2>Prove the connection.</h2><ul className="content-check-list">{lab.checks.map(check => <li key={check}><Icon name="check" /><span>{check}</span></li>)}</ul><p className="content-aside-note muted">A suggested practice exercise. This blueprint does not represent completed work or a professional certification.</p></aside>
        </div>
      ) : (
        <section className="content-article-panel"><h2 className="section-heading">Project resources</h2><div className="content-resource-links">{project.github_link && <a href={project.github_link} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">View repository <Icon name="arrow-up-right" /></a>}{project.live_link && <a href={project.live_link} target="_blank" rel="noopener noreferrer" className="btn btn-primary">View project <Icon name="arrow-up-right" /></a>}{!project.github_link && !project.live_link && <p className="muted">Additional resources have not been published for this project.</p>}</div></section>
      )}
      <div className="content-bottom-callout"><div><span className="eyebrow">Keep exploring</span><h2>There’s more to connect.</h2></div><Link className="btn btn-secondary" to="/projects">View all projects <Icon name="arrow-right" /></Link></div>
    </div>
  );
};

export default ProjectDetail;
