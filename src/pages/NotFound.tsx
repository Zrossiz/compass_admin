import { Link } from 'react-router';
export default function NotFoundPage() {
  return (
    <div className="empty-state not-found">
      <div className="brand-mark">↗</div>
      <span className="eyebrow">ОШИБКА 404</span>
      <h1>Кажется, мы сбились с пути</h1>
      <p>Такой страницы нет. Вернёмся к каталогу?</p>
      <Link className="button" to="/spheres">
        Открыть каталог
      </Link>
    </div>
  );
}
