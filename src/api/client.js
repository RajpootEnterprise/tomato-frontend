import axios from 'axios';

// Swap between local and production by changing this constant
export const BASE_URL = 'https://tomato-backend-61q1.onrender.com/api';

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 90000, // 90s to handle Render cold-start
});

// Attach auth token on every request
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('tomato_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Unwrap the wrapper { success, message, data } shape
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('tomato_token');
      localStorage.removeItem('tomato_user');
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('tomato_logout'));
      }
    }
    return Promise.reject(error);
  }
);

export default client;
