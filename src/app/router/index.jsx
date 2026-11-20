import ResidenciaNecessaria from '../../features/preparacao/ResidenciaNecessaria';
import { acessoLocal } from '../dados/acessoLocal';
import PerfilA from '../../features/perfil/perfilA';
import MarketplaceA from '../../features/marketplace/marketplaceA';
import Inicio from '../../features/home/home';
import CasaA from '../../features/casa/casaA';
import LimpezaA from '../../features/limpeza/limpezaA';
import CozinhaA from '../../features/cozinha/cozinhaA';
import DespensaA from '../../features/cozinha/despensaA';
import Rotina from '../../features/rotina/rotina';
import FinancasA from '../../features/financas/financasA';
import PerfilDaConta from '../../features/auth/perfilDaConta';
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from 'react-router-dom';
import { RotaPrivada, RotaPublica } from '../utils/checkAuth';
import {
  LayoutCasa,
  LayoutEmpresas,
  LayoutPublico,
  LayoutUsuario,
} from '../layouts/index';
import TelaErro from './components/telaErro';
import { Funcionalidades } from '../../features/index';

const rotas = createBrowserRouter([
  {
    errorElement: <TelaErro />,
    children: [
      {
        element: <RotaPrivada />,
        children: [
          {
            element: <LayoutUsuario tipoUsuario='consumidorA' />,
            children: [
              { path: '/home', element: <Inicio /> },
              {
                path: '/ia',
                element: <Funcionalidades.InteligenciaArtificial />,
              },
              {
                element: <LayoutCasa areaCasa />,
                children: [
                  { path: '/casa', element: <ResidenciaNecessaria><CasaA /></ResidenciaNecessaria> },
                  { path: '/limpeza', element: <ResidenciaNecessaria><LimpezaA /></ResidenciaNecessaria> },
                  { path: '/cozinha', element: <CozinhaA /> },
                  { path: '/despensa', element: <ResidenciaNecessaria><DespensaA /></ResidenciaNecessaria> },
                ],
              },
              { path: '/rotina', element: <Rotina /> },
              { path: '/financas', element: <FinancasA /> },
              {
                path: '/calculadoras',
                element: <Navigate to='/financas' replace />,
              },
              {
                path: '/calculadoras/:tipo',
                element: <Navigate to='/financas' replace />,
              },
              {
                path: '/perfil',
                element: acessoLocal ? <PerfilA /> : <PerfilDaConta />,
              },
              {
                path: '/checklists',
                element: <Navigate to='/rotina' replace />,
              },
              {
                path: '/seguranca',
                element: <Navigate to='/perfil' replace />,
              },
              {
                path: '/notificacoes',
                element: <Navigate to='/home' replace />,
              },
              {
                path: '/marketplace',
                element: <MarketplaceA />,
              },
              {
                path: '/buscar',
                element: <MarketplaceA />,
              },
              {
                path: '/buscar/mapa',
                element: <MarketplaceA />,
              },
              {
                path: '/marketplace/filtros',
                element: <MarketplaceA />,
              },
              {
                path: '/categoria/:slug',
                element: <MarketplaceA />,
              },
              {
                path: '/categorias/:slug',
                element: <MarketplaceA />,
              },
              {
                path: '/servicos/indisponivel',
                element: <MarketplaceA />,
              },
              {
                path: '/servicos/:id',
                element: <MarketplaceA />,
              },
              {
                path: '/servicos/:id/avaliacoes',
                element: <MarketplaceA />,
              },
              {
                path: '/servicos/:id/contato',
                element: <MarketplaceA />,
              },
              {
                path: '/empresas/:id',
                element: <MarketplaceA />,
              },
              {
                path: '/favoritos',
                element: <MarketplaceA />,
              },
              {
                path: '/servicos-contratados',
                element: <MarketplaceA />,
              },
              {
                path: '/meus-contatos',
                element: <MarketplaceA />,
              },
              {
                path: '/meus-contatos/:id',
                element: <MarketplaceA />,
              },
              {
                path: '/home-b',
                element: <Funcionalidades.InicioPreparacao />,
              },
              {
                path: '/minhajornada',
                element: <Funcionalidades.MinhaJornada />,
              },
              {
                path: '/financas-b',
                element: <Funcionalidades.Planejamento />,
              },
              {
                path: '/planejamento',
                element: <Funcionalidades.Planejamento />,
              },
              { path: '/aprendendo', element: <Funcionalidades.Aprendendo /> },
              {
                path: '/encontrar-casa',
                element: <Funcionalidades.EncontrarCasa />,
              },
              {
                path: '/perfil-b',
                element: acessoLocal ? <PerfilA /> : <PerfilDaConta />,
              },
              {
                path: '/ia-b',
                element: <Funcionalidades.InteligenciaArtificial />,
              },
            ],
          },
          {
            element: <LayoutEmpresas />,
            children: [
              {
                path: '/empresa/ia',
                element: <Funcionalidades.InteligenciaArtificial />,
              },
              {
                path: '/empresa',
                element: <Funcionalidades.Empresa visao='inicio' />,
              },
              {
                path: '/empresa/dashboard',
                element: <Funcionalidades.Empresa visao='painel' />,
              },
              {
                path: '/dashboard',
                element: <Funcionalidades.Empresa visao='painel' />,
              },
              {
                path: '/empresa/anuncios',
                element: <Funcionalidades.Empresa visao='anuncios' />,
              },
              {
                path: '/meus-servicos',
                element: <Funcionalidades.Empresa visao='anuncios' />,
              },
              {
                path: '/empresa/anunciar',
                element: <Funcionalidades.Empresa visao='novo' />,
              },
              {
                path: '/anunciar-servico',
                element: <Funcionalidades.Empresa visao='novo' />,
              },
              {
                path: '/empresa/anuncios/:id',
                element: <Funcionalidades.Empresa visao='detalhe' />,
              },
              {
                path: '/meus-servicos/:id',
                element: <Funcionalidades.Empresa visao='detalhe' />,
              },
              {
                path: '/empresa/anuncios/:id/editar',
                element: <Funcionalidades.Empresa visao='editar' />,
              },
              {
                path: '/meus-servicos/:id/editar',
                element: <Funcionalidades.Empresa visao='editar' />,
              },
              {
                path: '/empresa/anuncios/:id/fotos',
                element: <Funcionalidades.Empresa visao='fotos' />,
              },
              {
                path: '/meus-servicos/:id/fotos',
                element: <Funcionalidades.Empresa visao='fotos' />,
              },
              {
                path: '/empresa/anuncios/:id/previa',
                element: <Funcionalidades.Empresa visao='previa' />,
              },
              {
                path: '/meus-servicos/:id/previa',
                element: <Funcionalidades.Empresa visao='previa' />,
              },
              {
                path: '/empresa/perfil',
                element: acessoLocal ? (
                  <Funcionalidades.Empresa visao='perfil' />
                ) : (
                  <PerfilDaConta empresa />
                ),
              },
              {
                path: '/perfil-empresa',
                element: acessoLocal ? (
                  <Funcionalidades.Empresa visao='perfil' />
                ) : (
                  <PerfilDaConta empresa />
                ),
              },
              {
                path: '/empresa/perfil/midias',
                element: <Funcionalidades.Empresa visao='midias' />,
              },
              {
                path: '/perfil-empresa/midias',
                element: <Funcionalidades.Empresa visao='midias' />,
              },
              {
                path: '/empresa/contatos',
                element: <Funcionalidades.Empresa visao='contatos' />,
              },
              {
                path: '/contatos',
                element: <Funcionalidades.Empresa visao='contatos' />,
              },
              {
                path: '/empresa/contatos/:id',
                element: <Funcionalidades.Empresa visao='conversa' />,
              },
              {
                path: '/contatos/:id',
                element: <Funcionalidades.Empresa visao='conversa' />,
              },
              {
                path: '/empresa/marketplace',
                element: <MarketplaceA dentroDaEmpresa />,
              },
              {
                path: '/empresa/buscar',
                element: <MarketplaceA dentroDaEmpresa />,
              },
            ],
          },
        ],
      },
      {
        element: <RotaPublica />,
        children: [
          { path: '/login', element: <Funcionalidades.Autenticacao /> },
          {
            path: '/cadastro/dados-da-empresa',
            element: <PerfilDaConta empresa cadastro />,
          },
          {
            path: '/cadastro/moradia',
            element: <Funcionalidades.Integracao cadastro />,
          },
          { path: '/onboarding', element: <Funcionalidades.Integracao /> },
          {
            element: <LayoutPublico />,
            children: [
              { path: '/', element: <Funcionalidades.PaginaInicial /> },
              { path: '/sobrenos', element: <Funcionalidades.SobreNos /> },
              { path: '/sobre-nos', element: <Funcionalidades.SobreNos /> },
              {
                path: '/sejaparceiro',
                element: <Funcionalidades.SejaParceiro />,
              },
              {
                path: '/cadastro-empresa',
                element: (
                  <Funcionalidades.EmpresaAcesso modoInicial='divisao' />
                ),
              },
              {
                path: '/empresa/acesso',
                element: (
                  <Funcionalidades.EmpresaAcesso modoInicial='divisao' />
                ),
              },
              {
                path: '/empresa/cadastro',
                element: (
                  <Navigate to='/login?modo=cadastro&perfil=empresa' replace />
                ),
              },
              {
                path: '/empresa/login',
                element: <Navigate to='/login' replace />,
              },
              {
                path: '/como-funciona',
                element: <Funcionalidades.AjudaSuporte visao='comoFunciona' />,
              },
              {
                path: '/ajuda',
                element: <Funcionalidades.AjudaSuporte visao='central' />,
              },
              {
                path: '/ajuda/faq',
                element: <Funcionalidades.AjudaSuporte visao='faq' />,
              },
              {
                path: '/ajuda/faq/:id',
                element: <Funcionalidades.AjudaSuporte visao='respostaFaq' />,
              },
              {
                path: '/ajuda/contato',
                element: <Funcionalidades.AjudaSuporte visao='contato' />,
              },
              {
                path: '/termos',
                element: <Funcionalidades.AjudaSuporte visao='termos' />,
              },
              {
                path: '/privacidade',
                element: <Funcionalidades.AjudaSuporte visao='privacidade' />,
              },
              {
                path: '/indice',
                element: <Funcionalidades.AjudaSuporte visao='indice' />,
              },
              {
                path: '/navegacao',
                element: <Funcionalidades.AjudaSuporte visao='indice' />,
              },
              {
                path: '/estados',
                element: <Funcionalidades.AjudaSuporte visao='estados' />,
              },
              {
                path: '/manutencao',
                element: <Funcionalidades.AjudaSuporte visao='manutencao' />,
              },
              {
                path: '/sem-conexao',
                element: <Funcionalidades.AjudaSuporte visao='offline' />,
              },
              {
                path: '/offline',
                element: <Funcionalidades.AjudaSuporte visao='offline' />,
              },
              {
                path: '/indisponivel',
                element: <Funcionalidades.AjudaSuporte visao='indisponivel' />,
              },
              {
                path: '/erro/indisponivel',
                element: <Funcionalidades.AjudaSuporte visao='indisponivel' />,
              },
              {
                path: '*',
                element: <Funcionalidades.AjudaSuporte visao='indisponivel' />,
              },
            ],
          },
        ],
      },
    ],
  },
]);

export default function AplicacaoRotas() {
  return <RouterProvider router={rotas} />;
}
