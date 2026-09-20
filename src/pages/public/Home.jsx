import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../api/axios';
import { getProfile } from '../../api/profile';
import { getProjects } from '../../api/projects';

const Home = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 3;
  const [profile, setProfile] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [resumeHref, setResumeHref] = useState(null);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await getProfile();
        const p = res.data.data;
        setProfile(p);
        console.log('Profile data:', p);

        // Use the image and resume URLs directly since backend already provides full URLs
        if (p.profile_image) {
          console.log('Setting profile image to:', p.profile_image);
          setImageSrc(p.profile_image);
        }
        if (p.resume_file) {
          console.log('Setting resume to:', p.resume_file);
          setResumeHref(p.resume_file);
        }
      } catch (err) {
        console.error('error loading profile', err);
      }
    };
    const loadProjects = async () => {
      try {
        const res = await getProjects({ all: true });
        setProjects(res.data.data || []);
      } catch (err) {
        console.error('error loading projects', err);
      }
    };

    loadProfile();
    loadProjects();
  }, []);

  // Pagination logic
  const totalPages = Math.ceil(projects.length / projectsPerPage);
  const startIndex = (currentPage - 1) * projectsPerPage;
  const displayedProjects = projects.slice(startIndex, startIndex + projectsPerPage);

  const handlePrevPage = () => {
    setCurrentPage(prev => (prev > 1 ? prev - 1 : prev));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => (prev < totalPages ? prev + 1 : prev));
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="container hero-section">
        <div style={{ textAlign: 'center', marginTop: '2rem', marginBottom: '3rem' }}>
          {profile ? (
            <>
              {imageSrc && (
                <img
                  src={imageSrc}
                  alt={profile.full_name}
                  style={{
                    width: '150px',
                    height: '150px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    marginBottom: '1rem'
                  }}
                />
              )}
              <h1 style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>
                Hi, I'm {profile.full_name || 'a Developer'}
              </h1>
              {profile.title && (
                <p style={{ fontSize: '1.4rem', fontWeight: '500', marginBottom: '1rem' }}>
                  {profile.title}
                </p>
              )}
              {profile.bio && (
                <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto' }}>
                  {profile.bio}
                </p>
              )}
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>
                <Link to="/projects" className="btn btn-primary">
                  View My Projects
                </Link>
                <Link to="/contact" className="btn btn-secondary">
                  Get In Touch
                </Link>
              </div>
              <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                {profile.github_url && (
                  <a href={profile.github_url} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                    GitHub
                  </a>
                )}
                {profile.linkedin_url && (
                  <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                    LinkedIn
                  </a>
                )}
                {profile.twitter_url && (
                  <a href={profile.twitter_url} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                    Twitter
                  </a>
                )}
                {resumeHref && (
                  <a
                    href={resumeHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline"
                  >
                    Resume
                  </a>
                )}
              </div>
            </>
          ) : (
            <>
              <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>
                Hi, I'm a Developer
              </h1>
              <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                Crafting amazing digital experiences with modern web technologies
              </p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link to="/projects" className="btn btn-primary">
                  View My Projects
                </Link>
                <Link to="/contact" className="btn btn-secondary">
                  Get In Touch
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Skills Section */}
      <section className="container skills-section">
        <h2 style={{ textAlign: 'center', marginBottom: '3rem' }}>Skills & Expertise</h2>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
          <div className="skill-card">
            <div className="skill-icon" style={{ fontSize: '3rem', marginBottom: '1rem' }}>💻</div>
            <h3>Frontend Development</h3>
            <p>React, Vue.js, Tailwind CSS, JavaScript</p>
          </div>
          <div className="skill-card">
            <div className="skill-icon" style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚙️</div>
            <h3>Backend Development</h3>
            <p>Node.js, Laravel, Python, REST APIs</p>
          </div>
          <div className="skill-card">
            <div className="skill-icon" style={{ fontSize: '3rem', marginBottom: '1rem' }}>🗄️</div>
            <h3>Database Design</h3>
            <p>MySQL, PostgreSQL, MongoDB</p>
          </div>
          <div className="skill-card">
            <div className="skill-icon" style={{ fontSize: '3rem', marginBottom: '1rem' }}>📱</div>
            <h3>Responsive Design</h3>
            <p>Mobile-first approach, Cross-browser</p>
          </div>
        </div>
      </section>

      {/* Projects */}
      <section className="container featured-section">
        <h2 style={{ textAlign: 'center', marginBottom: '3rem' }}>My Projects</h2>
        <div className="grid">
          {displayedProjects.map(project => (
            <div key={project.id} className="card">
              {project.featured_image && (
                <img src={project.featured_image} alt={project.title} className="card-image" />
              )}
              <div className="card-content">
                <h3 className="card-title">{project.title}</h3>
                <p className="card-description">
                  {project.description && project.description.substring(0, 100)}
                  {project.description && project.description.length > 100 ? '...' : ''}
                </p>
                {project.technologies && (
                  <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {project.technologies.map((tech, idx) => (
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
                        {tech}
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

        {/* Pagination */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem', alignItems: 'center' }}>
          <button 
            onClick={handlePrevPage} 
            disabled={currentPage === 1}
            className="btn btn-secondary"
            style={{ opacity: currentPage === 1 ? 0.5 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
          >
            ← Previous
          </button>
          <span style={{ fontSize: '1rem', fontWeight: 'bold' }}>
            Page {currentPage} of {totalPages}
          </span>
          <button 
            onClick={handleNextPage} 
            disabled={currentPage === totalPages}
            className="btn btn-secondary"
            style={{ opacity: currentPage === totalPages ? 0.5 : 1, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
          >
            Next →
          </button>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container cta-section">
        <div style={{
          background: 'linear-gradient(135deg, var(--card-bg), #2d3748)',
          padding: '3rem',
          borderRadius: '10px',
          textAlign: 'center',
          border: '1px solid var(--border-color)'
        }}>
          <h2 style={{ marginBottom: '1rem' }}>Let's Work Together</h2>
          <p style={{ marginBottom: '2rem', fontSize: '1.1rem' }}>
            Have a project in mind? Let's collaborate and create something amazing.
          </p>
          <Link to="/contact" className="btn btn-primary" style={{ fontSize: '1.1rem' }}>
            Start a Project
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;