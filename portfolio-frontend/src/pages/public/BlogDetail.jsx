import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBlog } from '../../api/blogs';
import Icon from '../../components/Icon';
import ContentImage from '../../components/ContentImage';
import './content-pages.css';

const BlogDetail = () => {
  const { slug } = useParams();
  const [result, setResult] = useState({ slug: null, blog: null, status: 'loading' });

  useEffect(() => {
    let active = true;
    getBlog(slug).then(({ data }) => {
      const record = data?.data ?? data;
      const blog = record?.title && record?.slug === slug ? record : null;
      if (active) setResult({ slug, blog, status: blog ? 'ready' : 'missing' });
    }).catch(error => {
      if (active) setResult({ slug, blog: null, status: error.response?.status === 404 ? 'missing' : 'unavailable' });
    });
    return () => { active = false; };
  }, [slug]);

  const blog = result.slug === slug ? result.blog : null;
  const status = result.slug === slug ? result.status : 'loading';
  if (status === 'loading') return <div className="container page-shell content-page"><p className="content-status muted" role="status">Loading article…</p></div>;

  if (!blog) return (
    <div className="container page-shell content-page"><div className="content-empty"><Icon name="book" /><span className="eyebrow">The networking journal</span><h1 className="section-heading">{status === 'unavailable' ? 'Article unavailable.' : 'Article not found.'}</h1><p className="muted">{status === 'unavailable' ? 'The journal service is currently unavailable. Please try again later.' : 'There is no published article at this address.'}</p><Link to="/blogs" className="btn btn-primary"><Icon name="arrow-left" /> Back to the journal</Link></div></div>
  );

  const date = new Date(blog.published_at || blog.created_at);
  return (
    <article className="container page-shell content-page content-journal-detail">
      <Link to="/blogs" className="text-link content-back-link"><Icon name="arrow-left" /> Back to the journal</Link>
      <header className="content-page-header content-detail-header"><span className="eyebrow">Networking journal</span><h1 className="page-heading">{blog.title}</h1>{!Number.isNaN(date.getTime()) && <p className="muted"><time dateTime={date.toISOString()}>{date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time></p>}</header>
      <ContentImage className="content-detail-image" src={blog.featured_image} resetKey={slug} alt={blog.title} />
      <div className="content-article-body" dangerouslySetInnerHTML={{ __html: blog.content || '' }} />
      <div className="content-bottom-callout"><div><span className="eyebrow">Keep reading</span><h2>More from the journal.</h2></div><Link to="/blogs" className="btn btn-secondary">All articles <Icon name="arrow-right" /></Link></div>
    </article>
  );
};

export default BlogDetail;
