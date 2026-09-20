import axios from './axios';

// NOTE: this app is using Bearer tokens stored in localStorage instead of
// the cookie‑based SPA flow. the backend should return a token on login.

export const login = async (credentials) => {
    const response = await axios.post('/login', credentials);
    // assume backend returns { token: '...', user: {...} } or similar
    if (response.data && response.data.token) {
        localStorage.setItem('admin_token', response.data.token);
    }
    return response;
};

export const logout = () => {
    // remove token locally; you may also hit a logout route that revokes it
    localStorage.removeItem('admin_token');
    return axios.post('/logout');
};

export const fetchUser = () => axios.get('/user');