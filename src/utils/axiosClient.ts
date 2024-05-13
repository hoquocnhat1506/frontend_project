import axios from 'axios';

const apiURL = import.meta.env.VITE_API_URL;

const axiosClient = axios.create({
  baseURL: apiURL,
  timeout: 30000
});

axiosClient.interceptors.request.use(
  function (config) {
    if (localStorage.getItem('accessToken')) {
      config.headers['Authorization'] = `Bearer ${localStorage.getItem('accessToken')}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalConfig = err.config;
    if (
      originalConfig?.url !== '/v1/auth/login' &&
      err.response &&
      err.response.status === 401
    ) {
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default axiosClient;
