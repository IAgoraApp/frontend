import { useSyncExternalStore } from 'react';

const consulta = '(width < 768px), (height < 700px)';
const inscrever = retorno => {
  const midia = window.matchMedia(consulta);
  midia.addEventListener('change', retorno);
  return () => midia.removeEventListener('change', retorno);
};

export function useEspacoCompacto() {
  return useSyncExternalStore(
    inscrever,
    () => window.matchMedia(consulta).matches,
    () => false
  );
}
