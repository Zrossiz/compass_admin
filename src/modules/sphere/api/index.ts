import { apiClient } from '../../../shared/api';
import type { Sphere } from '../types';

export const getAllSpheres = async () => {
  const res = await apiClient.get<Sphere[]>('/api/v1/spheres');

  return res.data;
};

export const updateSphere = async (id: number, title: string, description: string) => {
  await apiClient.post(`/api/v1/spheres/${id}`, {
    title,
    description,
  });
};

export const createSphere = async (title: string, description: string) => {
  await apiClient.post('/api/v1/spheres', {
    title,
    description,
  });
};
