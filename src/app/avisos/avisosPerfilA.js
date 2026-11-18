import { createContext, useContext } from 'react';

export const AvisosPerfilA = createContext(null);
const ignorar = () => {};

export function useAvisoPerfilA() {
  return useContext(AvisosPerfilA) ?? ignorar;
}
