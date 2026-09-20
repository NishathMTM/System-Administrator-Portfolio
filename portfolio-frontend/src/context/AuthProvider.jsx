import { useState, useEffect } from 'react';
import { login as apiLogin, logout as apiLogout, fetchUser } from '../api/auth';
import { AuthContext } from './AuthContext';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const expireSession = () => {
            localStorage.removeItem('admin_token');
            setUser(null);
        };
        const syncSession = event => { if (event.key === 'admin_token' && !event.newValue) expireSession(); };
        window.addEventListener('auth:expired', expireSession);
        window.addEventListener('storage', syncSession);
        const initAuth = async () => {
            const token = localStorage.getItem('admin_token');
            if (token) {
                try {
                    const { data } = await fetchUser();
                    if (data.is_admin === true) setUser(data);
                    else expireSession();
                } catch (err) {
                    console.error('failed to fetch user', err);
                    localStorage.removeItem('admin_token');
                }
            }
            setLoading(false);
        };
        initAuth();
        return () => {
            window.removeEventListener('auth:expired', expireSession);
            window.removeEventListener('storage', syncSession);
        };
    }, []);

    const login = async (credentials) => {
        await apiLogin(credentials); // stores token locally
        const { data } = await fetchUser();
        if (data.is_admin !== true) {
            localStorage.removeItem('admin_token');
            throw new Error('An administrator account is required.');
        }
        setUser(data);
    };

    const logout = async () => {
        try { await apiLogout(); }
        catch { /* Local access is cleared even if the server is unreachable. */ }
        finally { setUser(null); }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
