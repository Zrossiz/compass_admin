import { apiClient } from '../../shared/api';
import type { Entry } from './resources';
import type { PaginatedResult } from '../../shared/types/Pagination';

// Load every page so relationship selectors never silently omit records after the first 100.
export async function loadOptions(source: string, signal?: AbortSignal): Promise<Entry[]> {
  if (source !== 'professions' && source !== 'specialties') {
    return (await apiClient.get<Entry[]>(`/api/v1/${source}`, { signal })).data;
  }
  const entries: Entry[] = [];
  for (let page = 1; ; page++) {
    const { data } = await apiClient.get<PaginatedResult<Entry>>(`/api/v1/${source}`, {
      params: { page, limit: 100 },
      signal,
    });
    entries.push(...data.items);
    if (page >= data.totalPages) return entries;
  }
}
