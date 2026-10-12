import { useState } from 'react';
import styles from './SpecialityForm.module.scss';
import type { SpecialityFormProps } from './SpecialityForm.props';
import { useEffect } from 'react';
import { findProfessions } from '../../../profession/api';
import { createSpeciality, updateSpeciality } from '../../api';
import { Input, Textarea } from '@mantine/core';
import type { Profession } from '../../../profession/types';

export const SpecialityForm = ({ action, onSaved, setOpen, speciality }: SpecialityFormProps) => {
  const [professionId, setProfessionId] = useState<number | ''>(speciality?.professionId ?? '');
  const [title, setTitle] = useState<string>(speciality?.title ?? '');
  const [description, setDescription] = useState<string>(speciality?.description ?? '');
  const [professions, setProfessions] = useState<Profession[]>([]);
  const [loadingProfessions, setLoadingProfessions] = useState<boolean>(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [professionsFindPattern, setProfessionsFindPattern] = useState<string>('');

  useEffect(() => {
    let active = true;

    const loadProfessions = async () => {
      try {
        const result = await findProfessions(professionsFindPattern, 0, 5);
        if (active) {
          setProfessions(result.items);
        }
      } catch (err: unknown) {
        console.error(err);
        if (active) {
          setError('Не удалось загрузить список профессий.');
        }
      } finally {
        if (active) {
          setLoadingProfessions(false);
        }
      }
    };

    void loadProfessions();

    return () => {
      active = false;
    };
  }, []);

  const submit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (professionId === '') {
      setError('Выберите профессию.');
      return;
    }

    setSaving(true);

    try {
      if (action === 'update') {
        if (!speciality) {
          setError('Не удалось определить специальность для обновления.');
          return;
        }

        await updateSpeciality(speciality.id, professionId, title, description);
      } else {
        await createSpeciality(professionId, title, description);
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
          {action === 'update'
            ? `Обновление: ${speciality?.title ?? ''}`
            : 'Создание специальности'}
        </h2>

        <label>
          <span>Поиск профессии</span>
          <Input
            value={professionsFindPattern}
            onChange={(event) => setProfessionsFindPattern(event.target.value)}
            placeholder="Введите название профессии"
            disabled={saving}
          />
        </label>

        <label>
          <span>Профессия</span>
          <select
            value={professionId}
            onChange={(event) =>
              setProfessionId(event.target.value === '' ? '' : Number(event.target.value))
            }
            disabled={loadingProfessions || saving}
            required
          >
            <option value="">
              {loadingProfessions ? 'Загрузка профессий…' : 'Выберите профессию'}
            </option>
            {professions.map((profession) => (
              <option key={profession.id} value={profession.id}>
                {profession.title}
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
          <button type="submit" disabled={saving || loadingProfessions}>
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
