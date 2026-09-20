import axios from './axios';

export const submitContact = (data) => axios.post('/contact', data);
export const getContacts = (params) => axios.get('/contacts', { params });
export const markContactRead = (id) => axios.patch(`/contacts/${id}/read`);
export const deleteContact = (id) => axios.delete(`/contacts/${id}`);
