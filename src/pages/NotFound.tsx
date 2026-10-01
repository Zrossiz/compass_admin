import { Link } from 'react-router';

export default function NotFoundPage() {
  return (
    <div>
      <h1>404 — Страница не найдена</h1>
      <Link to="/spheres">Перейти к сферам</Link>
    </div>
  );
}
