import { refresh } from './refresh';
import axios from 'axios';
import { baseUrl } from '../constants';

export const apiClient = axios.create({ baseURL: baseUrl, withCredentials: true });
let refreshing: Promise<unknown> | null = null;
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;
    const isAuth = /\/users\/(login|register|refresh|logout)$/.test(config?.url ?? '');
    if (error.response?.status !== 401 || !config || isAuth) return Promise.reject(error);
    if (config._retried) {
      window.location.replace('/');
      return Promise.reject(error);
    }
    config._retried = true;
    try {
      refreshing ??= refresh().finally(() => {
        refreshing = null;
      });
      await refreshing;
    } catch (refreshError) {
      window.location.replace('/');
      return Promise.reject(refreshError);
    }
    return apiClient(config);
  },
);

export function errorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (!error.response) return 'Нет связи с сервером. Проверьте подключение и попробуйте снова.';
    const status = error.response.status;
    if (status === 401) return 'Неверное имя пользователя или пароль.';
    if (status === 409) return 'Такая запись уже существует или используется в других разделах.';
    if (status === 404) return 'Запись не найдена. Обновите список.';
    if (status === 413) return 'Файл слишком большой. Максимальный размер — 5 МБ.';
    if (status === 400) return 'Проверьте заполнение полей. Сервер не принял данные.';
    if (status === 403) return 'Недостаточно прав для этого действия.';
  }
  return 'Не удалось выполнить действие. Попробуйте ещё раз.';
}
