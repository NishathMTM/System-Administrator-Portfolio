import React, { createContext, useState, useEffect, useContext } from 'react';
import { login as apiLogin, logout as apiLogout, fetchUser } from '../api/auth';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('admin_token');
            if (token) {
                try {
                    const { data } = await fetchUser();
                    setUser(data);
                } catch (err) {
                    console.error('failed to fetch user', err);
                    localStorage.removeItem('admin_token');
                }
            }
            setLoading(false);
        };
        initAuth();
    }, []);

    const login = async (credentials) => {
        await apiLogin(credentials); // stores token locally
        const { data } = await fetchUser();
        setUser(data);
    };

    const logout = async () => {
        try {
            await apiLogout();
        } catch (err) {
            // ignore errors, still clear token
            console.warn('logout api call failed', err);
        }
        // make sure token is removed and user cleared
        localStorage.removeItem('admin_token');
        setUser(null);
        // navigate to login page
        window.location.href = '/login';
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};