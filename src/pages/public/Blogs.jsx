import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getBlogs } from '../../api/blogs';

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sample blogs for when API is not available
  const sampleBlogs = [
    {
      id: 1,
      title: 'Getting Started with React Hooks',
      slug: 'react-hooks-guide',
      content: 'Learn the fundamentals of React Hooks and how to use them to manage state and side effects in your functional components. Hooks make it easier to reuse stateful logic across your application.',
      featured_image: 'https://via.placeholder.com/400x250?text=React+Hooks',
      created_at: '2024-01-15'
    },
    {
      id: 2,
      title: 'Building RESTful APIs with Node.js',
      slug: 'nodejs-rest-api',
      content: 'A comprehensive guide to building scalable and secure RESTful APIs using Node.js and Express. Learn best practices for routing, middleware, authentication, and error handling.',
      featured_image: 'https://via.placeholder.com/400x250?text=Node.js+API',
      created_at: '2024-01-20'
    },
    {
      id: 3,
      title: 'Database Optimization Tips',
      slug: 'database-optimization',
      content: 'Discover essential techniques for optimizing database performance including indexing, query optimization, and caching strategies to improve your application speed.',
      featured_image: 'https://via.placeholder.com/400x250?text=Database',
      created_at: '2024-01-25'
    },
    {
      id: 4,
      title: 'CSS Grid vs Flexbox',
      slug: 'css-grid-flexbox',
      content: 'Understand the differences between CSS Grid and Flexbox, when to use each one, and how to combine them for creating responsive and flexible layouts.',
      featured_image: 'https://via.placeholder.com/400x250?text=CSS+Layout',
      created_at: '2024-02-01'
    },
    {
      id: 5,
      title: 'Understanding Async/Await in JavaScript',
      slug: 'async-await-guide',
      content: 'Master async/await syntax, error handling with try/catch, and how to write clean asynchronous code that\'s easier to read and maintain.',
      featured_image: 'https://via.placeholder.com/400x250?text=Async+Await',
      created_at: '2024-02-05'
    },
    {
      id: 6,
      title: 'Web Performance Best Practices',
      slug: 'web-performance',
      content: 'Learn strategies to optimize your web application performance including code splitting, lazy loading, caching, and monitoring tools.',
      featured_image: 'https://via.placeholder.com/400x250?text=Performance',
      created_at: '2024-02-10'
    }
  ];

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        setLoading(true);
        const res = await getBlogs();
        setBlogs(res.data.data || res.data);
        setError(null);
      } catch (err) {
        console.error('Error loading blogs:', err);
        // Use sample blogs as fallback
        setBlogs(sampleBlogs);
        setError(null);
      } finally {
        setLoading(false);
      }
    };

    loadBlogs();
  }, []);

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center' }}>
        <h1>Blog</h1>
        <div className="spinner"></div>
        <p style={{ marginTop: '1rem' }}>Loading articles...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Blog Articles</h1>
      <p style={{ fontSize: '1.1rem', marginBottom: '2rem' }}>
        Insights, tutorials, and thoughts on web development, programming, and technology.
      </p>

      {error && (
        <div className="alert alert-error" style={{ marginBottom: '2rem' }}>
          {error}
        </div>
      )}

      {blogs.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>No blog posts found.</p>
        </div>
      ) : (
        <div className="grid">
          {blogs.map(blog => (
            <div key={blog.id} className="card">
              {blog.featured_image && (
                <img src={blog.featured_image} alt={blog.title} className="card-image" />
              )}
              <div className="card-content">
                <p style={{ color: 'var(--secondary-color)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                  {new Date(blog.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                <h3 className="card-title">{blog.title}</h3>
                <p className="card-description">
                  {blog.content && blog.content.substring(0, 150)}
                  {blog.content && blog.content.length > 150 ? '...' : ''}
                </p>
                <Link to={`/blogs/${blog.slug}`} className="card-link">
                  Read Article →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Blogs;