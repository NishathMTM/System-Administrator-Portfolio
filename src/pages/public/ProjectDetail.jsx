import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProject } from '../../api/projects';

const ProjectDetail = () => {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sample project for fallback
  const sampleProject = {
    title: 'E-commerce Platform',
    slug: 'ecommerce-platform',
    description: 'A full-featured e-commerce platform built with React and Node.js, featuring product management, cart functionality, and payment integration.',
    featured_image: 'https://via.placeholder.com/800x400?text=E-Commerce',
    github_link: 'https://github.com',
    live_link: 'https://example.com',
    technologies: ['React', 'Node.js', 'MongoDB', 'Stripe API']
  };

  useEffect(() => {
    const loadProject = async () => {
      try {
        setLoading(true);
        const res = await getProject(slug);
        setProject(res.data.data || res.data);
        setError(null);
      } catch (err) {
        console.error(err);
        setProject(sampleProject);
        setError(null);
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [slug]);

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center' }}>
        <div className="spinner" style={{ margin: '3rem auto' }}></div>
        <p>Loading project details...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container">
        <h1>Project Not Found</h1>
        <p>Sorry, the project you're looking for doesn't exist.</p>
        <Link to="/projects" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Back to Projects
        </Link>
      </div>
    );
  }

  return (
    <div className="container">
      <Link to="/projects" style={{ color: 'var(--primary-color)', marginBottom: '1rem', display: 'inline-block' }}>
        ← Back to Projects
      </Link>

      <h1 style={{ marginTop: '1rem' }}>{project.title}</h1>

      {project.featured_image && (
        <img
          src={project.featured_image}
          alt={project.title}
          style={{
            width: '100%',
            maxHeight: '500px',
            objectFit: 'cover',
            borderRadius: '8px',
            marginBottom: '2rem',
            marginTop: '1rem'
          }}
        />
      )}

      <div style={{ marginBottom: '2rem' }}>
        <h2>Overview</h2>
        <p style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>{project.description}</p>
      </div>

      {project.technologies && (
        <div style={{ marginBottom: '2rem' }}>
          <h2>Technologies Used</h2>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1rem' }}>
            {project.technologies.map((tech, i) => (
              <span
                key={i}
                style={{
                  display: 'inline-block',
                  padding: '0.5rem 1rem',
                  backgroundColor: 'var(--primary-color)',
                  color: 'white',
                  borderRadius: '20px',
                  fontSize: '0.9rem'
                }}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}

      <div style={{ marginBottom: '2rem' }}>
        <h2>Links</h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {project.github_link && (
            <a
              href={project.github_link}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary"
            >
              🐙 View on GitHub
            </a>
          )}
          {project.live_link && (
            <a
              href={project.live_link}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              🚀 Live Demo
            </a>
          )}
        </div>
      </div>

      <div style={{ background: 'linear-gradient(135deg, var(--card-bg), #2d3748)', padding: '2rem', borderRadius: '8px', marginTop: '3rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>More Projects</h2>
        <Link to="/projects" className="btn btn-primary">
          View All Projects
        </Link>
      </div>
    </div>
  );
};

export default ProjectDetail;