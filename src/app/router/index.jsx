import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { PrivateRoute, PublicRoute } from '../utils/checkAuth';
import {
  CasaLayout,
  EmpresasLayout,
  PublicLayout,
  UserLayout,
} from '../layouts';
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
                path: '/marketplace',
                element: <Features.Marketplace />,
              },
              {
                path: '/empresas/:id',
                element: <Features.Marketplace pagina='perfil' />,
              },
              {
                path: '/servicos/:id',
                element: <Features.Marketplace pagina='servico' />,
              },
              {
                path: '/home',
                element: <Features.Home />,
              },
              {
                element: <CasaLayout />,
                children: [
                  { path: '/casa', element: <Features.Casa /> },
                  { path: '/limpeza', element: <Features.Limpeza /> },
                  { path: '/cozinha', element: <Features.Cozinha /> },
                ],
              },
              {
                path: '/rotina',
                element: <Features.Rotina />,
              },
              {
                path: '/financas',
                element: <Features.Financas />,
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
                path: '/empresa',
                element: <Features.Empresa />,
              },
              {
                path: '/dashboard',
                element: <Features.Empresa pagina='painel' />,
              },
              {
                path: '/meus-servicos',
                element: <Features.Empresa pagina='anuncios' />,
              },
              {
                path: '/anunciar-servico',
                element: <Features.Empresa pagina='novo' />,
              },
              {
                path: '/meus-servicos/:id',
                element: <Features.Empresa pagina='detalhe' />,
              },
              {
                path: '/meus-servicos/:id/editar',
                element: <Features.Empresa pagina='editar' />,
              },
              {
                path: '/meus-servicos/:id/fotos',
                element: <Features.Empresa pagina='fotos' />,
              },
              {
                path: '/meus-servicos/:id/previa',
                element: <Features.Empresa pagina='previa' />,
              },
              {
                path: '/perfil-empresa',
                element: <Features.Empresa pagina='perfil' />,
              },
              {
                path: '/contatos',
                element: <Features.Empresa pagina='contatos' />,
              },
              {
                path: '/contatos/:id',
                element: <Features.Empresa pagina='conversa' />,
              },
              {
                path: '/empresa/marketplace',
                element: <Features.Marketplace empresa />,
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
