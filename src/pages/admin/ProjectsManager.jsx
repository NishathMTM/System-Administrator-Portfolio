import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getProjects, getProject, createProject, updateProject, deleteProject } from '../../api/projects';

const ProjectsManager = ({ mode }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        github_link: '',
        live_link: '',
        technologies: '',
        is_featured: false,
        featured_image: null,
    });
    const [saving, setSaving] = useState(false);

    // If mode is 'list' (default) or no mode, show list
    const isListMode = !mode || mode === 'list';
    const isCreateMode = mode === 'create';
    const isEditMode = mode === 'edit';

    useEffect(() => {
        if (isListMode) {
            fetchProjects();
        } else if (isEditMode && id) {
            fetchProject(id);
        }
    }, [mode, id]);

    const fetchProjects = async () => {
        try {
            const { data } = await getProjects({ all: true });
            setProjects(data.data);
        } catch (error) {
            console.error('Failed to load projects', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchProject = async (projectId) => {
        try {
            const { data } = await getProject(projectId);
            const project = data.data;
            setFormData({
                title: project.title || '',
                description: project.description || '',
                github_link: project.github_link || '',
                live_link: project.live_link || '',
                technologies: project.technologies ? project.technologies.join(', ') : '',
                is_featured: project.is_featured || false,
                featured_image: null,
            });
        } catch (error) {
            console.error('Failed to load project', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        if (type === 'checkbox') {
            setFormData({ ...formData, [name]: checked });
        } else if (files) {
            setFormData({ ...formData, [name]: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        const data = new FormData();
        // Convert technologies string back to array
        const techArray = formData.technologies.split(',').map(t => t.trim()).filter(t => t);
        // Append each technology as a separate field
        techArray.forEach(tech => {
            data.append('technologies[]', tech);
        });
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('github_link', formData.github_link);
        data.append('live_link', formData.live_link);
        data.append('is_featured', formData.is_featured ? '1' : '0');
        if (formData.featured_image) {
            data.append('featured_image', formData.featured_image);
        }

        try {
            if (isEditMode && id) {
                await updateProject(id, data);
                alert('Project updated');
            } else {
                await createProject(data);
                alert('Project created');
            }
            navigate('/admin/projects');
        } catch (error) {
            console.error('project save error', error);
            const msg = error?.response?.data?.message || error.message || 'Save failed';
            alert(msg);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (projectId) => {
        if (window.confirm('Are you sure?')) {
            try {
                await deleteProject(projectId);
                fetchProjects();
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
                    <h1 style={{ margin: 0 }}>Manage Projects</h1>
                    <Link to="/admin" className="btn btn-secondary">← Back to Dashboard</Link>
                </div>

                {/* Add New Button */}
                <Link to="/admin/projects/create" className="btn btn-primary" style={{ marginBottom: '2rem', display: 'inline-block' }}>
                    + Add New Project
                </Link>

                {/* Projects Table */}
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
                                <th style={{ padding: '1rem', textAlign: 'left' }}>Title</th>
                                <th style={{ padding: '1rem', textAlign: 'center' }}>Featured</th>
                                <th style={{ padding: '1rem', textAlign: 'center' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {projects.map(p => (
                                <tr key={p.id} style={{
                                    borderBottom: '1px solid var(--border-color)',
                                    transition: 'background-color 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--hover-bg, rgba(0,0,0,0.02)'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ''}
                                >
                                    <td style={{ padding: '1rem' }}>{p.title}</td>
                                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                                        <span style={{
                                            display: 'inline-block',
                                            padding: '0.3rem 0.8rem',
                                            borderRadius: '20px',
                                            backgroundColor: p.is_featured ? 'rgba(76, 175, 80, 0.2)' : 'rgba(200, 200, 200, 0.2)',
                                            color: p.is_featured ? '#4caf50' : '#666',
                                            fontSize: '0.85rem',
                                            fontWeight: 'bold'
                                        }}>
                                            {p.is_featured ? 'Yes' : 'No'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                                        <Link 
                                            to={`/admin/projects/edit/${p.id}`}
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
                                            onClick={() => handleDelete(p.id)}
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

                {projects.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                        <p>No projects yet. <Link to="/admin/projects/create">Create one</Link></p>
                    </div>
                )}
            </div>
        );
    }

    // Create/Edit form
    return (
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto', paddingTop: '2rem', paddingBottom: '2rem' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ margin: 0 }}>{isEditMode ? 'Edit Project' : 'Create Project'}</h1>
                <Link to="/admin/projects" className="btn btn-secondary">← Back</Link>
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
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Description</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} required rows="5"
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
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>GitHub Link</label>
                        <input type="url" name="github_link" value={formData.github_link} onChange={handleChange}
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
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Live Link</label>
                        <input type="url" name="live_link" value={formData.live_link} onChange={handleChange}
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
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Technologies (comma separated)</label>
                        <input type="text" name="technologies" value={formData.technologies} onChange={handleChange}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: '1px solid var(--border-color)',
                                borderRadius: '4px',
                                fontSize: '1rem'
                            }}
                        />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input type="checkbox" name="is_featured" checked={formData.is_featured} onChange={handleChange} id="featured" />
                        <label htmlFor="featured" style={{ fontWeight: 'bold', margin: 0, cursor: 'pointer' }}>
                            Featured Project
                        </label>
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
                        <button type="button" onClick={() => navigate('/admin/projects')} className="btn btn-secondary"
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

export default ProjectsManager;