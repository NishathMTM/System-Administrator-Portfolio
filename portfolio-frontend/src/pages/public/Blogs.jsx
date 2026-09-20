import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getBlogs } from '../../api/blogs';
import Icon from '../../components/Icon';
import ContentImage from '../../components/ContentImage';
import './content-pages.css';

const topics = [
  { icon: 'route', title: 'Routing & switching', description: 'The paths, protocols, and decisions that keep networks connected.' },
  { icon: 'shield', title: 'Network security', description: 'Segmentation, access control, and thoughtful network design.' },
  { icon: 'headset', title: 'IT support & troubleshooting', description: 'Practical diagnostics, helpful communication, and everyday technical problem-solving.' },
];

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    let active = true;
    getBlogs().then(({ data }) => {
      const records = data?.data ?? data;
      if (!Array.isArray(records)) throw new Error('Invalid articles response');
      if (active) {
        setBlogs(records.filter(blog => blog?.title && blog?.slug));
        setStatus('ready');
      }
    }).catch(() => {
      if (active) setStatus('unavailable');
    });
    return () => { active = false; };
  }, []);

  return (
    <div className="container page-shell content-page">
      <header className="content-page-header"><span className="eyebrow">The networking journal</span><h1 className="page-heading">A connected <span className="content-accent">perspective.</span></h1><p className="content-intro muted">A space for networking notes, practical observations, and ideas worth sharing.</p></header>
      {status === 'loading' ? <p className="content-status muted" role="status">Loading journal articles…</p> : blogs.length > 0 ? (
        <div className="content-card-grid">
          {blogs.map(blog => {
            const date = new Date(blog.published_at || blog.created_at);
            const excerpt = (blog.excerpt || blog.content || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
            return <article className="content-card" key={blog.id ?? blog.slug}>
              <ContentImage className="content-card-image" src={blog.featured_image} resetKey={blog.slug} alt="" loading="lazy" fallback="journal" />
              <div className="content-card-body"><span className="eyebrow">{Number.isNaN(date.getTime()) ? 'Journal' : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span><h2>{blog.title}</h2><p className="muted">{excerpt.slice(0, 170)}{excerpt.length > 170 ? '…' : ''}</p><Link className="text-link" to={`/blogs/${blog.slug}`}>Read article <Icon name="arrow-up-right" /></Link></div>
            </article>;
          })}
        </div>
      ) : (
        <section className="content-empty content-journal-empty" aria-labelledby="journal-empty-title"><div className="content-empty-icon"><Icon name="book" /></div><span className="eyebrow">{status === 'unavailable' ? 'Connection paused' : 'A new chapter'}</span><h2 id="journal-empty-title" className="section-heading">{status === 'unavailable' ? 'The journal is temporarily unavailable.' : 'The first page is still ahead.'}</h2><p className="muted">{status === 'unavailable' ? 'Articles could not be loaded right now. Please check back later, or explore the networking lab blueprints.' : 'No articles have been published yet. In the meantime, explore the networking lab blueprints.'}</p><Link to="/projects" className="btn btn-secondary">Explore the labs <Icon name="arrow-up-right" /></Link></section>
      )}
      <section className="content-section content-topic-section" aria-labelledby="journal-topics"><div className="content-section-top"><div><span className="eyebrow">Areas of interest</span><h2 id="journal-topics" className="section-heading">Ideas at the intersection.</h2></div></div><div className="content-card-grid">{topics.map(topic => <div className="content-topic" key={topic.title}><Icon name={topic.icon} /><h3>{topic.title}</h3><p className="muted">{topic.description}</p></div>)}</div></section>
    </div>
  );
};

export default Blogs;
