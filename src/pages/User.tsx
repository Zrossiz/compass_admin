import { useEffect, useState } from 'react';
import { Modal } from '@mantine/core';
import { Layout } from '../shared/components/Layout';
import { apiClient, errorMessage } from '../shared/api';
export default function UserPage() {
  const [user, setUser] = useState<{ id: number; username: string } | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState('');
  const [removing, setRemoving] = useState(false);
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    apiClient
      .get('/api/v1/users/me', { signal: controller.signal })
      .then((r) => {
        if (!controller.signal.aborted) {
          setUser(r.data);
          setUsername(r.data.username);
        }
      })
      .catch((err) => {
        if (!controller.signal.aborted) setError(errorMessage(err));
      });
    return () => controller.abort();
  }, [retry]);
  async function save(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user) return;
    if (!username.trim() || password.length < 8 || new TextEncoder().encode(password).length > 72) {
      setError('Введите имя и пароль длиной от 8 символов и не более 72 байт.');
      return;
    }
    setBusy(true);
    setError('');
    setSuccess('');
    try {
      await apiClient.post(`/api/v1/users/${user.id}`, { username: username.trim(), password });
      setPassword('');
      setSuccess('Профиль обновлён. Новые данные будут использованы при следующем входе.');
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  }
  async function remove() {
    if (!user) return;
    setBusy(true);
    setError('');
    try {
      await apiClient.delete(`/api/v1/users/${user.id}`);
      await apiClient.post('/api/v1/users/logout');
      window.location.replace('/');
    } catch (err) {
      setError(errorMessage(err));
      setBusy(false);
    }
  }
  return (
    <Layout>
      <div className="page-heading">
        <div>
          <div className="eyebrow">Аккаунт</div>
          <h1>Мой профиль</h1>
          <p>Имя пользователя и данные для входа.</p>
        </div>
      </div>
      {error && !removing && (
        <div className="notice error" role="alert">
          {error}
          {!user && (
            <button
              onClick={() => {
                setError('');
                setRetry((v) => v + 1);
              }}
            >
              Повторить
            </button>
          )}
        </div>
      )}
      {success && (
        <div className="notice success" role="status">
          {success}
        </div>
      )}
      {user && (
        <>
          <form className="panel profile-form editor-form" onSubmit={save}>
            <h2>Личные данные</h2>
            <label>
              Имя пользователя
              <input
                required
                maxLength={40}
                autoComplete="username"
                disabled={busy}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </label>
            <label>
              Новый пароль
              <input
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                disabled={busy}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <small>Минимум 8 символов. Для сохранения профиля необходимо задать пароль.</small>
            </label>
            <div className="form-actions">
              <button disabled={busy}>{busy ? 'Сохранение…' : 'Сохранить изменения'}</button>
            </div>
          </form>
          <div className="profile-danger">
            <div>
              <h3>Удаление аккаунта</h3>
              <p>Ваш доступ к панели будет удалён без возможности восстановления.</p>
            </div>
            <button
              className="danger-ghost"
              disabled={busy}
              onClick={() => {
                setError('');
                setRemoving(true);
              }}
            >
              Удалить аккаунт
            </button>
          </div>
        </>
      )}
      <Modal
        opened={removing}
        onClose={() => !busy && setRemoving(false)}
        title="Удалить свой аккаунт?"
        centered
        withCloseButton={!busy}
        closeOnEscape={!busy}
        closeOnClickOutside={!busy}
      >
        <p>
          Вы потеряете доступ к панели. Убедитесь, что у команды есть другой аккаунт для управления
          каталогом.
        </p>
        {error && (
          <div className="notice error" role="alert">
            {error}
          </div>
        )}
        <div className="form-actions">
          <button className="secondary" disabled={busy} onClick={() => setRemoving(false)}>
            Отмена
          </button>
          <button className="danger" disabled={busy} onClick={remove}>
            Удалить аккаунт
          </button>
        </div>
      </Modal>
    </Layout>
  );
}
