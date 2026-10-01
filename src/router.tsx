import { createBrowserRouter, Navigate } from 'react-router';
import SpherePage from './pages/Sphere';
import ProfessionPage from './pages/Profession';
import SpecialityPage from './pages/Speciality';
import UserPage from './pages/User';
import RolePage from './pages/Role';
import NotFoundPage from './pages/NotFound';
import { Layout } from './shared/components/Layout';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, element: <Navigate to="/spheres" replace /> },
      { path: 'spheres', Component: SpherePage },
      { path: 'professions', Component: ProfessionPage },
      { path: 'specialities', Component: SpecialityPage },
      { path: 'roles', Component: RolePage },
      { path: 'users', Component: UserPage },
      { path: '*', Component: NotFoundPage },
    ],
  },
]);
