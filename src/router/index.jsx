import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Pages } from '../containers';
import { PrivateRoute, PublicRoute } from '../utils/checkAuth';
import { EmpresasLayout, PublicLayout, UserLayout } from '../layouts';

const routes = createBrowserRouter([
  {
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
            element: <PublicLayout />,
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
      {
        element: <PrivateRoute />,
        children: [
          {
            element: <UserLayout />,
            // usuário
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
            ],
          },
          {
            element: <EmpresasLayout />,
            // empresas
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
