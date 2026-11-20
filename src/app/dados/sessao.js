import { useSyncExternalStore } from 'react';

const chaveSessao = 'iagora:sessao:v1';

function lerArmazenamento() {
  try {
    const sessao = JSON.parse(sessionStorage.getItem(chaveSessao));
    return sessao?.token &&
      Number.isInteger(sessao.id) &&
      [1, 2].includes(sessao.tipo)
      ? sessao
      : null;
  } catch {
    return null;
  }
}

let sessaoAtual = lerArmazenamento();
const ouvintes = new Set();

export const lerSessao = () => sessaoAtual;

function publicar(sessao) {
  sessaoAtual = sessao;
  ouvintes.forEach(ouvir => ouvir());
}

export function salvarSessao(sessao) {
  if (
    !sessao?.token ||
    !Number.isInteger(sessao.id) ||
    ![1, 2].includes(sessao.tipo)
  )
    throw new Error('O servidor não retornou uma sessão válida.');
  sessionStorage.setItem(chaveSessao, JSON.stringify(sessao));
  publicar(sessao);
}

export function encerrarSessao() {
  sessionStorage.removeItem(chaveSessao);
  publicar(null);
}

function inscrever(ouvir) {
  ouvintes.add(ouvir);
  return () => ouvintes.delete(ouvir);
}

export function useSessao() {
  return useSyncExternalStore(inscrever, lerSessao);
}
