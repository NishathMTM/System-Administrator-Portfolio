import axios from './axios';

export const getBlogs = (params) => axios.get('/blogs', { params });
export const getBlog = (slug) => axios.get(`/blogs/${slug}`);
export const getAdminBlogs = (params) => axios.get('/admin/blogs', { params });
export const getAdminBlog = (id) => axios.get(`/admin/blogs/${id}`);
export const createBlog = (data) => axios.post('/blogs', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
});
export const updateBlog = (id, data) => {
    data.set('_method', 'PUT');
    return axios.post(`/blogs/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
};
export const deleteBlog = (id) => axios.delete(`/blogs/${id}`);
