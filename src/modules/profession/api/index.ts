import type { Profession } from "../types";
import { apiClient } from "../../../shared/api";
import type { PaginatedResult } from "../../../shared/types/Pagination";


export const findProfessions = async (
  search: string,
  page: number,
  limit: number,
) => {
  const query = new URLSearchParams({
    search: search,
    page: String(page),
    limit: String(limit),
  });

  const res = await apiClient.get<PaginatedResult<Profession>>(`/api/v1/professions?${query}`);

  return res.data;
};
