import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { PublicRoute } from '../utils/checkAuth';
import { PublicLayout } from '../layouts';
import TelaErro from './components/telaErro';
import { Features } from '../../features';

const routes = createBrowserRouter([
  {
    errorElement: <TelaErro />,
    children: [
      {
        path: '/manutencao',
        element: <h1>Tela em manutenção</h1>,
      },
      {
        element: <PublicRoute />,
        children: [
          {
            element: <PublicLayout />,
            children: [
              {
                path: '/',
                element: <Features.LandingPage />,
              },
              {
                path: '/sobrenos',
                element: <Features.SobreNos />,
              },
              {
                path: '/login',
                element: <Features.Auth />,
              },
            ],
          },
        ],
      },
    ],
  },
]);

const AppRoutes = () => {
  return <RouterProvider router={routes} />;
};

export default AppRoutes;