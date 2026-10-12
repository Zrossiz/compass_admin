import styles from './SpecialityListItem.module.scss';
import type { SpecialityListItemProps } from './SpecialityListItem.props';

export const SpecialityListItem = ({ speciality, onSaved }: SpecialityListItemProps) => {
  return (
    <div className={styles.wrapper} onClick={onSaved}>
      <span>{speciality.title}</span>
    </div>
  );
};
