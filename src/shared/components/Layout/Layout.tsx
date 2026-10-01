import { Header } from '../Header';
import { Sidebar } from '../Sidebar';
import styles from './Layout.module.scss';
import { Outlet } from 'react-router';

export const Layout = () => {
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
                    <Outlet />
                </div>
            </div>
        </div>
    )
}
