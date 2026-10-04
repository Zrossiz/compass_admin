import { apiClient } from "../../../shared/api";

export const login = async (username: string, password: string) => {
  const res = await apiClient.post('/api/v1/users/login', {
    username,
    password,
  });

  return res.data;
};

export const register = async (username: string, password: string) => {
  const res = await apiClient.post('/api/v1/users/register', {
    username,
    password,
  });

  return res.data;
};
