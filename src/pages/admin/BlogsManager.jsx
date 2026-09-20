import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getBlogs, getBlog, createBlog, updateBlog, deleteBlog } from '../../api/blogs';

const BlogsManager = ({ mode }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        status: 'draft',
        published_at: '',
        meta_description: '',
        featured_image: null,
    });
    const [saving, setSaving] = useState(false);

    const isListMode = !mode || mode === 'list';
    const isCreateMode = mode === 'create';
    const isEditMode = mode === 'edit';

    useEffect(() => {
        if (isListMode) {
            fetchBlogs();
        } else if (isEditMode && id) {
            fetchBlog(id);
        }
    }, [mode, id]);

    const fetchBlogs = async () => {
        try {
            const { data } = await getBlogs({ all: true });
            setBlogs(data.data);
        } catch (error) {
            console.error('Failed to load blogs', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchBlog = async (blogId) => {
        try {
            const { data } = await getBlog(blogId);
            const blog = data.data;
            setFormData({
                title: blog.title || '',
                content: blog.content || '',
                status: blog.status || 'draft',
                published_at: blog.published_at ? blog.published_at.slice(0, 16) : '',
                meta_description: blog.meta_description || '',
                featured_image: null,
            });
        } catch (error) {
            console.error('Failed to load blog', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (files) {
            setFormData({ ...formData, [name]: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        const data = new FormData();
        data.append('title', formData.title);
        data.append('content', formData.content);
        data.append('status', formData.status);
        data.append('published_at', formData.published_at || '');
        data.append('meta_description', formData.meta_description);
        if (formData.featured_image) {
            data.append('featured_image', formData.featured_image);
        }

        try {
            if (isEditMode && id) {
                await updateBlog(id, data);
                alert('Blog updated');
            } else {
                await createBlog(data);
                alert('Blog created');
            }
            navigate('/admin/blogs');
        } catch (error) {
            alert('Save failed');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (blogId) => {
        if (window.confirm('Are you sure?')) {
            try {
                await deleteBlog(blogId);
                fetchBlogs();
            } catch (error) {
                alert('Delete failed');
            }
        }
    };

    if (loading) return <div>Loading...</div>;

    // List view
    if (isListMode) {
        return (
            <div className="container" style={{ maxWidth: '1000px', margin: '0 auto', paddingTop: '2rem', paddingBottom: '2rem' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ margin: 0 }}>Manage Blogs</h1>
                    <Link to="/admin" className="btn btn-secondary">← Back to Dashboard</Link>
                </div>

                {/* Add New Button */}
                <Link to="/admin/blogs/create" className="btn btn-primary" style={{ marginBottom: '2rem', display: 'inline-block' }}>
                    + Add New Blog
                </Link>

                {/* Blogs Table */}
                <div style={{
                    overflowX: 'auto',
                    background: 'var(--card-bg)',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)'
                }}>
                    <table style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        minWidth: '600px'
                    }}>
                        <thead>
                            <tr style={{
                                borderBottom: '2px solid var(--border-color)',
                                backgroundColor: 'var(--primary-color)',
                                color: 'white'
                            }}>
                                <th style={{ padding: '1rem', textAlign: 'left', width: '50%' }}>Title</th>
                                <th style={{ padding: '1rem', textAlign: 'center', width: '20%' }}>Status</th>
                                <th style={{ padding: '1rem', textAlign: 'center', width: '30%' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {blogs.map(b => (
                                <tr key={b.id} style={{
                                    borderBottom: '1px solid var(--border-color)',
                                    transition: 'background-color 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--hover-bg, rgba(0,0,0,0.02)'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ''}
                                >
                                    <td style={{ padding: '1rem' }}>{b.title}</td>
                                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                                        <span style={{
                                            display: 'inline-block',
                                            padding: '0.3rem 0.8rem',
                                            borderRadius: '20px',
                                            backgroundColor: b.status === 'published' ? 'rgba(76, 175, 80, 0.2)' : 'rgba(255, 193, 7, 0.2)',
                                            color: b.status === 'published' ? '#4caf50' : '#ff9800',
                                            fontSize: '0.85rem',
                                            fontWeight: 'bold',
                                            textTransform: 'capitalize'
                                        }}>
                                            {b.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                                        <Link 
                                            to={`/admin/blogs/edit/${b.id}`}
                                            style={{
                                                display: 'inline-block',
                                                marginRight: '0.5rem',
                                                padding: '0.5rem 1rem',
                                                backgroundColor: 'var(--primary-color)',
                                                color: 'white',
                                                borderRadius: '4px',
                                                textDecoration: 'none',
                                                fontSize: '0.9rem',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            Edit
                                        </Link>
                                        <button 
                                            onClick={() => handleDelete(b.id)}
                                            style={{
                                                display: 'inline-block',
                                                padding: '0.5rem 1rem',
                                                backgroundColor: '#ff6b6b',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '4px',
                                                fontSize: '0.9rem',
                                                cursor: 'pointer',
                                                transition: 'background-color 0.2s'
                                            }}
                                            onMouseEnter={(e) => e.target.style.backgroundColor = '#ff5252'}
                                            onMouseLeave={(e) => e.target.style.backgroundColor = '#ff6b6b'}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {blogs.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                        <p>No blogs yet. <Link to="/admin/blogs/create">Create one</Link></p>
                    </div>
                )}
            </div>
        );
    }

    // Create/Edit form
    return (
        <div className="container" style={{ maxWidth: '900px', margin: '0 auto', paddingTop: '2rem', paddingBottom: '2rem' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ margin: 0 }}>{isEditMode ? 'Edit Blog' : 'Create Blog'}</h1>
                <Link to="/admin/blogs" className="btn btn-secondary">← Back</Link>
            </div>

            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div style={{ 
                    display: 'grid', 
                    gap: '2rem',
                    background: 'var(--card-bg)',
                    padding: '2rem',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)'
                }}>
                    <div>
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Title</label>
                        <input type="text" name="title" value={formData.title} onChange={handleChange} required 
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: '1px solid var(--border-color)',
                                borderRadius: '4px',
                                fontSize: '1rem'
                            }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Content</label>
                        <textarea name="content" value={formData.content} onChange={handleChange} required rows="10"
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: '1px solid var(--border-color)',
                                borderRadius: '4px',
                                fontSize: '1rem',
                                fontFamily: 'inherit'
                            }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Status</label>
                        <select name="status" value={formData.status} onChange={handleChange}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: '1px solid var(--border-color)',
                                borderRadius: '4px',
                                fontSize: '1rem'
                            }}
                        >
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                        </select>
                    </div>
                    <div>
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Published At</label>
                        <input type="datetime-local" name="published_at" value={formData.published_at} onChange={handleChange}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: '1px solid var(--border-color)',
                                borderRadius: '4px',
                                fontSize: '1rem'
                            }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Meta Description</label>
                        <input type="text" name="meta_description" value={formData.meta_description} onChange={handleChange}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: '1px solid var(--border-color)',
                                borderRadius: '4px',
                                fontSize: '1rem'
                            }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Featured Image</label>
                        <input type="file" name="featured_image" accept="image/*" onChange={handleChange}
                            style={{
                                display: 'block',
                                marginBottom: '1rem'
                            }}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button type="submit" disabled={saving} className="btn btn-primary"
                            style={{
                                padding: '0.75rem 2rem',
                                fontSize: '1rem',
                                cursor: saving ? 'not-allowed' : 'pointer',
                                opacity: saving ? 0.6 : 1
                            }}
                        >
                            {saving ? 'Saving...' : 'Save'}
                        </button>
                        <button type="button" onClick={() => navigate('/admin/blogs')} className="btn btn-secondary"
                            style={{
                                padding: '0.75rem 2rem',
                                fontSize: '1rem'
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default BlogsManager;