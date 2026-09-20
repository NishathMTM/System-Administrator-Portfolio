import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProjects } from '../../api/projects';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sample projects for when API is not available
  const sampleProjects = [
    {
      id: 1,
      title: 'E-commerce Platform',
      slug: 'ecommerce-platform',
      description: 'A full-featured e-commerce platform built with React and Node.js, featuring product management, cart functionality, and payment integration.',
      featured_image: 'https://via.placeholder.com/400x300?text=E-Commerce',
      tags: ['React', 'Node.js', 'MongoDB']
    },
    {
      id: 2,
      title: 'Task Management App',
      slug: 'task-management',
      description: 'A collaborative task management application with real-time updates, team features, and productivity analytics.',
      featured_image: 'https://via.placeholder.com/400x300?text=Task+Manager',
      tags: ['React', 'Firebase', 'Tailwind']
    },
    {
      id: 3,
      title: 'Analytics Dashboard',
      slug: 'analytics-dashboard',
      description: 'An advanced analytics dashboard displaying real-time data visualization with interactive charts and metrics.',
      featured_image: 'https://via.placeholder.com/400x300?text=Dashboard',
      tags: ['Vue.js', 'Chart.js', 'Laravel']
    },
    {
      id: 4,
      title: 'Social Media Platform',
      slug: 'social-media',
      description: 'A social media platform with user profiles, messaging, and content sharing capabilities.',
      featured_image: 'https://via.placeholder.com/400x300?text=Social+Media',
      tags: ['React', 'Node.js', 'PostgreSQL']
    },
    {
      id: 5,
      title: 'Weather App',
      slug: 'weather-app',
      description: 'A real-time weather application with location tracking and detailed weather forecasts.',
      featured_image: 'https://via.placeholder.com/400x300?text=Weather',
      tags: ['React', 'OpenWeather API', 'Geolocation']
    },
    {
      id: 6,
      title: 'Video Streaming Platform',
      slug: 'video-streaming',
      description: 'A video streaming platform with user authentication, video uploads, and playback controls.',
      featured_image: 'https://via.placeholder.com/400x300?text=Video+Streaming',
      tags: ['React', 'Node.js', 'FFmpeg']
    }
  ];

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        const res = await getProjects();
        setProjects(res.data.data || res.data);
        setError(null);
      } catch (err) {
        console.error('Error loading projects:', err);
        // Use sample projects as fallback
        setProjects(sampleProjects);
        setError(null);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center' }}>
        <h1>Projects</h1>
        <div className="spinner"></div>
        <p style={{ marginTop: '1rem' }}>Loading projects...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>My Projects</h1>
      <p style={{ fontSize: '1.1rem', marginBottom: '2rem' }}>
        Here are some of my recent and featured projects. Each project showcases my skills
        in different areas of web development.
      </p>

      {error && (
        <div className="alert alert-error" style={{ marginBottom: '2rem' }}>
          {error}
        </div>
      )}

      {projects.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>No projects found.</p>
        </div>
      ) : (
        <div className="grid">
          {projects.map(project => (
            <div key={project.id} className="card">
              {project.featured_image && (
                <img src={project.featured_image} alt={project.title} className="card-image" />
              )}
              <div className="card-content">
                <h3 className="card-title">{project.title}</h3>
                <p className="card-description">
                  {project.description && project.description.substring(0, 150)}
                  {project.description && project.description.length > 150 ? '...' : ''}
                </p>
                {project.tags && (
                  <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {project.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        style={{
                          display: 'inline-block',
                          padding: '0.25rem 0.75rem',
                          backgroundColor: 'var(--primary-color)',
                          color: 'white',
                          borderRadius: '20px',
                          fontSize: '0.85rem'
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <Link to={`/projects/${project.slug}`} className="card-link">
                  View Details →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;