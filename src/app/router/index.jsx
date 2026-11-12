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
              { path: '/home', element: <Funcionalidades.Inicio /> },
              {
                element: <LayoutCasa />,
                children: [
                  { path: '/casa', element: <Funcionalidades.Casa /> },
                  { path: '/limpeza', element: <Funcionalidades.Limpeza /> },
                  { path: '/cozinha', element: <Funcionalidades.Cozinha /> },
                ],
              },
              { path: '/rotina', element: <Funcionalidades.Rotina /> },
              { path: '/financas', element: <Funcionalidades.Financas /> },
              {
                path: '/calculadoras',
                element: <Funcionalidades.Calculadoras />,
              },
              {
                path: '/calculadoras/:tipo',
                element: <Funcionalidades.Calculadoras />,
              },
              { path: '/perfil', element: <Funcionalidades.Perfil /> },
              {
                path: '/checklists',
                element: <Funcionalidades.AjudaSuporte visao='checklists' />,
              },
              {
                path: '/seguranca',
                element: <Funcionalidades.AjudaSuporte visao='seguranca' />,
              },
              {
                path: '/notificacoes',
                element: <Funcionalidades.AjudaSuporte visao='notificacoes' />,
              },
              {
                path: '/marketplace',
                element: <Funcionalidades.MercadoServicos visao='hub' />,
              },
              {
                path: '/buscar',
                element: <Funcionalidades.MercadoServicos visao='buscar' />,
              },
              {
                path: '/buscar/mapa',
                element: <Funcionalidades.MercadoServicos visao='mapa' />,
              },
              {
                path: '/marketplace/filtros',
                element: <Funcionalidades.MercadoServicos visao='filtros' />,
              },
              {
                path: '/categoria/:slug',
                element: <Funcionalidades.MercadoServicos visao='categoria' />,
              },
              {
                path: '/categorias/:slug',
                element: <Funcionalidades.MercadoServicos visao='categoria' />,
              },
              {
                path: '/servicos/indisponivel',
                element: (
                  <Funcionalidades.MercadoServicos visao='indisponivel' />
                ),
              },
              {
                path: '/servicos/:id',
                element: <Funcionalidades.MercadoServicos visao='servico' />,
              },
              {
                path: '/servicos/:id/avaliacoes',
                element: <Funcionalidades.MercadoServicos visao='avaliacoes' />,
              },
              {
                path: '/servicos/:id/contato',
                element: <Funcionalidades.MercadoServicos visao='contato' />,
              },
              {
                path: '/empresas/:id',
                element: <Funcionalidades.MercadoServicos visao='perfil' />,
              },
              {
                path: '/favoritos',
                element: <Funcionalidades.MercadoServicos visao='favoritos' />,
              },
              {
                path: '/meus-contatos',
                element: <Funcionalidades.MercadoServicos visao='contatos' />,
              },
              {
                path: '/meus-contatos/:id',
                element: <Funcionalidades.MercadoServicos visao='contatos' />,
              },
            ],
          },
          {
            element: <LayoutUsuario tipoUsuario='consumidorB' />,
            children: [
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
                element: <Navigate to='/planejamento' replace />,
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
              { path: '/perfil-b', element: <Funcionalidades.Perfil /> },
            ],
          },
          {
            element: <LayoutEmpresas />,
            children: [
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
                element: <Funcionalidades.Empresa visao='perfil' />,
              },
              {
                path: '/perfil-empresa',
                element: <Funcionalidades.Empresa visao='perfil' />,
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
                element: (
                  <Funcionalidades.MercadoServicos
                    dentroDaEmpresa
                    visao='hub'
                  />
                ),
              },
              {
                path: '/empresa/buscar',
                element: (
                  <Funcionalidades.MercadoServicos
                    dentroDaEmpresa
                    visao='buscar'
                  />
                ),
              },
            ],
          },
        ],
      },
      {
        element: <RotaPublica />,
        children: [
          { path: '/login', element: <Funcionalidades.Autenticacao /> },
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
                  <Funcionalidades.EmpresaAcesso modoInicial='cadastro' />
                ),
              },
              {
                path: '/empresa/login',
                element: <Funcionalidades.EmpresaAcesso modoInicial='login' />,
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
