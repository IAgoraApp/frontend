import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export function rotaPessoalDoMomento(caminho, momento) {
  const base = caminho.replace(/\/$/, '');
  const preparacao = momento === 'preparacao';
  if (base === '/home' || base === '/home-b') return preparacao ? '/home-b' : '/home';
  if (base === '/perfil' || base === '/perfil-b') return preparacao ? '/perfil-b' : '/perfil';
  return caminho;
}

export function tipoUsuarioDaRota(caminho, momento, padrao = 'consumidorA') {
  if (/^\/(home|perfil)(?:\/|$)/.test(caminho)) return 'consumidorA';
  if (/^\/(home-b|minhajornada|planejamento|aprendendo|encontrar-casa|perfil-b)(?:\/|$)/.test(caminho)) {
    return 'consumidorB';
  }
  return momento === 'preparacao' ? 'consumidorB' : padrao;
}

export function destinoMercado(destino, caminhoAtual) {
  if (!caminhoAtual.startsWith('/empresa/')) return destino;
  if (typeof destino === 'object' && destino !== null) {
    return {
      ...destino,
      pathname: destinoMercado(destino.pathname, caminhoAtual),
    };
  }
  return typeof destino === 'string' &&
    /^\/(marketplace|buscar|categoria|categorias|servicos|empresas|favoritos|meus-contatos)(?:[/?#]|$)/.test(
      destino
    )
    ? `/empresa${destino}`
    : destino;
}

export function useNavegacaoMercado() {
  const navegar = useNavigate();
  const { pathname } = useLocation();
  return useCallback(
    (destino, opcoes) => navegar(destinoMercado(destino, pathname), opcoes),
    [navegar, pathname]
  );
}
