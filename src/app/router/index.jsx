import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { PrivateRoute, PublicRoute } from '../utils/checkAuth';
import { EmpresasLayout, PublicLayout, UserLayout } from '../layouts';
import TelaErro from './components/telaErro';
import { Features } from '../../features';
import { Container } from '../../shared/ui';

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
                  <Container
                    as='main'
                    className='flex-1 bg-(--azul-fundo) py-4 sm:py-8'
                  >
                    <h1 className='font-heading text-3xl font-bold text-(--azul-titulo)'>
                      Início
                    </h1>
                  </Container>
                ),
              },
              {
                path: '/rotina',
                element: <Features.Rotina />,
              },
              {
                path: '/perfil',
                element: (
                  <Container
                    as='main'
                    className='flex-1 bg-(--azul-fundo) py-4 sm:py-8'
                  >
                    <h1 className='font-heading text-3xl font-bold text-(--azul-titulo)'>
                      Meu perfil
                    </h1>
                  </Container>
                ),
              },
            ],
          },
          {
            element: <UserLayout userType='userB' />,
            children: [
              {
                path: '/home-b',
                element: <Features.HomeUserB />,
              },
              {
                path: '/minhajornada',
                element: <Features.MinhaJornada />,
              },
            ],
          },
          {
            element: <EmpresasLayout />,
            children: [
              {
                path: '/dashboard',
                element: (
                  <Container
                    as='main'
                    className='flex-1 bg-(--azul-fundo) py-4 sm:py-8'
                  >
                    <h1 className='font-heading text-3xl font-bold text-(--azul-titulo)'>
                      Painel da empresa
                    </h1>
                  </Container>
                ),
              },
            ],
          },
        ],
      },
      {
        element: <PublicRoute />,
        children: [
          {
            path: '/login',
            element: <Features.Auth />,
          },
          {
            path: '/onboarding',
            element: <Features.Onboarding />,
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
                path: '/sejaparceiro',
                element: <Features.SejaParceiro />,
              },
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
