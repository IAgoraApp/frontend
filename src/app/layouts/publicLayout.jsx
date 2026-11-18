import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import LayoutAplicacao from './appLayout';
import './publicLayout.css';

export default function LayoutPublico(propriedades) {
  const { pathname } = useLocation();
  const referencia = useRef(null);

  useEffect(() => {
    if (
      !('IntersectionObserver' in window) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    )
      return;
    const observador = new IntersectionObserver(
      entradas => {
        for (const entrada of entradas) {
          if (!entrada.isIntersecting) continue;
          entrada.target.setAttribute('data-entrada-visivel', '');
          observador.unobserve(entrada.target);
        }
      },
      { threshold: 0.08 }
    );

    referencia.current
      ?.querySelectorAll(
        'main [data-entrada], main > section:not(:has([data-entrada]))'
      )
      .forEach(elemento => observador.observe(elemento));

    return () => observador.disconnect();
  }, [pathname]);

  return (
    <LayoutAplicacao
      {...propriedades}
      referencia={referencia}
      varianteCabecalho='publico'
      propriedadesCabecalho={{
        ...propriedades.propriedadesCabecalho,
        ...(pathname === '/sejaparceiro' && {
          acaoPrincipal: {
            rotulo: 'Cadastrar empresa',
            rota: '/empresa/cadastro',
          },
        }),
      }}
    />
  );
}
