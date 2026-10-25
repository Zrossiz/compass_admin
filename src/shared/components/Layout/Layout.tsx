import { useEffect, useState } from 'react';
import { NavLink } from 'react-router';
import type { LayoutProps } from './Layout.props';
import { apiClient, errorMessage } from '../../api';
const links = [
  ['spheres', '◈', 'Сферы'],
  ['professions', '▦', 'Профессии'],
  ['specialities', '◇', 'Специальности'],
  ['universities', '▥', 'Вузы'],
];
export const Layout = ({ children }: LayoutProps) => {
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);
  const [leaving, setLeaving] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    apiClient
      .get('/api/v1/users/me', { signal: controller.signal })
      .then((r) => {
        if (!controller.signal.aborted) setUser(r.data);
      })
      .catch((err) => {
        if (!controller.signal.aborted) setError(errorMessage(err));
      });
    return () => controller.abort();
  }, [retry]);
  async function logout() {
    setLeaving(true);
    try {
      await apiClient.post('/api/v1/users/logout');
      window.location.replace('/');
    } catch (err) {
      setError(errorMessage(err));
      setLeaving(false);
    }
  }
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <NavLink className="brand" to="/spheres">
          <span className="brand-mark">↗</span>
          <span>
            компас<small>ПАНЕЛЬ УПРАВЛЕНИЯ</small>
          </span>
        </NavLink>
        <div className="nav-caption">КАТАЛОГ</div>
        <nav aria-label="Основные разделы">
          {links.map(([path, icon, label]) => (
            <NavLink key={path} to={`/${path}`}>
              <span aria-hidden>{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="nav-caption">АККАУНТ</div>
        <nav aria-label="Настройки">
          <NavLink to="/users">
            <span aria-hidden>◎</span>Мой профиль
          </NavLink>
        </nav>
        <div className="sidebar-footer">
          ● Пространство редактора<small>Помогаем выбрать своё будущее.</small>
        </div>
      </aside>
      <div className="main-area">
        <header className="topbar">
          <span>Управление контентом</span>
          <div className="account">
            <span className="avatar">{user?.username?.slice(0, 1).toUpperCase() ?? 'К'}</span>
            <span>{user?.username ?? 'Загрузка…'}</span>
            {user && (
              <button className="text-button" disabled={leaving} onClick={logout}>
                {leaving ? 'Выход…' : 'Выйти'}
              </button>
            )}
          </div>
        </header>
        <main className="page-content">
          {error && (
            <div className="notice error" role="alert">
              {error}
              <button
                className="text-button"
                onClick={() => {
                  setError('');
                  setRetry((v) => v + 1);
                }}
              >
                Повторить
              </button>
            </div>
          )}
          {user
            ? children
            : !error && (
                <div className="empty-state" role="status">
                  <div className="spinner" />
                  Проверяем вход…
                </div>
              )}
        </main>
        <footer className="main-footer">
          Компас <span>Контент, который помогает определиться</span>
        </footer>
      </div>
    </div>
  );
};
