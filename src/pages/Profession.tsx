import { useEffect, useState } from 'react';
import { professionCatalogBatchSize } from '../shared/constants';
import { findProfessions } from '../modules/profession/api';
import type { PaginatedResult } from '../shared/types/Pagination';
import type { Profession } from '../modules/profession/types';
import { Layout } from '../shared/components/Layout';
import { ProfessionList } from '../modules/profession/components/ProfessionList';
import { ProfessionForm } from '../modules/profession/components/ProfessionForm';

export default function ProfessionPage() {
  const [professions, setProfessions] = useState<PaginatedResult<Profession> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pattern, setPattern] = useState('');
  const [createOpen, setCreateOpen] = useState(false);

  const load = async (search: string, page: number) => {
    setLoading(true);
    setError('');

    try {
      const result = await findProfessions(search, page, professionCatalogBatchSize);
      setPattern(search);
      setProfessions(result);
    } catch (err: unknown) {
      console.log(err);
      setError('Не удалось загрузить профессии. Попробуйте ещё раз.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      await load('', 1);
    })();
  }, []);

  const reloadCurrentPage = async () => {
    await load(pattern, professions?.curPage ?? 1);
  };

  return (
    <Layout>
      <h1>Профессии</h1>
      <button type="button" onClick={() => setCreateOpen(true)}>
        Создать
      </button>
      {createOpen && (
        <ProfessionForm
          action="create"
          profession={null}
          setOpen={setCreateOpen}
          onSaved={reloadCurrentPage}
        />
      )}
      {error !== '' && <span>Ошибка: {error}</span>}
      {professions ? (
        <ProfessionList
          loading={loading}
          paginatedProfessions={professions}
          onPageChange={(page) => load(pattern, page)}
          onSaved={reloadCurrentPage}
        />
      ) : (
        <span>not found</span>
      )}
    </Layout>
  );
}
