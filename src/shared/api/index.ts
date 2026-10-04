import { refresh } from './refresh';
import axios from 'axios';
import { baseUrl } from '../constants';

export const apiClient = axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        await refresh();
      } catch (err: unknown) {
        return Promise.reject(err);
      }

      return apiClient(error.config);
    }

    return Promise.reject(error);
  },
);
