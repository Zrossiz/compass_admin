import type { PaginatedResult } from '../../../../shared/types/Pagination';
import type { Profession } from '../../types';

export type ProfessionListProps = {
  onPageChange: (page: number) => void;
  onSaved: () => void | Promise<void>;
  loading?: boolean;
  paginatedProfessions: PaginatedResult<Profession>;
};
