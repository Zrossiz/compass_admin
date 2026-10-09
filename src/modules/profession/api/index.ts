import type { Profession } from '../types';
import { apiClient } from '../../../shared/api';
import type { PaginatedResult } from '../../../shared/types/Pagination';

export const findProfessions = async (search: string, page: number, limit: number) => {
  const query = new URLSearchParams({
    search: search,
    page: String(page),
    limit: String(limit),
  });

  const res = await apiClient.get<PaginatedResult<Profession>>(`/api/v1/professions?${query}`);

  return res.data;
};

export const createProfession = async (sphereId: number, title: string, description: string) => {
  await apiClient.post('/api/v1/professions', {
    sphereId,
    title,
    description,
  });
};

export const updateProfession = async (
  professionId: number,
  sphereId: number,
  title: string,
  description: string,
) => {
  await apiClient.post(`/api/v1/professions/${professionId}`, {
    sphereId,
    title,
    description,
  });
};
