import type { SphereListItemProps } from './SphereListItem.props';
import styles from './SphereListItem.module.scss';
import { useState } from 'react';
import { SphereForm } from '../SphereForm';

export const SphereListItem = ({ sphere, onSaved }: SphereListItemProps) => {
  const [openForm, setOpenForm] = useState<boolean>(false);

  return (
    <div className={styles.wrapper}>
      {openForm && (
        <SphereForm action="update" sphere={sphere} setOpen={setOpenForm} onSaved={onSaved} />
      )}
      <div className={styles.titleWrapper}>{sphere.title}</div>
      <button type="button" className={styles.editWrapper} onClick={() => setOpenForm(true)}>
        Изменить
      </button>
    </div>
  );
};
