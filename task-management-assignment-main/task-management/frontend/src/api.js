import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || (import.meta.env.DEV
    ? 'http://localhost:5000/api'
    : 'https://task-management-assignment-l22g.onrender.com/api'),
  timeout: 10000
});
api.interceptors.response.use(response => response, error => {
  const message = error.response?.data?.message || (error.code === 'ECONNABORTED' ? 'Request timed out' : 'Unable to connect to the server');
  return Promise.reject(new Error(message));
});
export const getTasks = params => api.get('/tasks', { params }).then(r => r.data);
export const getDashboard = () => api.get('/tasks/dashboard').then(r => r.data.data);
export const getUsers = () => api.get('/users').then(r => r.data.data);
export const createTask = payload => api.post('/tasks', payload).then(r => r.data.data);
export const updateTask = (id, payload) => api.put(`/tasks/${id}`, payload).then(r => r.data.data);
export const deleteTask = id => api.delete(`/tasks/${id}`).then(r => r.data);
