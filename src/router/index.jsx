import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { Pages } from '../containers';
import { PrivateRoute, PublicRoute } from '../utils/checkAuth';
import {
  DashboardLayout,
  HomeLayout,
  LandingLayout,
  AuthLayout,
} from '../layouts';

// Each feature registers its own route without coupling independent screen branches.
const featureRoutes = Object.values(
  import.meta.glob('./features/*.jsx', { eager: true, import: 'default' })
);

const routes = createBrowserRouter([
  {
    element: <Outlet />,
    errorElement: <Pages.TelaErro />,
    children: [
      {
        path: '/manutencao',
        element: <h1>Tela em manutenção</h1>,
      },
      {
        element: <PublicRoute />,
        children: [
            {
                path: '/manutencao',
                element: <h1>Tela em manutenção</h1>,
            },
            {
                element: <PublicRoute />,
                children: [
                    {
                        path: '/',
                        element: <Pages.LandingPage />,
                    },
                    {
                        path: '/login',
                        element: <Pages.Auth />
                    },
                    {
                        path: '/cadastro-empresa',
                        element: <Pages.CadastroEmpresa />,
                    },
                    {
                        path: '/cadastroEmpresa',
                        element: <Pages.CadastroEmpresa />,
                    },
                    {
                        path: '/parceiros',
                        element: <Pages.CadastroEmpresa />,
                    },
                    {
                        path: '/seja-parceiro',
                        element: <Pages.CadastroEmpresa />,
                    },
                    {
                        path: '/onboarding',
                        element: <Pages.Onboarding />,
                    },
                ],
            },
            {
                element: <PrivateRoute />,
                children: [
                    {
                        path: '/home',
                        element: <Pages.Home />,
                    },
                    {
                        path: '/dashboard',
                        element: <Pages.Dashboard />,
                    },
                    {
                        path: '/meus-servicos',
                        element: <Pages.MeusServicos />,
                    },
                    {
                        path: '/meusServicos',
                        element: <Pages.MeusServicos />,
                    },
                    {
                        path: '/perfil-empresa',
                        element: <Pages.PerfilEmpresa />,
                    },
                    {
                        path: '/perfilEmpresa',
                        element: <Pages.PerfilEmpresa />,
                    },
                    {
                        path: '/marketplace',
                        element: <Pages.Marketplace />,
                    },
                ],
            },
        ],
      },
      {
        element: <PrivateRoute />,
        children: [
          // Home Layout (Variante 2: Home)
          {
            element: <HomeLayout />,
            children: [
              {
                path: '/home',
                element: <Pages.Home />,
              },
              {
                path: '/minhajornada',
                element: <Pages.MinhaJornada />,
              },
              {
                path: '/marketplace',
                element: <Pages.Marketplace />,
              },
              ...featureRoutes,
            ],
          },
          // Dashboard Layout (Variante 1: Dashboard)
          {
            element: <DashboardLayout />,
            children: [
              {
                path: '/dashboard',
                element: <Pages.Dashboard />,
              },
              {
                path: '/meus-servicos',
                element: <Pages.MeusServicos />,
              },
              {
                path: '/meusServicos',
                element: <Pages.MeusServicos />,
              },
              {
                path: '/perfil-empresa',
                element: <Pages.PerfilEmpresa />,
              },
              {
                path: '/perfilEmpresa',
                element: <Pages.PerfilEmpresa />,
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
