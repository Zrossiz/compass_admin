import { createBrowserRouter } from 'react-router';
import SpherePage from './pages/Sphere';
import ProfessionPage from './pages/Profession';
import SpecialityPage from './pages/Speciality';
import UserPage from './pages/User';
import RolePage from './pages/Role';
import NotFoundPage from './pages/NotFound';
import LoginPage from './pages/Login';

export const router = createBrowserRouter([
  {
    path: '/',
    children: [
      { path: 'spheres', Component: SpherePage },
      { path: 'professions', Component: ProfessionPage },
      { path: 'specialities', Component: SpecialityPage },
      { path: 'roles', Component: RolePage },
      { path: 'users', Component: UserPage },
      { path: '', Component: LoginPage },
      { path: '*', Component: NotFoundPage },
    ],
  },
]);
