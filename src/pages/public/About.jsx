const About = () => {
  return (
    <div className="container">
      <h1>About Me</h1>
      
      <div style={{ marginTop: '2rem', marginBottom: '2rem' }}>
        <p style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
          I'm a passionate full-stack developer with over 5 years of experience building modern web applications.
          I specialize in creating responsive, user-friendly interfaces and robust backend systems that scale.
        </p>
      </div>

      {/* Bio */}
      <section style={{ marginBottom: '3rem' }}>
        <h2>My Journey</h2>
        <p>
          Started as a frontend developer, I've expanded my skills to become a full-stack developer.
          My journey has taken me through various industries, from startups to enterprise-level companies,
          where I've learned the importance of clean code, scalability, and user experience.
        </p>
        <p>
          Currently, I'm focused on building products that make a real impact and helping businesses
          achieve their goals through technology.
        </p>
      </section>

      {/* Experience */}
      <section style={{ marginBottom: '3rem' }}>
        <h2>Experience</h2>
        <div className="experience-item" style={{ marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '1px solid var(--border-color)' }}>
          <h3 style={{ color: 'var(--primary-color)' }}>Senior Developer</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Tech Company Inc. | 2022 - Present</p>
          <p>Leading development of scalable web applications, mentoring junior developers, and architecting solutions for complex problems.</p>
        </div>

        <div className="experience-item" style={{ marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '1px solid var(--border-color)' }}>
          <h3 style={{ color: 'var(--primary-color)' }}>Full Stack Developer</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Web Solutions LLC | 2020 - 2022</p>
          <p>Developed and maintained multiple web applications using React, Node.js, and various databases.</p>
        </div>

        <div className="experience-item" style={{ marginBottom: '2rem' }}>
          <h3 style={{ color: 'var(--primary-color)' }}>Frontend Developer</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Digital Agency | 2019 - 2020</p>
          <p>Built responsive and interactive user interfaces for various client projects using React and Vue.js.</p>
        </div>
      </section>

      {/* Education */}
      <section style={{ marginBottom: '3rem' }}>
        <h2>Education</h2>
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ color: 'var(--primary-color)' }}>Bachelor of Science in Computer Science</h3>
          <p style={{ color: 'var(--text-secondary)' }}>University of Technology | 2019</p>
        </div>
      </section>

      {/* Technical Skills */}
      <section style={{ marginBottom: '3rem' }}>
        <h2>Technical Skills</h2>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
          <div className="skill-card">
            <h3 style={{ color: 'var(--primary-color)', marginBottom: '1rem' }}>Frontend</h3>
            <ul style={{ listStyle: 'none', color: 'var(--text-secondary)' }}>
              <li>✓ React & Vue.js</li>
              <li>✓ JavaScript/TypeScript</li>
              <li>✓ HTML5 & CSS3</li>
              <li>✓ Responsive Design</li>
              <li>✓ State Management</li>
            </ul>
          </div>

          <div className="skill-card">
            <h3 style={{ color: 'var(--primary-color)', marginBottom: '1rem' }}>Backend</h3>
            <ul style={{ listStyle: 'none', color: 'var(--text-secondary)' }}>
              <li>✓ Node.js & Express</li>
              <li>✓ PHP & Laravel</li>
              <li>✓ Python</li>
              <li>✓ RESTful APIs</li>
              <li>✓ Microservices</li>
            </ul>
          </div>

          <div className="skill-card">
            <h3 style={{ color: 'var(--primary-color)', marginBottom: '1rem' }}>Database & Tools</h3>
            <ul style={{ listStyle: 'none', color: 'var(--text-secondary)' }}>
              <li>✓ MySQL & PostgreSQL</li>
              <li>✓ MongoDB</li>
              <li>✓ Git & GitHub</li>
              <li>✓ Docker</li>
              <li>✓ CI/CD Pipelines</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Additional Info */}
      <section style={{
        background: 'linear-gradient(135deg, var(--card-bg), #2d3748)',
        padding: '2rem',
        borderRadius: '10px',
        border: '1px solid var(--border-color)'
      }}>
        <h2>Beyond Code</h2>
        <p>
          When I'm not coding, I enjoy contributing to open-source projects, writing technical blogs,
          and staying updated with the latest technologies. I'm a lifelong learner and enthusiast about
          solving complex problems with elegant solutions.
        </p>
      </section>
    </div>
  );
};

export default About;