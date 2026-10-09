import { Input, Textarea } from '@mantine/core';
import { useEffect, useState, type FormEvent } from 'react';
import { getAllSpheres } from '../../../sphere/api';
import type { Sphere } from '../../../sphere/types';
import { createProfession, updateProfession } from '../../api';
import styles from './ProfessionForm.module.scss';
import type { ProfessionFormProps } from './ProfessionForm.props';

export const ProfessionForm = ({ action, profession, setOpen, onSaved }: ProfessionFormProps) => {
  const [sphereId, setSphereId] = useState<number | ''>(profession?.sphereId ?? '');
  const [title, setTitle] = useState(profession?.title ?? '');
  const [description, setDescription] = useState(profession?.description ?? '');
  const [spheres, setSpheres] = useState<Sphere[]>([]);
  const [loadingSpheres, setLoadingSpheres] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const loadSpheres = async () => {
      try {
        const result = await getAllSpheres();
        if (active) {
          setSpheres(result);
        }
      } catch (err: unknown) {
        console.error(err);
        if (active) {
          setError('Не удалось загрузить список сфер.');
        }
      } finally {
        if (active) {
          setLoadingSpheres(false);
        }
      }
    };

    void loadSpheres();

    return () => {
      active = false;
    };
  }, []);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (sphereId === '') {
      setError('Выберите сферу.');
      return;
    }

    setSaving(true);

    try {
      if (action === 'update') {
        if (!profession) {
          setError('Не удалось определить профессию для обновления.');
          return;
        }

        await updateProfession(profession.id, sphereId, title, description);
      } else {
        await createProfession(sphereId, title, description);
      }

      await onSaved();
      setOpen(false);
    } catch (err: unknown) {
      console.error(err);
      setError(
        action === 'update' ? 'Не удалось обновить профессию.' : 'Не удалось создать профессию.',
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <form className={styles.form} onSubmit={submit}>
        <h2>
          {action === 'update' ? `Обновление: ${profession?.title ?? ''}` : 'Создание профессии'}
        </h2>

        <label>
          <span>Сфера</span>
          <select
            value={sphereId}
            onChange={(event) =>
              setSphereId(event.target.value === '' ? '' : Number(event.target.value))
            }
            disabled={loadingSpheres || saving}
            required
          >
            <option value="">{loadingSpheres ? 'Загрузка сфер…' : 'Выберите сферу'}</option>
            {spheres.map((sphere) => (
              <option key={sphere.id} value={sphere.id}>
                {sphere.title}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>Заголовок</span>
          <Input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            minLength={3}
            maxLength={255}
            disabled={saving}
            required
          />
        </label>

        <label>
          <span>Описание</span>
          <Textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            minLength={8}
            maxLength={10_000}
            disabled={saving}
            required
          />
        </label>

        {error && (
          <div className={styles.error} role="alert">
            {error}
          </div>
        )}

        <div className={styles.actions}>
          <button type="submit" disabled={saving || loadingSpheres}>
            {saving ? 'Сохранение…' : action === 'update' ? 'Сохранить' : 'Создать'}
          </button>
          <button type="button" onClick={() => setOpen(false)} disabled={saving}>
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
};
