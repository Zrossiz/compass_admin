import { createBrowserRouter, Navigate } from 'react-router';
import SpherePage from './pages/Sphere';
import ProfessionPage from './pages/Profession';
import SpecialityPage from './pages/Speciality';
import UniversityPage from './pages/University';
import MaterialsPage from './pages/Materials';
import UserPage from './pages/User';
import NotFoundPage from './pages/NotFound';
import LoginPage from './pages/Login';
export const router = createBrowserRouter([
  { path: '/', Component: LoginPage },
  { path: '/spheres', Component: SpherePage },
  { path: '/professions', Component: ProfessionPage },
  { path: '/professions/:id', element: <MaterialsPage kind="profession" /> },
  { path: '/specialities', Component: SpecialityPage },
  { path: '/specialities/:id', element: <MaterialsPage kind="speciality" /> },
  { path: '/universities', Component: UniversityPage },
  { path: '/users', Component: UserPage },
  { path: '/roles', element: <Navigate to="/users" replace /> },
  { path: '*', Component: NotFoundPage },
]);
