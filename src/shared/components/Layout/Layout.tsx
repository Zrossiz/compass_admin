import { Header } from '../Header';
import { Sidebar } from '../Sidebar';
import styles from './Layout.module.scss';
import type { LayoutProps } from './Layout.props';

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.sidebar}>
        <Sidebar />
      </div>
      <div className={styles.main}>
        <div className={styles.header}>
          <Header />
        </div>
        <div className={styles.content}>
          {children}
        </div>
      </div>
    </div>
  );
};
