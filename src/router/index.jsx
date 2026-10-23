import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  ScrollRestoration,
  Navigate,
} from 'react-router-dom';
import { Pages } from '../containers';
import { PrivateRoute, PublicRoute } from '../utils/checkAuth';
import { DashboardLayout, HomeLayout, LandingLayout } from '../layouts';
import Rotina from '../containers/rotina';
import Perfil from '../containers/perfil';
import Aprendendo from '../containers/aprendendo';
import EncontrarCasa from '../containers/encontrarCasa';
import Manutencao from '../containers/manutencao';

// Each feature registers its own route without coupling independent screen branches.
const featureRoutes = Object.values(
  import.meta.glob('./features/*.jsx', { eager: true, import: 'default' })
);

const routes = createBrowserRouter([
  {
    element: (
      <>
        <ScrollRestoration />
        <Outlet />
      </>
    ),
    errorElement: <Pages.TelaErro />,
    children: [
      {
        path: '/manutencao',
        element: <Manutencao />,
      },
      {
        element: <PublicRoute />,
        children: [
          {
            path: '/manutencao',
            element: <Manutencao />,
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
              { path: '/cadastro', element: <Pages.Auth /> },
              { path: '/recuperar-senha', element: <Pages.Auth /> },
              {
                path: '/cadastroEmpresa',
                element: <Navigate to='/cadastro-empresa' replace />,
              },
              {
                path: '/parceiros',
                element: <Navigate to='/cadastro-empresa' replace />,
              },
              {
                path: '/seja-parceiro',
                element: <Navigate to='/cadastro-empresa' replace />,
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
                path: '/financas',
                element: <Pages.FinancasA />,
              },
              { path: '/rotina', element: <Rotina /> },
              { path: '/minha-rotina', element: <Rotina /> },
              { path: '/perfil', element: <Perfil /> },
              { path: '/aprendendo', element: <Aprendendo /> },
              { path: '/encontrar-casa', element: <EncontrarCasa /> },
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
