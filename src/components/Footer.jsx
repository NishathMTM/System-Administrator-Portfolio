const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>Portfolio</h3>
          <p>Showcasing my skills and projects</p>
        </div>
        
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#projects">Projects</a></li>
            <li><a href="#blog">Blog</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Connect</h3>
          <div className="social-links">
            <a href="#" aria-label="GitHub">GitHub</a>
            <a href="#" aria-label="LinkedIn">LinkedIn</a>
            <a href="#" aria-label="Twitter">Twitter</a>
          </div>
        </div>

        <div className="footer-section">
          <h3>Contact</h3>
          <p>Email: mnishath21@gmail.com</p>
          <p>Location: Srilanka</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {currentYear} My Portfolio. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
