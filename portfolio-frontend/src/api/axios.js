import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:8000/api' : '/api'),
    timeout: 12000,
    // no cookies by default – we will attach Authorization header instead
});

// attach token from localStorage to every request
axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('admin_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

axiosInstance.interceptors.response.use(response => response, error => {
    if (error.response?.status === 401 && localStorage.getItem('admin_token')) {
        window.dispatchEvent(new Event('auth:expired'));
    }
    return Promise.reject(error);
});

export default axiosInstance;
