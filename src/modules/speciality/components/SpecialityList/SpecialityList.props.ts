import type { Speciality } from '../../types';
import { type PaginatedResult } from '../../../../shared/types/Pagination';

export type SpecialityListProps = {
  onPageChange: (page: number) => void;
  onSaved: () => void | Promise<void>;
  loading?: boolean;
  paginatedSpecialties: PaginatedResult<Speciality>;
};
