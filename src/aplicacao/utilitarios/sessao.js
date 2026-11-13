const CHAVE_SESSAO = 'iagora:sessao-demo:v1';
const CHAVE_PERFIL = 'iagora:sessao-demo:perfil';
let sessaoEmMemoria = false;
let perfilEmMemoria = 'pessoal';

// A sessão só controla a passagem pelo acesso do MVP, sem validar credenciais.
export function temSessao() {
  try {
    return sessaoEmMemoria || sessionStorage.getItem(CHAVE_SESSAO) === 'ativa';
  } catch {
    return sessaoEmMemoria;
  }
}

export function perfilDaSessao() {
  try {
    return sessionStorage.getItem(CHAVE_PERFIL) === 'empresa' ? 'empresa' : perfilEmMemoria;
  } catch {
    return perfilEmMemoria;
  }
}

export function inicioDaSessao(momento) {
  if (perfilDaSessao() === 'empresa') return '/empresa';
  return momento === 'preparacao' ? '/home-b' : '/home';
}

export function perfilDaRota(caminho) {
  return /^\/(empresa(?:[/?#]|$)|dashboard(?:[/?#]|$)|meus-servicos(?:[/?#]|$)|anunciar-servico(?:[/?#]|$)|perfil-empresa(?:[/?#]|$)|contatos(?:[/?#]|$))/i.test(caminho)
    ? 'empresa'
    : 'pessoal';
}

export function destinoAposAcesso(destino, padrao, perfil = 'pessoal') {
  const interno = destinoInterno(destino, padrao);
  return perfilDaRota(interno) === perfil ? interno : padrao;
}

export function iniciarSessao(perfil = 'pessoal') {
  sessaoEmMemoria = true;
  perfilEmMemoria = perfil === 'empresa' ? 'empresa' : 'pessoal';
  try {
    sessionStorage.setItem(CHAVE_SESSAO, 'ativa');
    sessionStorage.setItem(CHAVE_PERFIL, perfilEmMemoria);
  } catch {
    // Ainda permite navegar quando o armazenamento estiver indisponível.
  }
}

export function encerrarSessao() {
  sessaoEmMemoria = false;
  perfilEmMemoria = 'pessoal';
  try {
    sessionStorage.removeItem(CHAVE_SESSAO);
    sessionStorage.removeItem(CHAVE_PERFIL);
  } catch {
    // O estado em memória já foi encerrado.
  }
}

export function destinoInterno(destino, padrao) {
  return typeof destino === 'string' &&
    destino.startsWith('/') &&
    !destino.startsWith('//') &&
    !/[\\\s]/.test(destino) &&
    ![...destino].some(caractere => caractere.charCodeAt(0) < 32)
    ? destino
    : padrao;
}
