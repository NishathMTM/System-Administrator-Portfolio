import { useState } from 'react';
import { submitContact } from '../../api/contacts';
import { usePortfolio } from '../../context/portfolioContext';
import Icon from '../../components/Icon';

const emptyForm = { name: '', email: '', subject: '', message: '' };

export default function Contact() {
  const profile = usePortfolio();
  const [form, setForm] = useState(emptyForm);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const handleChange = ({ target }) => {
    setForm(previous => ({ ...previous, [target.name]: target.value }));
    setError('');
  };
  const handleSubmit = async event => {
    event.preventDefault();
    if (status === 'sending') return;
    if (Object.values(form).some(value => !value.trim())) {
      setError('Please fill in every field before sending your message.');
      return;
    }
    setStatus('sending');
    setError('');
    try {
      await submitContact(Object.fromEntries(Object.entries(form).map(([key, value]) => [key, value.trim()])));
      setStatus('sent');
      setForm(emptyForm);
    } catch (err) {
      const validation = err.response?.data?.errors;
      setError(validation ? Object.values(validation).flat().join(' ') : 'Your message couldn’t be sent. Please try again in a moment. Your draft is still here.');
      setStatus('idle');
    }
  };

  return <div className="container page-shell contact-page"><p className="eyebrow">LET’S MAKE A CONNECTION</p><h1 className="page-heading">Good things start<br/><span className="accent-text">with a conversation.</span></h1><div className="contact-layout"><div className="contact-copy"><p>Have an opportunity, a networking or IT support project, or a question? Send a message and let’s see where the conversation leads.</p><div className="contact-person"><span className="focus-icon"><Icon name="network" size={27}/></span><div><h2>{profile.full_name}</h2><p>{profile.title}</p></div></div><div className="contact-topics"><span className="mono">A FEW THINGS WE CAN TALK ABOUT</span><p><Icon name="arrow-up-right" size={17}/> Networking & IT support</p><p><Icon name="arrow-up-right" size={17}/> Professional opportunities</p><p><Icon name="arrow-up-right" size={17}/> Projects & collaboration</p></div>{profile.linkedin_url && <a className="text-link" href={profile.linkedin_url} target="_blank" rel="noreferrer"><Icon name="linkedin"/> Find me on LinkedIn <Icon name="arrow-up-right" size={17}/></a>}<div className="contact-decoration" aria-hidden="true"><span/><Icon name="mail" size={29}/><span/><Icon name="network" size={29}/><span/></div></div>
    <div className="contact-form-panel">{status === 'sent' ? <div className="contact-success" role="status"><span className="success-icon"><Icon name="check" size={32}/></span><p className="eyebrow">CONNECTION MADE</p><h2>Message received.</h2><p>Thank you for reaching out. Your message has been sent successfully.</p><button type="button" className="btn btn-secondary" onClick={() => setStatus('idle')}>Send another message <Icon name="arrow-right" size={17}/></button></div> : <form onSubmit={handleSubmit}><div className="form-heading"><h2>Send a message</h2><Icon name="arrow-up-right" size={24}/></div><p className="form-required">All fields are required.</p>{error && <div className="alert alert-error" role="alert">{error}</div>}<fieldset disabled={status === 'sending'}><div className="form-row"><div className="form-group"><label htmlFor="contact-name">Your name</label><input id="contact-name" name="name" autoComplete="name" placeholder="Your full name" maxLength={255} value={form.name} onChange={handleChange} required/></div><div className="form-group"><label htmlFor="contact-email">Email address</label><input id="contact-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" maxLength={255} value={form.email} onChange={handleChange} required/></div></div><div className="form-group"><label htmlFor="contact-subject">What’s on your mind?</label><input id="contact-subject" name="subject" placeholder="An opportunity, a project, or just hello" maxLength={255} value={form.subject} onChange={handleChange} required/></div><div className="form-group"><label htmlFor="contact-message">Your message</label><textarea id="contact-message" name="message" placeholder="Tell me a little more…" rows={5} maxLength={10000} value={form.message} onChange={handleChange} required/></div><button type="submit" className="btn btn-primary contact-submit">{status === 'sending' ? 'Sending your message…' : 'Send message'}<Icon name="arrow-up-right" size={19}/></button></fieldset></form>}</div></div></div>;
}
