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
        path: '/home',
        element: (
          <main className='min-h-dvh bg-(--azul-fundo) p-6 sm:p-12'>
            <h1 className='font-heading text-3xl font-bold text-(--azul-titulo)'>
              Início
            </h1>
          </main>
        ),
      },
      {
        path: '/onboarding',
        element: <Features.Onboarding />,
      },
      {
        element: <PublicRoute />,
        children: [
          {
            path: '/login',
            element: <Features.Auth />,
          },
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
