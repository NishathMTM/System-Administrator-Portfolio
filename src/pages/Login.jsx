import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        
        try {
            await login({ email, password });
            navigate('/admin');
        } catch (err) {
            setError('Invalid email or password. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 200px)' }}>
            <div style={{ width: '100%', maxWidth: '400px' }}>
                <div style={{
                    background: 'linear-gradient(135deg, var(--card-bg), #2d3748)',
                    padding: '2.5rem',
                    borderRadius: '10px',
                    border: '1px solid var(--border-color)',
                    textAlign: 'center'
                }}>
                    <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Admin Portal</h1>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                        Sign in to manage your portfolio
                    </p>

                    {error && (
                        <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="email" style={{ textAlign: 'left' }}>Email Address</label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="admin@example.com"
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password" style={{ textAlign: 'left' }}>Password</label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                disabled={loading}
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ width: '100%', fontSize: '1rem' }}
                            disabled={loading}
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                            Not an admin?
                        </p>
                        <Link to="/" className="btn" style={{
                            display: 'inline-block',
                            padding: '0.5rem 1.5rem',
                            border: '1px solid var(--border-color)',
                            borderRadius: '5px',
                            color: 'var(--primary-color)',
                            textDecoration: 'none',
                            transition: 'all 0.3s ease'
                        }}>
                            Back to Home
                        </Link>
                    </div>
                </div>

                {/* Demo Credentials */}
                <div style={{
                    marginTop: '2rem',
                    padding: '1.5rem',
                    background: 'rgba(0, 102, 255, 0.1)',
                    border: '1px solid var(--primary-color)',
                    borderRadius: '8px',
                    color: 'var(--text-secondary)',
                    fontSize: '0.9rem'
                }}>
                    <p style={{ marginBottom: '0.5rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                        Demo Credentials (if available):
                    </p>
                    <p style={{ margin: '0.25rem 0' }}>📧 Email: admin@example.com</p>
                    <p style={{ margin: '0.25rem 0' }}>🔑 Password: password123</p>
                    <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        Check your backend configuration for actual credentials.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;