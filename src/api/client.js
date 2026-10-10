import axios from 'axios';

const defaultBaseUrl = typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
  ? 'https://smart-internship-management-system-backend.onrender.com'
  : 'http://localhost:8080';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || defaultBaseUrl });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sims_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const isAuthCall = err.config?.url?.includes('/api/auth/');
    if (err.response?.status === 401 && !isAuthCall) {
      localStorage.removeItem('sims_token');
      localStorage.removeItem('sims_user');
      window.location.assign('/login');
    }
    return Promise.reject(err);
  },
);

export const errMsg = (e) =>
  e.response?.data?.message || (e.response ? `The server returned an error (${e.response.status}). Check the backend console for the cause.` : 'Cannot reach the server. Check that the backend is running.');

/** Fetches a file with the auth header and saves it through a temporary link. */
export async function download(path, params, filename) {
  const res = await api.get(path, { params, responseType: 'blob' });
  const url = URL.createObjectURL(res.data);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default api;
