import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { LandingPage } from '../../features/landing-page';
import { SobreNos } from '../../features/sobre-nos';
import { PublicRoute } from '../utils/checkAuth';
import { PublicLayout } from '../layouts';
import TelaErro from './components/telaErro';

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
                element: <LandingPage />,
              },
              {
                path: '/sobrenos',
                element: <SobreNos />,
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