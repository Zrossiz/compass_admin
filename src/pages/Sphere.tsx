import { useEffect, useState } from 'react';
import styles from '../shared/styles/Home.module.scss';
import type { Sphere } from '../modules/sphere/types';
import { SphereList } from '../modules/sphere/components/SphereList/SphereList';
import { getAllSpheres } from '../modules/sphere/api';
import { SphereForm } from '../modules/sphere/components/SphereForm';
import { Layout } from '../shared/components/Layout';

function SpherePage() {
  const [spheres, setSpheres] = useState<Sphere[]>([]);
  const [create, setCreate] = useState<boolean>(false);
  const [error, setError] = useState('');

  const loadSpheres = async () => {
    try {
      setError('');
      const res = await getAllSpheres();
      setSpheres(res);
    } catch {
      setError('Не удалось загрузить список сфер.');
    }
  };

  useEffect(() => {
    (async () => {
      await loadSpheres();
    })();
  }, []);

  return (
    <Layout>
      <div className={styles.wrapper}>
        <h1>Сферы</h1>
        <button type="button" onClick={() => setCreate(true)}>
          Создать
        </button>
        {create && (
          <SphereForm action="create" setOpen={setCreate} onSaved={loadSpheres} sphere={null} />
        )}
        {error && (
          <div role="alert">
            {error}
            <button type="button" onClick={loadSpheres}>
              Повторить
            </button>
          </div>
        )}
        <div className={styles.listWrapper}>
          <SphereList items={spheres} onSaved={loadSpheres} />
        </div>
      </div>
    </Layout>
  );
}

export default SpherePage;
