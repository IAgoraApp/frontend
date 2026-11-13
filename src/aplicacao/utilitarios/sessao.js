const CHAVE_SESSAO = 'iagora:sessao-demo:v1';
const CHAVE_PERFIL = 'iagora:sessao-demo:perfil';
const CHAVE_ONBOARDING = 'iagora:sessao-demo:onboarding';
let onboardingEmMemoria = false;
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
  if (onboardingPendente()) return '/onboarding';
  return momento === 'preparacao' ? '/home-b' : '/home';
}

export function onboardingPendente() {
  if (!temSessao() || perfilDaSessao() !== 'pessoal') return false;
  try {
    return !(onboardingEmMemoria || sessionStorage.getItem(CHAVE_ONBOARDING) === 'concluido');
  } catch {
    return !onboardingEmMemoria;
  }
}

export function concluirOnboarding() {
  if (!temSessao() || perfilDaSessao() !== 'pessoal') return;
  onboardingEmMemoria = true;
  try {
    sessionStorage.setItem(CHAVE_ONBOARDING, 'concluido');
  } catch {
    // Mantém a confirmação nesta sessão quando o armazenamento não está disponível.
  }
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
  onboardingEmMemoria = false;
  sessaoEmMemoria = true;
  perfilEmMemoria = perfil === 'empresa' ? 'empresa' : 'pessoal';
  try {
    sessionStorage.setItem(CHAVE_SESSAO, 'ativa');
    sessionStorage.setItem(CHAVE_PERFIL, perfilEmMemoria);
    sessionStorage.removeItem(CHAVE_ONBOARDING);
  } catch {
    // Ainda permite navegar quando o armazenamento estiver indisponível.
  }
}

export function encerrarSessao() {
  onboardingEmMemoria = false;
  sessaoEmMemoria = false;
  perfilEmMemoria = 'pessoal';
  try {
    sessionStorage.removeItem(CHAVE_SESSAO);
    sessionStorage.removeItem(CHAVE_PERFIL);
    sessionStorage.removeItem(CHAVE_ONBOARDING);
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
