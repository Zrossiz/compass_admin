import { useState } from 'react';
import type { SphereFormProps } from './SphereForm.props';
import styles from './SphereForm.module.scss';
import { Input, Textarea } from '@mantine/core';
import { createSphere, updateSphere } from '../../api';

export const SphereForm = ({ action, sphere }: SphereFormProps) => {
  const [title, setTitle] = useState<string>(sphere?.title ?? '');
  const [description, setDescription] = useState<string>(sphere?.description ?? '');
  const [err, setErr] = useState<string>('');

  const update = async () => {
    try {
      if (!sphere) {
        return;
      }

      await updateSphere(sphere.id, title, description);
    } catch (err: unknown) {
      console.log(err);
      setErr(String(err));
    }
  };

  const create = async () => {
    try {
      await createSphere(title, description);
    } catch (err: unknown) {
      console.log(err);
      setErr(String(err));
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>
        <span>{action == 'update' ? `Обновление ${title}` : 'Создание'}</span>
        <br />
      </div>
      <span>Заголовок</span>
      <br />
      <Input value={title} onChange={(e) => setTitle(e.target.value)} />
      <span>Описание</span>
      <br />
      <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />

      {err != '' && <div className={styles.errWrapper}>Ошибка: {err}</div>}

      <button onClick={action == 'update' ? () => update() : () => create()}>
        {action == 'update' ? 'Сохранить' : 'Создать'}
      </button>
    </div>
  );
};
