import { useLayoutEffect, useRef } from 'react';

export function useAlturaDisponivel() {
  const referencia = useRef(null);

  useLayoutEffect(() => {
    const elemento = referencia.current;
    if (!elemento) return;
    const cabecalho =
      elemento.closest('[data-layout-aplicacao]')?.querySelector(':scope > header') ??
      elemento.previousElementSibling;
    const atualizar = () => {
      const altura = window.visualViewport?.height ?? window.innerHeight;
      const topo = elemento.getBoundingClientRect().top + window.scrollY;
      elemento.style.setProperty(
        '--altura-rotina',
        `${Math.max(480, Math.floor(altura - topo))}px`
      );
    };
    const observador = new ResizeObserver(atualizar);
    if (cabecalho) observador.observe(cabecalho);
    window.addEventListener('resize', atualizar);
    window.visualViewport?.addEventListener('resize', atualizar);
    document.fonts?.ready.then(atualizar);
    atualizar();
    return () => {
      observador.disconnect();
      window.removeEventListener('resize', atualizar);
      window.visualViewport?.removeEventListener('resize', atualizar);
    };
  }, []);

  return referencia;
}
