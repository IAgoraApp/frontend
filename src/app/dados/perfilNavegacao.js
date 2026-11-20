import { createContext, useContext } from 'react';

const chaveUsuario = 'iagora:usuario-mvp-ativo';
let usuarioAtivo;

export function lerUsuarioMvpAtivo() {
  try {
    return Number(sessionStorage.getItem(chaveUsuario)) || usuarioAtivo;
  } catch {
    return usuarioAtivo;
  }
}

export function definirUsuarioMvpAtivo(usuario) {
  usuarioAtivo = usuario;
  try {
    sessionStorage.setItem(chaveUsuario, String(usuario));
  } catch {
    // Mantém o usuário ativo nesta página mesmo sem armazenamento.
  }
}

export const rotaPerfilMoradia = tipo => tipo === 2 ? '/perfil-b' : '/perfil';

export const ContextoPreparacao = createContext(false);
export const usePerfilPreparacao = () => useContext(ContextoPreparacao);
