import { apiClient } from '../../../shared/api';
import { type PaginatedResult } from '../../../shared/types/Pagination';
import { type Speciality } from '../types';

export const findSpecialties = async (search: string, page: number, limit: number) => {
  const query = new URLSearchParams({
    search: search,
    page: String(page),
    limit: String(limit),
  });

  const res = await apiClient.get<PaginatedResult<Speciality>>(`/api/v1/specialties?${query}`);

  return res.data;
};

export const updateSpeciality = async (
  specialityId: number,
  professionId: number,
  title: string,
  description: string,
) => {
  await apiClient.post('/api/v1/specialties', {
    specialityId,
    professionId,
    title,
    description,
  });
};

export const createSpeciality = async (
  professionId: number,
  title: string,
  description: string,
) => {
  await apiClient.post('/api/v1/specialties', {
    professionId,
    title,
    description,
  });
};
