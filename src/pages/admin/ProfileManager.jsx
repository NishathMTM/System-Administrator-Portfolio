import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getProfile, updateProfile } from '../../api/profile';
import { useAuth } from '../../context/AuthContext';

const ProfileManager = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [profile, setProfile] = useState(null);
    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        full_name: '',
        title: '',
        bio: '',
        github_url: '',
        linkedin_url: '',
        twitter_url: '',
        profile_image: null,
        resume_file: null,
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const { data } = await getProfile();
            setProfile(data.data);
            setFormData({
                full_name: data.data.full_name || '',
                title: data.data.title || '',
                bio: data.data.bio || '',
                github_url: data.data.github_url || '',
                linkedin_url: data.data.linkedin_url || '',
                twitter_url: data.data.twitter_url || '',
                profile_image: null,
                resume_file: null,
            });
        } catch (error) {
            console.error('Failed to load profile', error);
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
        Object.keys(formData).forEach(key => {
            if (formData[key] !== null) {
                data.append(key, formData[key]);
            }
        });
        try {
            await updateProfile(data);
            alert('Profile updated successfully');
            fetchProfile(); // refresh
        } catch (error) {
            alert('Update failed');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="container" style={{paddingTop: '2rem'}}>Loading profile...</div>;

    return (
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto', paddingTop: '2rem', paddingBottom: '2rem' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ margin: 0 }}>Manage Profile</h1>
                <Link to="/admin" className="btn btn-secondary">← Back to Dashboard</Link>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div style={{ 
                    display: 'grid', 
                    gap: '2rem',
                    background: 'var(--card-bg)',
                    padding: '2rem',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)'
                }}>
                    {/* Full Name */}
                    <div>
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Full Name</label>
                        <input 
                            type="text" 
                            name="full_name" 
                            value={formData.full_name} 
                            onChange={handleChange} 
                            required
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: '1px solid var(--border-color)',
                                borderRadius: '4px',
                                fontSize: '1rem'
                            }}
                        />
                    </div>

                    {/* Title */}
                    <div>
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Title (e.g., Web Developer)</label>
                        <input 
                            type="text" 
                            name="title" 
                            value={formData.title} 
                            onChange={handleChange}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: '1px solid var(--border-color)',
                                borderRadius: '4px',
                                fontSize: '1rem'
                            }}
                        />
                    </div>

                    {/* Bio */}
                    <div>
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Bio</label>
                        <textarea 
                            name="bio" 
                            value={formData.bio} 
                            onChange={handleChange} 
                            rows="5"
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

                    {/* Profile Image */}
                    <div>
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Profile Image</label>
                        <input 
                            type="file" 
                            name="profile_image" 
                            accept="image/*" 
                            onChange={handleChange}
                            style={{
                                display: 'block',
                                marginBottom: '1rem'
                            }}
                        />
                        {profile?.profile_image && (
                            <div>
                                <img src={profile.profile_image} alt="Current" width="100" style={{ borderRadius: '4px' }} />
                            </div>
                        )}
                    </div>

                    {/* Resume File */}
                    <div>
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Resume File (PDF)</label>
                        <input 
                            type="file" 
                            name="resume_file" 
                            accept=".pdf,.doc,.docx" 
                            onChange={handleChange}
                            style={{
                                display: 'block',
                                marginBottom: '1rem'
                            }}
                        />
                        {profile?.resume_file && (
                            <div>
                                <a href={profile.resume_file} target="_blank" rel="noopener noreferrer">View Current Resume</a>
                            </div>
                        )}
                    </div>

                    {/* Social URLs */}
                    <div>
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>GitHub URL</label>
                        <input 
                            type="url" 
                            name="github_url" 
                            value={formData.github_url} 
                            onChange={handleChange}
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
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>LinkedIn URL</label>
                        <input 
                            type="url" 
                            name="linkedin_url" 
                            value={formData.linkedin_url} 
                            onChange={handleChange}
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
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Twitter URL</label>
                        <input 
                            type="url" 
                            name="twitter_url" 
                            value={formData.twitter_url} 
                            onChange={handleChange}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: '1px solid var(--border-color)',
                                borderRadius: '4px',
                                fontSize: '1rem'
                            }}
                        />
                    </div>

                    {/* Buttons */}
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button 
                            type="submit" 
                            disabled={saving}
                            className="btn btn-primary"
                            style={{
                                padding: '0.75rem 2rem',
                                fontSize: '1rem',
                                cursor: saving ? 'not-allowed' : 'pointer',
                                opacity: saving ? 0.6 : 1
                            }}
                        >
                            {saving ? 'Saving...' : 'Update Profile'}
                        </button>
                        <button 
                            type="button" 
                            onClick={handleLogout}
                            className="btn btn-secondary"
                            style={{
                                padding: '0.75rem 2rem',
                                fontSize: '1rem',
                                cursor: 'pointer'
                            }}
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default ProfileManager;