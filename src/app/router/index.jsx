import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { PrivateRoute, PublicRoute } from '../utils/checkAuth';
import { EmpresasLayout, PublicLayout, UserLayout } from '../layouts';
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
        element: <PrivateRoute />,
        children: [
          {
            element: <UserLayout />,
            children: [
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
            ],
          },
          {
            element: <EmpresasLayout />,
            children: [
              {
                path: '/dashboard',
                element: (
                  <main className='min-h-dvh bg-(--azul-fundo) p-6 sm:p-12'>
                    <h1 className='font-heading text-3xl font-bold text-(--azul-titulo)'>
                      Painel da empresa
                    </h1>
                  </main>
                ),
              },
            ],
          },
        ],
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
                path: '/cadastro-empresa',
                element: <Features.EmpresaAcesso />,
              },
              { path: '/empresa/acesso', element: <Features.EmpresaAcesso /> },
              {
                path: '/',
                element: <Features.LandingPage />,
              },
              {
                path: '/sobrenos',
                element: <Features.SobreNos />,
              },
              {
                path: '/sejaparceiro',
                element: <Features.SejaParceiro />,
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
