import { useState } from 'react';
import type { ProfessionListItemProps } from './ProfessionListItem.props';
import styles from './ProfessionListItem.module.scss';
import { ProfessionForm } from '../ProfessionForm';

export const ProfessionListItem = ({ profession, onSaved }: ProfessionListItemProps) => {
  const [openForm, setOpenForm] = useState(false);

  return (
    <div className={styles.wrapper}>
      {openForm && (
        <ProfessionForm
          action="update"
          profession={profession}
          setOpen={setOpenForm}
          onSaved={onSaved}
        />
      )}
      <span>{profession.title}</span>
      <button type="button" onClick={() => setOpenForm(true)}>
        Изменить
      </button>
    </div>
  );
};
