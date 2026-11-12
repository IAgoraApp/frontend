import { useLayoutEffect, useRef } from 'react';

export function ArteResponsiva({
  largura,
  altura,
  children,
  classe = '',
  ...propriedades
}) {
  const referenciaEnvoltorio = useRef(null);
  const referenciaTela = useRef(null);

  useLayoutEffect(() => {
    const envoltorio = referenciaEnvoltorio.current;
    const tela = referenciaTela.current;
    if (!envoltorio || !tela) return;
    function redimensionar() {
      tela.style.setProperty(
        '--escala-arte',
        String(envoltorio.clientWidth / largura)
      );
    }
    const observador = new ResizeObserver(redimensionar);
    observador.observe(envoltorio);
    redimensionar();
    return () => observador.disconnect();
  }, [largura]);

  return (
    <div
      ref={referenciaEnvoltorio}
      className={`relative w-full overflow-hidden ${classe}`}
      style={{ aspectRatio: `${largura} / ${altura}` }}
      {...propriedades}
    >
      <div
        ref={referenciaTela}
        className='absolute top-0 left-0 origin-top-left scale-(--escala-arte) [--escala-arte:1]'
        style={{ width: largura, height: altura }}
      >
        {children}
      </div>
    </div>
  );
}
