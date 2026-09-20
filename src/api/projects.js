import axios from './axios';

export const getProjects = (params) => axios.get('/projects', { params });
export const getProject = (slug) => axios.get(`/projects/${slug}`);
export const createProject = (data) => axios.post('/projects', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
});
export const updateProject = (id, data) => axios.post(`/projects/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
});
export const deleteProject = (id) => axios.delete(`/projects/${id}`);