import { useEffect, useState } from 'react';
import styles from '../shared/styles/Home.module.scss';
import type { Sphere } from '../modules/spheres/types';
import { SphereList } from '../modules/spheres/components/SphereList/SphereList';
import { getAllSpheres } from '../modules/spheres/api';

function SpherePage() {
  const [spheres, setSpheres] = useState<Sphere[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await getAllSpheres();
        setSpheres(res);
  
      } catch (err) {
        console.log(err);
      }
    })()
  }, [])

  return (
    <div className={styles.wrapper}>
      <h1>Сферы</h1>
      <div className={styles.listWrapper}>
        <SphereList items={spheres} />
      </div>
    </div>
  )
}

export default SpherePage;
