import { NavLink } from 'react-router';
import styles from './Sidebar.module.scss';

const linkClassName = ({ isActive }: { isActive: boolean }) =>
  isActive ? styles.active : undefined;

export const Sidebar = () => {
  return (
    <nav aria-label="Разделы админки">
      <span>Контент</span>
      <ul>
        <li>
          <NavLink to="/spheres" className={linkClassName}>
            Сферы
          </NavLink>
        </li>
        <li>
          <NavLink to="/professions" className={linkClassName}>
            Профессии
          </NavLink>
        </li>
        <li>
          <NavLink to="/specialities" className={linkClassName}>
            Специальности
          </NavLink>
        </li>
      </ul>
      <span>Доступ</span>
      <ul>
        <li>
          <NavLink to="/roles" className={linkClassName}>
            Роли
          </NavLink>
        </li>
        <li>
          <NavLink to="/users" className={linkClassName}>
            Пользователи
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};
