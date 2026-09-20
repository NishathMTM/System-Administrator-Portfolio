import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBlog } from '../../api/blogs';

const BlogDetail = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sample blog for fallback
  const sampleBlog = {
    title: 'Getting Started with React Hooks',
    slug: 'react-hooks-guide',
    content: '<p>React Hooks have revolutionized the way we write React components. They allow you to use state and other React features without writing a class component.</p>' +
             '<h3>Why Hooks?</h3>' +
             '<p>Before hooks, managing state in functional components was impossible. With hooks like useState and useEffect, functional components are now as powerful as class components.</p>' +
             '<h3>Common Hooks</h3>' +
             '<ul><li><strong>useState:</strong> Add state to functional components</li>' +
             '<li><strong>useEffect:</strong> Handle side effects</li>' +
             '<li><strong>useContext:</strong> Use context values</li>' +
             '<li><strong>useReducer:</strong> Complex state logic</li></ul>' +
             '<p>Start using hooks today to write cleaner, more reusable code!</p>',
    featured_image: 'https://via.placeholder.com/800x400?text=React+Hooks',
    created_at: '2024-01-15'
  };

  useEffect(() => {
    const loadBlog = async () => {
      try {
        setLoading(true);
        const res = await getBlog(slug);
        setBlog(res.data.data || res.data);
        setError(null);
      } catch (err) {
        console.error(err);
        setBlog(sampleBlog);
        setError(null);
      } finally {
        setLoading(false);
      }
    };

    loadBlog();
  }, [slug]);

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center' }}>
        <div className="spinner" style={{ margin: '3rem auto' }}></div>
        <p>Loading article...</p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="container">
        <h1>Article Not Found</h1>
        <p>Sorry, the article you're looking for doesn't exist.</p>
        <Link to="/blogs" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="container">
      <Link to="/blogs" style={{ color: 'var(--primary-color)', marginBottom: '1rem', display: 'inline-block' }}>
        ← Back to Blog
      </Link>

      <h1 style={{ marginTop: '1rem' }}>{blog.title}</h1>

      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        Published on {new Date(blog.created_at || blog.published_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}
      </p>

      {blog.featured_image && (
        <img
          src={blog.featured_image}
          alt={blog.title}
          style={{
            width: '100%',
            maxHeight: '500px',
            objectFit: 'cover',
            borderRadius: '8px',
            marginBottom: '2rem'
          }}
        />
      )}

      <div
        className="blog-content"
        style={{
          fontSize: '1.05rem',
          lineHeight: '1.8',
          color: 'var(--text-secondary)',
          marginBottom: '2rem'
        }}
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />

      <div style={{ background: 'linear-gradient(135deg, var(--card-bg), #2d3748)', padding: '2rem', borderRadius: '8px', marginTop: '3rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>More Articles</h2>
        <Link to="/blogs" className="btn btn-primary">
          Read More Articles
        </Link>
      </div>
    </div>
  );
};

export default BlogDetail;