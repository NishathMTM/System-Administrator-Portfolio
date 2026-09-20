import { useState } from 'react';
import { submitContact } from '../../api/contacts';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await submitContact(formData);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setError('Failed to send message. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="container">
        <h1>Thank You!</h1>
        <div className="alert alert-success" style={{ marginTop: '2rem' }}>
          <h2 style={{ marginBottom: '1rem', color: 'var(--success-color)' }}>Message Sent Successfully</h2>
          <p>Thank you for reaching out. I'll review your message and get back to you as soon as possible.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Get In Touch</h1>
      <p style={{ fontSize: '1.1rem', marginBottom: '2rem', maxWidth: '600px' }}>
        Have a question or a project in mind? I'd love to hear from you. Fill out the form below
        and I'll get back to you within 24 hours.
      </p>

      <div style={{ maxWidth: '600px' }}>
        {error && (
          <div className="alert alert-error" style={{ marginBottom: '2rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Your Name *</label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="subject">Subject *</label>
            <input
              id="subject"
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="What's this about?"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="message">Message *</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Tell me more about your inquiry..."
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', fontSize: '1rem' }}
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>

      {/* Contact Information */}
      <div style={{ marginTop: '4rem', maxWidth: '600px' }}>
        <h2>Other Ways to Connect</h2>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
          <div style={{ padding: '1.5rem', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
            <h3 style={{ color: 'var(--primary-color)', marginBottom: '0.5rem' }}>📧 Email</h3>
            <a href="mailto:hello@portfolio.com" style={{ color: 'var(--secondary-color)', textDecoration: 'none' }}>
              hello@portfolio.com
            </a>
          </div>
          <div style={{ padding: '1.5rem', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
            <h3 style={{ color: 'var(--primary-color)', marginBottom: '0.5rem' }}>💼 LinkedIn</h3>
            <a href="#" style={{ color: 'var(--secondary-color)', textDecoration: 'none' }}>
              linkedin.com/in/yourprofile
            </a>
          </div>
          <div style={{ padding: '1.5rem', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
            <h3 style={{ color: 'var(--primary-color)', marginBottom: '0.5rem' }}>🐙 GitHub</h3>
            <a href="#" style={{ color: 'var(--secondary-color)', textDecoration: 'none' }}>
              github.com/yourprofile
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;