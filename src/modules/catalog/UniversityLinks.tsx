import { useEffect, useState } from 'react';
import { Select, Modal } from '@mantine/core';
import { apiClient, errorMessage } from '../../shared/api';
import type { Entry } from './resources';
import { Link } from 'react-router';

export function UniversityLinks({ specialityId }: { specialityId: number }) {
  const [all, setAll] = useState<Entry[]>([]);
  const [linked, setLinked] = useState<Entry[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [revision, setRevision] = useState(0);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [removing, setRemoving] = useState<Entry | null>(null);
  useEffect(() => {
    const controller = new AbortController();
    Promise.all([
      apiClient.get<Entry[]>('/api/v1/university', { signal: controller.signal }),
      apiClient.get<Entry[]>(`/api/v1/university/speciality/${specialityId}`, {
        signal: controller.signal,
      }),
    ])
      .then(([a, b]) => {
        if (!controller.signal.aborted) {
          setAll(a.data);
          setLinked(b.data);
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
  }, [specialityId, revision]);
  async function save(remove?: Entry) {
    setBusy(true);
    setError('');
    try {
      if (remove) {
        if (!remove.linkId) throw new Error('Missing link');
        await apiClient.delete(`/api/v1/speciality-university/${remove.linkId}`);
      } else
        await apiClient.post('/api/v1/speciality-university', {
          specialityId,
          universityId: Number(selected),
        });
      setSelected(null);
      setRemoving(null);
      setLoading(true);
      setRevision((v) => v + 1);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  }
  return (
    <section>
      <div className="page-heading">
        <div>
          <div className="eyebrow">Образование</div>
          <h1>Где учиться</h1>
          <p>Свяжите специальность с вузами из общего каталога.</p>
        </div>
        <Link className="button secondary" to="/universities">
          Каталог вузов ↗
        </Link>
      </div>
      {error && !removing && (
        <div className="notice error" role="alert">
          {error}
          <button
            className="text-button"
            onClick={() => {
              setError('');
              setLoading(true);
              setRevision((v) => v + 1);
            }}
          >
            Повторить загрузку
          </button>
        </div>
      )}
      <div className="panel">
        <form
          className="toolbar"
          onSubmit={(e) => {
            e.preventDefault();
            if (selected) void save();
          }}
        >
          <Select
            aria-label="Вуз"
            placeholder="Выберите вуз…"
            searchable
            nothingFoundMessage="Нет доступных вузов"
            disabled={loading || busy}
            value={selected}
            onChange={setSelected}
            data={all
              .filter((a) => !linked.some((l) => l.id === a.id))
              .map((a) => ({ value: String(a.id), label: `${a.title} · ${a.region}` }))}
          />
          <button disabled={!selected || busy || loading}>
            {busy ? 'Сохранение…' : 'Привязать вуз'}
          </button>
        </form>
        {loading ? (
          <div className="empty-state" role="status">
            Загрузка вузов…
          </div>
        ) : linked.length === 0 ? (
          <div className="empty-state">
            <h3>Вузы ещё не выбраны</h3>
            <p>Выберите существующий вуз или создайте его в каталоге.</p>
          </div>
        ) : (
          linked.map((u) => (
            <div className="linked-row" key={u.linkId ?? u.id}>
              <div>
                <strong>{u.title}</strong>
                <small>{u.region}</small>
              </div>
              <button
                className="danger-ghost small"
                disabled={busy}
                onClick={() => {
                  setError('');
                  setRemoving(u);
                }}
              >
                Отвязать
              </button>
            </div>
          ))
        )}
      </div>
      <Modal
        opened={!!removing}
        onClose={() => !busy && setRemoving(null)}
        title="Отвязать вуз?"
        centered
        withCloseButton={!busy}
      >
        <p>
          «{removing?.title}» останется в каталоге, но больше не будет связан с этой специальностью.
        </p>
        {error && (
          <div role="alert" className="notice error">
            {error}
          </div>
        )}
        <div className="form-actions">
          <button className="secondary" disabled={busy} onClick={() => setRemoving(null)}>
            Отмена
          </button>
          <button disabled={busy} onClick={() => removing && void save(removing)}>
            Отвязать
          </button>
        </div>
      </Modal>
    </section>
  );
}
