import axios from 'axios';
import { RegisterFormInputs } from '../models/Register';
import { LoginForm } from '../models/Login';
import { Appointment } from '../models/Appointment';

const apiClient = axios.create({
  baseURL: 'http://localhost:5067/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('token'); 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log('Request Config:', config); // Log the request configuration
  return config;
}, error => {
  return Promise.reject(error);
});

apiClient.interceptors.response.use(response => {
  console.log('Response:', response); // Log the response from the API
  return response;
}, error => {
  console.error('Response Error:', error); // Log any response errors
  return Promise.reject(error);
});

const api = {
  register: (data: RegisterFormInputs) => apiClient.post('/auth/register', data).then(response => response.data),
  login: (data: LoginForm) => apiClient.post('/auth/login', data).then(response => response.data),
  getAppointments: () => apiClient.get('/appointments').then(response => Array.isArray(response.data) ? response.data : []),
  createAppointment: (data: Omit<Appointment, 'id' | 'status'>) => apiClient.post('/appointments', data).then(response => response.data),
  deleteAppointment: (id: string) => apiClient.delete(`/appointments/${id}`).then(response => response.data),
  cancelAppointment: (id: string) => apiClient.put(`/appointments/${id}/cancel`).then(response => response.data),
  getUserDetails: (userId: string) => apiClient.get(`/users/${userId}`).then(response => response.data),
};

export default api;
