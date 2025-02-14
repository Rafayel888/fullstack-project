import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

const apiMultipart = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

const attachAuthToken = (config: any) => {
  const accessToken = localStorage.getItem('token');
  if (accessToken) {
    config.headers['Authorization'] = `Bearer ${accessToken}`;
  }
  return config;
};

apiMultipart.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    config.headers['Content-Type'] = 'multipart/form-data';
  }
  return attachAuthToken(config);
});

api.interceptors.request.use(attachAuthToken);
apiMultipart.interceptors.request.use(attachAuthToken);

const handleResponseError = (error: any) => {
  if (error.response) {
    console.error('API Error:', error.response.data);
  }
  return Promise.reject(error);
};

api.interceptors.response.use((response) => response, handleResponseError);
apiMultipart.interceptors.response.use((response) => response, handleResponseError);

export { api, apiMultipart };
