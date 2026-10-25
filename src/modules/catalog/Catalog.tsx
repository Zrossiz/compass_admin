import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Modal, Pagination, Select } from '@mantine/core';
import { apiClient, errorMessage } from '../../shared/api';
import { mediaUrl } from '../../shared/constants';
import type { PaginatedResult } from '../../shared/types/Pagination';
import { loadOptions } from './api';
import { EntryForm } from './EntryForm';
import type { Entry, Resource } from './resources';

type Props = { resource: Resource; scope?: { kind: 'profession' | 'speciality'; id: number } };
export function Catalog({ resource, scope }: Props) {
  const [items, setItems] = useState<Entry[]>([]);
  const [parents, setParents] = useState<Entry[]>([]);
  const [query, setQuery] = useState({ search: '', parent: '', page: 1 });
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [revision, setRevision] = useState(0);
  const [editor, setEditor] = useState<{ entry: Entry | null } | null>(null);
  const [deleting, setDeleting] = useState<Entry | null>(null);
  const [busy, setBusy] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const path = `/api/v1/${resource.endpoint}${scope ? `/${scope.kind}/${scope.id}` : ''}`;
  useEffect(() => {
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setLoading(true);
      setError('');
      try {
        const params = resource.paginated
          ? {
              search: query.search,
              page: query.page,
              limit: 10,
              ...(resource.parent && query.parent ? { [resource.parent.key]: query.parent } : {}),
            }
          : undefined;
        const [response, options] = await Promise.all([
          apiClient.get<Entry[] | PaginatedResult<Entry>>(path, {
            params,
            signal: controller.signal,
          }),
          resource.parent
            ? loadOptions(resource.parent.source, controller.signal)
            : Promise.resolve([]),
        ]);
        if (controller.signal.aborted) return;
        setParents(options);
        if (Array.isArray(response.data)) {
          setItems(response.data);
          setTotalPages(1);
        } else {
          if (query.page > Math.max(1, response.data.totalPages)) {
            setQuery((q) => ({
              ...q,
              page: Math.max(1, (response.data as PaginatedResult<Entry>).totalPages),
            }));
            return;
          }
          setItems(response.data.items);
          setTotalPages(response.data.totalPages);
        }
      } catch (err) {
        if (!controller.signal.aborted) setError(errorMessage(err));
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 200);
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [path, resource, query, revision]);
  const visible = resource.paginated
    ? items
    : items.filter((item) =>
        `${item.title} ${item.description ?? ''} ${item.region ?? ''}`
          .toLocaleLowerCase()
          .includes(query.search.toLocaleLowerCase()),
      );
  function changeQuery(next: Partial<typeof query>) {
    setLoading(true);
    setQuery({ ...query, ...next });
  }
  async function remove() {
    if (!deleting) return;
    setBusy(true);
    setDeleteError('');
    try {
      await apiClient.delete(`/api/v1/${resource.endpoint}/${deleting.id}`);
      setDeleting(null);
      setNotice('Запись удалена');
      setLoading(true);
      setRevision((v) => v + 1);
    } catch (err) {
      setDeleteError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  }
  return (
    <section>
      <div className="page-heading">
        <div>
          <div className="eyebrow">{scope ? 'Материалы' : 'Каталог'}</div>
          <h1>{resource.title}</h1>
          <p>{resource.description}</p>
        </div>
        <button
          onClick={() => {
            setNotice('');
            setEditor({ entry: null });
          }}
        >
          <span aria-hidden>＋</span> Добавить
        </button>
      </div>
      {notice && (
        <div role="status" className="notice success">
          {notice}
          <button
            className="text-button"
            onClick={() => setNotice('')}
            aria-label="Скрыть уведомление"
          >
            ×
          </button>
        </div>
      )}
      <div className="panel">
        <div className="toolbar">
          <div className="search-field">
            <span aria-hidden>⌕</span>
            <input
              aria-label="Поиск по названию"
              placeholder="Поиск по названию…"
              value={query.search}
              maxLength={255}
              onChange={(e) => changeQuery({ search: e.target.value, page: 1 })}
            />
          </div>
          {resource.parent && (
            <Select
              aria-label={`Фильтр: ${resource.parent.label}`}
              placeholder={`Все: ${resource.parent.label.toLowerCase()}`}
              searchable
              clearable
              nothingFoundMessage="Ничего не найдено"
              value={query.parent || null}
              data={parents.map((p) => ({ value: String(p.id), label: p.title }))}
              onChange={(value) => changeQuery({ parent: value ?? '', page: 1 })}
            />
          )}
          <button
            className="secondary"
            onClick={() => {
              setLoading(true);
              setRevision((v) => v + 1);
            }}
            aria-label="Обновить список"
          >
            ↻ Обновить
          </button>
        </div>
        {error ? (
          <div className="empty-state" role="alert">
            <h3>Не удалось загрузить данные</h3>
            <p>{error}</p>
            <button
              onClick={() => {
                setLoading(true);
                setRevision((v) => v + 1);
              }}
            >
              Попробовать снова
            </button>
          </div>
        ) : loading ? (
          <div className="empty-state" role="status">
            <div className="spinner" />
            <p>Загружаем записи…</p>
          </div>
        ) : visible.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">◇</div>
            <h3>{query.search || query.parent ? 'Ничего не найдено' : 'Здесь пока пусто'}</h3>
            <p>
              {query.search || query.parent
                ? 'Попробуйте изменить запрос или фильтр.'
                : 'Добавьте первую запись — она появится в каталоге.'}
            </p>
            <button
              className="secondary"
              onClick={() =>
                query.search || query.parent
                  ? changeQuery({ search: '', parent: '', page: 1 })
                  : setEditor({ entry: null })
              }
            >
              {query.search || query.parent ? 'Сбросить фильтры' : 'Добавить запись'}
            </button>
          </div>
        ) : (
          <>
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Название</th>
                    <th>
                      {resource.parent?.label ??
                        (resource.kind === 'track' || resource.kind === 'interview'
                          ? 'Порядок'
                          : resource.endpoint === 'university'
                            ? 'Регион'
                            : 'Описание')}
                    </th>
                    <th className="actions-column">Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className="entry-name">
                          {resource.kind === 'track' && item.imageLink && (
                            <img
                              className="track-thumb"
                              alt=""
                              src={
                                /^(https?:)?\/\//.test(item.imageLink)
                                  ? item.imageLink
                                  : `${mediaUrl.replace(/\/$/, '')}/${item.imageLink.replace(/^\//, '')}`
                              }
                            />
                          )}
                          <div>
                            <strong>{item.title}</strong>
                            <small>
                              #{item.id}
                              {resource.kind === 'profession' || resource.kind === 'speciality' ? (
                                <Link
                                  to={`/${resource.kind === 'profession' ? 'professions' : 'specialities'}/${item.id}`}
                                >
                                  Открыть материалы →
                                </Link>
                              ) : item.videoLink && /^https?:\/\//.test(item.videoLink) ? (
                                <a href={item.videoLink} target="_blank" rel="noreferrer">
                                  Смотреть видео ↗
                                </a>
                              ) : null}
                            </small>
                          </div>
                        </div>
                      </td>
                      <td>
                        {resource.parent ? (
                          <span className="badge">
                            {parents.find(
                              (p) =>
                                p.id === item[resource.parent!.key as 'sphereId' | 'professionId'],
                            )?.title ?? '—'}
                          </span>
                        ) : resource.kind === 'track' || resource.kind === 'interview' ? (
                          <span className="badge">{item.sortOrder}</span>
                        ) : (
                          <span className="description-cell">
                            {resource.endpoint === 'university' ? item.region : item.description}
                          </span>
                        )}
                      </td>
                      <td>
                        <div className="row-actions">
                          <button
                            className="secondary small"
                            onClick={() => setEditor({ entry: item })}
                            aria-label={`Редактировать: ${item.title}`}
                          >
                            Изменить
                          </button>
                          <button
                            className="danger-ghost small"
                            onClick={() => {
                              setDeleteError('');
                              setDeleting(item);
                            }}
                            aria-label={`Удалить: ${item.title}`}
                          >
                            Удалить
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="table-footer">
              <span>Записей на странице: {visible.length}</span>
              {resource.paginated && totalPages > 1 && (
                <Pagination
                  total={totalPages}
                  value={query.page}
                  onChange={(page) => changeQuery({ page })}
                />
              )}
            </div>
          </>
        )}
      </div>
      {editor && (
        <EntryForm
          resource={resource}
          entry={editor.entry}
          fixed={scope ? { [`${scope.kind}Id`]: scope.id } : undefined}
          onClose={() => setEditor(null)}
          onSaved={() => {
            setEditor(null);
            setNotice('Изменения сохранены');
            setLoading(true);
            setRevision((v) => v + 1);
          }}
        />
      )}
      <Modal
        opened={!!deleting}
        onClose={() => !busy && setDeleting(null)}
        title="Удалить запись?"
        centered
        withCloseButton={!busy}
        closeOnClickOutside={!busy}
        closeOnEscape={!busy}
      >
        <p>
          «{deleting?.title}» будет удалена. Это действие нельзя отменить. Связанные материалы также
          могут быть удалены.
        </p>
        {deleteError && (
          <div className="notice error" role="alert">
            {deleteError}
          </div>
        )}
        <div className="form-actions">
          <button className="secondary" disabled={busy} onClick={() => setDeleting(null)}>
            Отмена
          </button>
          <button className="danger" disabled={busy} onClick={remove}>
            {busy ? 'Удаление…' : 'Удалить'}
          </button>
        </div>
      </Modal>
    </section>
  );
}
