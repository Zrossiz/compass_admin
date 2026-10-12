import { useEffect } from 'react';
import { Header } from '../Header';
import { Sidebar } from '../Sidebar';
import styles from './Layout.module.scss';
import type { LayoutProps } from './Layout.props';
import { getMe } from '../../api/getMe';

export const Layout = ({ children }: LayoutProps) => {
  const getMeQuery = async () => {
    try {
      const res = await getMe();
      console.log(res.data)
    } catch (err: unknown) {
      console.log(err);
    }
  }

  useEffect(() => {
    void getMeQuery();
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.sidebar}>
        <Sidebar />
      </div>
      <div className={styles.main}>
        <div className={styles.header}>
          <Header />
        </div>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
};
