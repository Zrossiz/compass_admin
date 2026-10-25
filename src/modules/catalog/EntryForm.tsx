import { useEffect, useState } from 'react';
import { Modal, Select } from '@mantine/core';
import { apiClient, errorMessage } from '../../shared/api';
import { loadOptions } from './api';
import type { Entry, Resource } from './resources';

type Props = {
  resource: Resource;
  entry: Entry | null;
  fixed?: Record<string, number>;
  onClose: () => void;
  onSaved: () => void;
};
export function EntryForm({ resource, entry, fixed = {}, onClose, onSaved }: Props) {
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      resource.fields.map((field) => [
        field.key,
        String(
          field.key === 'order'
            ? (entry?.sortOrder ?? 0)
            : ((entry as unknown as Record<string, unknown> | null)?.[field.key] ??
                (field.type === 'number' ? 0 : '')),
        ),
      ]),
    ),
  );
  const [options, setOptions] = useState<Record<string, Entry[]>>({});
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(resource.fields.some((f) => f.source));
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    Promise.all(
      resource.fields
        .filter((f) => f.source)
        .map(async (f) => [f.key, await loadOptions(f.source!, controller.signal)] as const),
    )
      .then((results) => {
        if (!controller.signal.aborted) {
          setOptions(Object.fromEntries(results));
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!controller.signal.aborted) {
          setError(errorMessage(err));
          setLoading(false);
        }
      });
    return () => controller.abort();
  }, [resource, retry]);
  async function submit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const payload: Record<string, string | number> = { ...fixed };
    for (const field of resource.fields) {
      if (field.type === 'file') continue;
      const value = values[field.key].trim();
      if (
        !value ||
        (field.min !== undefined && field.type !== 'number' && value.length < field.min)
      ) {
        setError(
          `Заполните поле «${field.label}»${field.min ? `: минимум ${field.min} символов` : ''}.`,
        );
        return;
      }
      if (
        (field.source || field.type === 'number') &&
        (!Number.isSafeInteger(Number(value)) ||
          Number(value) < (field.source ? 1 : (field.min ?? 0)))
      ) {
        setError(`Проверьте поле «${field.label}».`);
        return;
      }
      payload[field.key] = field.source || field.type === 'number' ? Number(value) : value;
    }
    if (
      resource.kind === 'track' &&
      (!file ||
        !['image/jpeg', 'image/png', 'image/webp'].includes(file.type) ||
        file.size > 5 * 1024 * 1024)
    ) {
      setError('Выберите изображение JPEG, PNG или WebP размером до 5 МБ.');
      return;
    }
    let body: Record<string, string | number> | FormData = payload;
    if (file) {
      const data = new FormData();
      Object.entries(payload).forEach(([key, value]) => data.append(key, String(value)));
      data.append('file', file);
      body = data;
    }
    setBusy(true);
    setError('');
    try {
      await apiClient.post(`/api/v1/${resource.endpoint}${entry ? `/${entry.id}` : ''}`, body);
      onSaved();
    } catch (err) {
      setError(errorMessage(err));
      setBusy(false);
    }
  }
  return (
    <Modal
      opened
      onClose={() => !busy && onClose()}
      title={`${entry ? 'Редактирование' : 'Создание'} · ${resource.singular}`}
      centered
      size="lg"
      closeOnClickOutside={!busy}
      closeOnEscape={!busy}
      withCloseButton={!busy}
    >
      <form onSubmit={submit} className="editor-form">
        {resource.fields.map((field) =>
          field.source ? (
            <Select
              key={field.key}
              label={field.label}
              placeholder={loading ? 'Загрузка…' : 'Выберите из списка'}
              searchable
              nothingFoundMessage="Ничего не найдено"
              required
              disabled={busy || loading}
              value={values[field.key] || null}
              data={(options[field.key] ?? []).map((o) => ({
                value: String(o.id),
                label: o.title,
              }))}
              onChange={(value) => setValues({ ...values, [field.key]: value ?? '' })}
            />
          ) : (
            <label key={field.key}>
              {field.label}
              {field.type === 'file' ? (
                <>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    required
                    disabled={busy}
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  />
                  <small>
                    JPEG, PNG или WebP, до 5 МБ.
                    {entry ? ' При сохранении выберите изображение заново.' : ''}
                  </small>
                </>
              ) : field.type === 'textarea' ? (
                <textarea
                  required
                  rows={6}
                  minLength={field.min}
                  maxLength={field.max}
                  disabled={busy}
                  value={values[field.key]}
                  onChange={(e) => setValues({ ...values, [field.key]: e.target.value })}
                />
              ) : (
                <input
                  required
                  type={field.type ?? 'text'}
                  min={field.type === 'number' ? field.min : undefined}
                  step={field.type === 'number' ? 1 : undefined}
                  minLength={field.type !== 'number' ? field.min : undefined}
                  maxLength={field.max}
                  disabled={busy}
                  value={values[field.key]}
                  onChange={(e) => setValues({ ...values, [field.key]: e.target.value })}
                />
              )}
            </label>
          ),
        )}
        {error && (
          <div className="notice error" role="alert">
            {error}
            {resource.fields.some((f) => f.source && !options[f.key]) && (
              <button
                type="button"
                onClick={() => {
                  setLoading(true);
                  setError('');
                  setRetry((v) => v + 1);
                }}
              >
                Повторить загрузку
              </button>
            )}
          </div>
        )}
        <div className="form-actions">
          <button type="button" className="secondary" disabled={busy} onClick={onClose}>
            Отмена
          </button>
          <button
            disabled={busy || loading || resource.fields.some((f) => f.source && !options[f.key])}
          >
            {busy ? 'Сохранение…' : 'Сохранить'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
