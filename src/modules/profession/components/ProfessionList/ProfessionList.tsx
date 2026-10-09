import type { ProfessionListProps } from './ProfessionList.props';
import styles from './ProfessionList.module.scss';
import { ProfessionListItem } from '../ProfessionListItem';
import { Pagination } from '../../../../shared/components/Pagination';

export const ProfessionList = ({
  paginatedProfessions,
  loading,
  onPageChange,
  onSaved,
}: ProfessionListProps) => {
  return (
    <div className={styles.wrapper}>
      {paginatedProfessions.items.map((profession) => (
        <ProfessionListItem key={profession.id} profession={profession} onSaved={onSaved} />
      ))}
      <div className={styles.paginationWrapper}>
        <Pagination
          curPage={paginatedProfessions.curPage}
          totalPages={paginatedProfessions.totalPages}
          onPageChange={onPageChange}
          disabled={loading}
        />
      </div>
    </div>
  );
};
