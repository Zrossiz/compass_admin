import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import { Layout } from '../shared/components/Layout';
import { apiClient, errorMessage } from '../shared/api';
import { Catalog } from '../modules/catalog/Catalog';
import { interviewResource, trackResource, type Entry } from '../modules/catalog/resources';
import { UniversityLinks } from '../modules/catalog/UniversityLinks';
const interviews = {
  profession: interviewResource('profession'),
  speciality: interviewResource('speciality'),
};
export default function MaterialsPage({ kind }: { kind: 'profession' | 'speciality' }) {
  const { id } = useParams();
  const [entry, setEntry] = useState<Entry | null>(null);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('interviews');
  const [retry, setRetry] = useState(0);
  const endpoint = kind === 'profession' ? 'professions' : 'specialties';
  useEffect(() => {
    const controller = new AbortController();
    apiClient
      .get<Entry>(`/api/v1/${endpoint}/${id}`, { signal: controller.signal })
      .then((r) => {
        if (!controller.signal.aborted) setEntry(r.data);
      })
      .catch((err) => {
        if (!controller.signal.aborted) setError(errorMessage(err));
      });
    return () => controller.abort();
  }, [endpoint, id, retry]);
  return (
    <Layout>
      <Link className="back-link" to={kind === 'profession' ? '/professions' : '/specialities'}>
        ← {kind === 'profession' ? 'Профессии' : 'Специальности'}
      </Link>
      {error ? (
        <div className="notice error" role="alert">
          {error}
          <button
            onClick={() => {
              setError('');
              setRetry((v) => v + 1);
            }}
          >
            Повторить
          </button>
        </div>
      ) : !entry ? (
        <div className="empty-state" role="status">
          Загрузка…
        </div>
      ) : (
        <>
          <div className="context-card">
            <span className="eyebrow">
              {kind === 'profession' ? 'Профессия' : 'Специальность'} · #{entry.id}
            </span>
            <h2>{entry.title}</h2>
            <p>{entry.description}</p>
          </div>
          <div className="tabs" role="tablist" aria-label="Материалы">
            {[
              ['interviews', 'Интервью'],
              ...(kind === 'speciality'
                ? [
                    ['tracks', 'Траектории'],
                    ['universities', 'Вузы'],
                  ]
                : []),
            ].map(([value, label]) => (
              <button
                role="tab"
                aria-selected={tab === value}
                key={value}
                className={tab === value ? 'selected' : ''}
                onClick={() => setTab(value)}
              >
                {label}
              </button>
            ))}
          </div>
          <div role="tabpanel">
            {tab === 'universities' ? (
              <UniversityLinks key={id} specialityId={Number(id)} />
            ) : (
              <Catalog
                key={`${id}-${tab}`}
                resource={tab === 'tracks' ? trackResource : interviews[kind]}
                scope={{ kind, id: Number(id) }}
              />
            )}
          </div>
        </>
      )}
    </Layout>
  );
}
