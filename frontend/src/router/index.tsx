import { createBrowserRouter, Navigate } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import SignInPage from '../views/auth/sign-in';
import SignUpPage from '../views/auth/sign-up';
import AcpLayout from '../views/acp';
import UsersPage from '../views/acp/users';
import ReportsPage from '../views/acp/reports';
import MagicLinksPage from '../views/acp/magiclinks';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/acp" replace />,
  },
  {
    path: '/sign-in',
    element: <SignInPage />,
  },
  {
    path: '/sign-up',
    element: <SignUpPage />,
  },
  {
    path: '/acp',
    element: <PrivateRoute />,
    children: [
      {
        element: <AcpLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="/acp/reports" replace />,
          },
          {
            path: 'reports',
            element: <ReportsPage />,
          },
          {
            path: 'users',
            element: <UsersPage />,
          },
          {
            path: 'magiclinks',
            element: <MagicLinksPage />,
          },
        ],
      },
    ],
  },
]);

export default router;
