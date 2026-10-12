import type { SpecialityListProps } from './SpecialityList.props';
import styles from './SpecialityList.module.scss';
import { SpecialityListItem } from '../SpecialityListItem';
import { Pagination } from '../../../../shared/components/Pagination';

export const SpecialityList = ({
  paginatedSpecialties,
  loading,
  onPageChange,
  onSaved,
}: SpecialityListProps) => {
  return (
    <div className={styles.wrapper}>
      {paginatedSpecialties.items.map((speciality) => (
        <SpecialityListItem key={speciality.id} speciality={speciality} onSaved={onSaved} />
      ))}
      <div className={styles.paginationWrapper}>
        <Pagination
          curPage={paginatedSpecialties.curPage}
          totalPages={paginatedSpecialties.totalPages}
          onPageChange={onPageChange}
          disabled={loading}
        />
      </div>
    </div>
  );
};
