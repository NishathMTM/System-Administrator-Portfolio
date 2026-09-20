import axios from './axios';

export const getProjects = (params) => axios.get('/projects', { params });
export const getProject = (slug) => axios.get(`/projects/${slug}`);
export const getAdminProjects = (params) => axios.get('/admin/projects', { params });
export const getAdminProject = (id) => axios.get(`/admin/projects/${id}`);
export const createProject = (data) => axios.post('/projects', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
});
export const updateProject = (id, data) => {
    data.append('_method', 'PUT');
    return axios.post(`/projects/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
};
export const deleteProject = (id) => axios.delete(`/projects/${id}`);
