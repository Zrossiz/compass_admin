import { useState } from 'react';
import { login } from '../../api';
import { errorMessage } from '../../../../shared/api';
export const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  async function submit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      await login(username.trim(), password);
      window.location.replace('/spheres');
    } catch (err) {
      setError(errorMessage(err));
      setBusy(false);
    }
  }
  return (
    <div className="login-page">
      <div className="login-story">
        <div className="brand">
          <span className="brand-mark">↗</span>
          <span>компас</span>
        </div>
        <div>
          <span className="eyebrow">ПРОСТРАНСТВО РЕДАКТОРА</span>
          <h1>
            Будущее начинается
            <br />с хорошего выбора.
          </h1>
          <p>
            Помогайте находить своё направление.
            <br />
            Создавайте понятный и полезный каталог профессий.
          </p>
        </div>
        <div className="compass-art" aria-hidden>
          <span>С</span>
          <div>↗</div>
          <span>Ю</span>
        </div>
        <small>Сферы · Профессии · Образование</small>
      </div>
      <div className="login-side">
        <form className="login-card editor-form" onSubmit={submit}>
          <span className="eyebrow">КОМПАС / АДМИНИСТРИРОВАНИЕ</span>
          <h2>С возвращением</h2>
          <p>Войдите, чтобы продолжить работу с каталогом.</p>
          <label>
            Имя пользователя
            <input
              autoComplete="username"
              autoFocus
              required
              maxLength={40}
              value={username}
              disabled={busy}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Ваш логин"
            />
          </label>
          <label>
            Пароль
            <input
              type="password"
              autoComplete="current-password"
              required
              value={password}
              disabled={busy}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Введите пароль"
            />
          </label>
          {error && (
            <div className="notice error" role="alert">
              {error}
            </div>
          )}
          <button disabled={busy}>{busy ? 'Входим…' : 'Войти в панель →'}</button>
          <small>Доступ для редакторов каталога</small>
        </form>
      </div>
    </div>
  );
};
