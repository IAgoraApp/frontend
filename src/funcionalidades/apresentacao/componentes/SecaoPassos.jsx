import { useEffect, useRef } from 'react';
import { passosInicio } from '../conteudo';
import './SecaoPassos.css';

export default function SecaoPassos() {
  const secao = useRef(null);
  const quadro = useRef(0);
  useEffect(() => {
    const elemento = secao.current;
    const itens = [...elemento.querySelectorAll('[data-passo]')];
    let observador;

    if ('IntersectionObserver' in window) {
      observador = new IntersectionObserver(
        entradas => {
          entradas.forEach(entrada => {
            if (!entrada.isIntersecting) return;
            entrada.target.dataset.visivel = 'true';
            observador.unobserve(entrada.target);
          });
        },
        { threshold: 0.12 }
      );
      itens.forEach(item => {
        item.dataset.visivel = 'false';
        observador.observe(item);
      });
    } else {
      itens.forEach(item => {
        item.dataset.visivel = 'true';
      });
    }

    return () => {
      observador?.disconnect();
      cancelAnimationFrame(quadro.current);
    };
  }, []);

  const acompanharPonteiro = evento => {
    if (evento.pointerType !== 'mouse') return;
    const cartao = evento.currentTarget;
    const limites = cartao.parentElement.getBoundingClientRect();
    const x = Math.max(
      -0.5,
      Math.min(0.5, (evento.clientX - limites.left) / limites.width - 0.5)
    );
    const y = Math.max(
      -0.5,
      Math.min(0.5, (evento.clientY - limites.top) / limites.height - 0.5)
    );

    cancelAnimationFrame(quadro.current);
    quadro.current = requestAnimationFrame(() => {
      cartao.style.setProperty('--passos-giro-x', `${-y * 7}deg`);
      cartao.style.setProperty('--passos-giro-y', `${x * 7}deg`);
      cartao.style.setProperty('--passos-arte-x', `${x * 12}px`);
      cartao.style.setProperty('--passos-arte-y', `${y * 10}px`);
    });
  };

  const repousarCartao = evento => {
    cancelAnimationFrame(quadro.current);
    const cartao = evento.currentTarget;
    [
      '--passos-giro-x',
      '--passos-giro-y',
      '--passos-arte-x',
      '--passos-arte-y',
    ].forEach(propriedade => cartao.style.removeProperty(propriedade));
    delete cartao.dataset.pressionado;
  };

  return (
    <section
      ref={secao}
      id='como-funciona'
      aria-labelledby='titulo-passos'
      className='passos-landing'
    >
      <div className='passos-container'>
        <div className='passos-cabecalho'>
          <span className='passos-selo'>TRÊS PASSOS, UM NOVO COMEÇO</span>
          <h2 id='titulo-passos'>Da primeira chave ao seu dia a dia</h2>
        </div>

        <ol id='passos-visuais' role='list' className='passos-grade'>
          {passosInicio.map((passo, indice) => (
            <li
              key={passo.numero}
              data-passo={passo.numero}
              className='passos-revelacao'
              style={{ '--passos-ordem': indice }}
            >
              <article
                className='passos-cartao'
                onPointerMove={acompanharPonteiro}
                onPointerLeave={repousarCartao}
                onPointerDown={evento => {
                  evento.currentTarget.dataset.pressionado = 'true';
                }}
                onPointerUp={evento => {
                  delete evento.currentTarget.dataset.pressionado;
                }}
                onPointerCancel={repousarCartao}
              >
                <div className='passos-arte' aria-hidden='true'>
                  <img
                    src={passo.imagem}
                    alt=''
                    width='1280'
                    height='1280'
                    loading='lazy'
                    decoding='async'
                    draggable='false'
                  />
                </div>
                <h3>
                  {passo.numero} {passo.titulo}
                </h3>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
