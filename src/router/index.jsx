import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { Pages } from '../containers';
import { PrivateRoute, PublicRoute } from '../utils/checkAuth';
import { DashboardLayout, HomeLayout, LandingLayout } from '../layouts';

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
                element: <LandingLayout />,
                children: [
                  {
                    path: '/',
                    element: <Pages.LandingPage />,
                  },
                  {
                    path: '/sobrenos',
                    element: <Pages.SobreNos />,
                  },
                  {
                    path: '/cadastro-empresa',
                    element: <Pages.CadastroEmpresa />,
                  },
                ],
              },
              {
                path: '/login',
                element: <Pages.Auth />,
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
              {
                path: '/casa',
                element: <Pages.Casa/>
              },
              {
                path: '/financas',
                element: <Pages.FinancasA/>
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
