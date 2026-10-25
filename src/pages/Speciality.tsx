import { useState } from 'react';
import { Layout } from '../shared/components/Layout';
import type { Speciality } from '../modules/speciality/types';
import type { PaginatedResult } from '../shared/types/Pagination';
import { findSpecialties } from '../modules/speciality/api';
import { specialityCatalogBatchSize } from '../shared/constants';
import { useEffect } from 'react';
import { SpecialityForm } from '../modules/speciality/components/SpecialityForm';
import { SpecialityList } from '../modules/speciality/components/SpecialityList';

export default function SpecialityPage() {
  const [specialties, setSpecialties] = useState<PaginatedResult<Speciality> | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState('');
  const [pattern, setPattern] = useState('');
  const [createOpen, setCreateOpen] = useState<boolean>(false);

  const load = async (search: string, page: number) => {
    setLoading(true);
    setError('');

    try {
      const result = await findSpecialties(search, page, specialityCatalogBatchSize);
      setPattern(search);
      setSpecialties(result);
    } catch (err: unknown) {
      console.log(err);
      setError('Не удалось загрузить специальности. Попробуйте ещё раз.');
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
    await load(pattern, specialties?.curPage ?? 1);
  };

  return (
    <Layout>
      <h1>Специальности</h1>
      <button type="button" onClick={() => setCreateOpen(true)}>
        Создать
      </button>
      {createOpen && (
        <SpecialityForm
          action="create"
          speciality={null}
          setOpen={setCreateOpen}
          onSaved={reloadCurrentPage}
        />
      )}
      {error !== '' && <span>Ошибка: {error}</span>}
      {specialties ? (
        <SpecialityList
          loading={loading}
          paginatedSpecialties={specialties}
          onPageChange={(page) => load(pattern, page)}
          onSaved={reloadCurrentPage}
        />
      ) : (
        <span>not found</span>
      )}
    </Layout>
  );
}
