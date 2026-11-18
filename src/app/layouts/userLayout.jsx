import { acessoLocal } from '../dados/acessoLocal';
import { useEffect } from 'react';
import { ContextoPreparacao, lerUsuarioMvpAtivo, rotaPerfilMoradia } from '../dados/perfilNavegacao';
import { useBancoMvp } from '../dados/bancoMvp';
import { Navigate, useLocation } from 'react-router-dom';
import { lerSessao } from '../dados/contaApi';
import ProvedorAvisosPerfilA from '../avisos/provedorAvisosPerfilA';
import LayoutAplicacao from './appLayout';

const rotasCompartilhadas = /^\/(rotina|checklists|casa|limpeza|cozinha|despensa|marketplace|buscar|categoria|categorias|servicos|empresas|servicos-contratados|meus-contatos|favoritos)(\/|$)/;
const rotasPreparacao = new Set([
  '/home-b', '/minhajornada', '/financas-b', '/planejamento',
  '/aprendendo', '/encontrar-casa', '/perfil-b', '/ia-b',
]);

const chaveNavegacao = 'iagora:perfil-navegacao';
function acessoPreparacaoCompartilhado() {
  try {
    return sessionStorage.getItem(chaveNavegacao) === 'preparacao';
  } catch {
    return false;
  }
}

export default function LayoutUsuario({
  tipoUsuario = 'consumidorA',
  propriedadesCabecalho,
  ...propriedades
}) {
  const { pathname, search, hash } = useLocation();
  const caminho = pathname.toLowerCase().replace(/\/$/, '');
  const sessao = lerSessao();
  const usuarioAtivo = acessoLocal ? lerUsuarioMvpAtivo() : undefined;
  const { perfil } = useBancoMvp(usuarioAtivo);
  const momento = acessoLocal
    ? (usuarioAtivo ? perfil?.tipo : undefined)
    : sessao?.momentoMoradia;
  const compartilhada = rotasCompartilhadas.test(pathname);
  const preparacao = momento
    ? momento === 2
    : rotasPreparacao.has(caminho) || (compartilhada && acessoPreparacaoCompartilhado());
  useEffect(() => {
    if (compartilhada) return;
    try {
      sessionStorage.setItem(chaveNavegacao, preparacao ? 'preparacao' : 'moradia');
    } catch {
      // O navegador pode bloquear armazenamento de sessão.
    }
  }, [compartilhada, preparacao]);

  if (!acessoLocal && sessao?.tipo === 2)
    return <Navigate to='/empresa/perfil' replace />;

  let destino;
  if (momento) {
    if (caminho === '/perfil' || caminho === '/perfil-b')
      destino = rotaPerfilMoradia(momento);
    if (caminho === '/home' || caminho === '/home-b')
      destino = preparacao ? '/home-b' : '/home';
    if (caminho === '/financas' || caminho === '/financas-b')
      destino = preparacao ? '/financas-b' : '/financas';
  }
  const layout = (
    <LayoutAplicacao
      {...propriedades}
      varianteCabecalho='usuario'
      propriedadesCabecalho={{ ...propriedadesCabecalho, tipoUsuario: preparacao ? 'consumidorB' : tipoUsuario }}
    />
  );
  return (
    <ContextoPreparacao.Provider value={preparacao}>
      <ProvedorAvisosPerfilA>
        {destino && destino !== caminho
          ? <Navigate to={destino + search + hash} replace />
          : layout}
      </ProvedorAvisosPerfilA>
    </ContextoPreparacao.Provider>
  );
}
