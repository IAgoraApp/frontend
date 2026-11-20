import { createContext, useContext } from 'react';

export const ContextoServidor = createContext(null);
export const useDadosServidor = () => useContext(ContextoServidor);
