import { useEffect, useRef } from 'react';

export default function ColagemEditorial({ largura, altura, children }) {
  const referencia = useRef(null);
  useEffect(() => {
    const elemento = referencia.current;
    if (!elemento) return;
    const ajustar = () =>
      elemento.style.setProperty(
        '--escala-colagem',
        String(elemento.clientWidth / largura)
      );
    ajustar();
    const observador = new ResizeObserver(ajustar);
    observador.observe(elemento);
    const animacoes = [];
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      elemento
        .querySelectorAll('[data-movimento-editorial]')
        .forEach((no, indice) =>
          animacoes.push(
            no.animate(
              [
                { opacity: 0, translate: '0 16px', offset: 0 },
                { opacity: 0, translate: '0 16px', offset: 0.08 },
                { opacity: 1, translate: '0 0', offset: 0.37 },
                { opacity: 1, translate: '0 0', offset: 1 },
              ],
              {
                duration: 2000,
                delay: indice * 120,
                easing: 'ease-out',
                fill: 'backwards',
              }
            )
          )
        );
    }
    return () => {
      observador.disconnect();
      animacoes.forEach(animacao => animacao.cancel());
    };
  }, [largura]);

  return (
    <div
      ref={referencia}
      aria-hidden='true'
      className='relative mx-auto w-full'
      style={{ maxWidth: largura, aspectRatio: `${largura}/${altura}` }}
    >
      <div
        className='absolute top-0 left-0 origin-top-left scale-(--escala-colagem)'
        style={{ width: largura, height: altura }}
      >
        {children}
      </div>
    </div>
  );
}
