import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Dashboard = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const handleLogout = async () => {
        await logout();
        navigate('/login');
    }; 

    const adminOptions = [
        {
            id: 1,
            title: 'Manage Profile',
            description: 'Update your profile information',
            icon: '',
            link: '/admin/profile'
        },
        {
            id: 2,
            title: 'Manage Projects',
            description: 'Add, edit, or delete your projects',
            icon: '',
            link: '/admin/projects'
        },
        {
            id: 3,
            title: 'Manage Blogs',
            description: 'Create and manage your blog posts',
            icon: '',
            link: '/admin/blogs'
        },
        {
            id: 4,
            title: 'View Contacts',
            description: 'View messages from visitors',
            icon: '',
            link: '/admin/contacts'
        }
    ];

    return (
        <div className="container" style={{ minHeight: '100vh', paddingTop: '2rem', paddingBottom: '2rem' }}>
            {/* Welcome Section */}
            <section style={{ marginBottom: '3rem', textAlign: 'center' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Admin Dashboard</h1>
                <p style={{ fontSize: '1.3rem', color: 'var(--text-secondary)' }}>Welcome, {user?.name}! 👋</p>
            </section>

            {/* Admin Options Grid */}
            <section style={{ marginBottom: '3rem' }}>
                <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
                    {adminOptions.map(option => (
                        <Link 
                            key={option.id}
                            to={option.link}
                            style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                            <div 
                                className="card"
                                style={{
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-5px)';
                                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.2)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '';
                                }}
                            >
                                <div style={{ 
                                    fontSize: '3rem', 
                                    marginBottom: '1rem',
                                    textAlign: 'center'
                                }}>
                                    {option.icon}
                                </div>
                                <h3 style={{ marginBottom: '0.5rem', fontSize: '1.3rem' }}>
                                    {option.title}
                                </h3>
                                <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', flex: 1 }}>
                                    {option.description}
                                </p>
                                <span style={{ 
                                    color: 'var(--primary-color)', 
                                    fontWeight: 'bold',
                                    display: 'inline-block'
                                }}>
                                    Go to {option.title} →
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Logout Button */}
            <section style={{ textAlign: 'center' }}>
                <button 
                    onClick={handleLogout}
                    className="btn btn-secondary"
                    style={{
                        padding: '0.75rem 2rem',
                        fontSize: '1rem',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.background = 'var(--danger-color, #ff6b6b)';
                        e.target.style.borderColor = 'var(--danger-color, #ff6b6b)';
                        e.target.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.background = '';
                        e.target.style.borderColor = '';
                        e.target.style.color = '';
                    }}
                >
                    Logout
                </button>
            </section>
        </div>
    );
};

export default Dashboard;