import axios from './axios';

export const getProfile = () => axios.get('/profile', { timeout: 6000 });
export const updateProfile = (data) => axios.post('/profile', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
});
