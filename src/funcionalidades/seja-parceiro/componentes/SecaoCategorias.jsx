import { useEffect, useRef, useState } from 'react';
import { Container, CabecalhoSecao, Titulo } from '../../../compartilhado/indice';
import { categoriasDestaque } from '../conteudo';

export default function SecaoCategorias() {
  const referenciaTrilho = useRef(null);
  const [limites, setLimites] = useState({ noInicio: true, noFim: false });

  useEffect(() => {
    const trilho = referenciaTrilho.current;
    if (!trilho) return;
    function atualizarLimites() {
      setLimites({
        noInicio: trilho.scrollLeft <= 1,
        noFim: trilho.scrollLeft + trilho.clientWidth >= trilho.scrollWidth - 1,
      });
    }
    const observador = new ResizeObserver(atualizarLimites);
    observador.observe(trilho);
    trilho.addEventListener('scroll', atualizarLimites, { passive: true });
    return () => {
      observador.disconnect();
      trilho.removeEventListener('scroll', atualizarLimites);
    };
  }, []);

  function rolar(direcao) {
    const trilho = referenciaTrilho.current;
    if (!trilho) return;
    const cartao = trilho.querySelector('article');
    if (!cartao) return;
    const espaco = parseFloat(getComputedStyle(trilho).columnGap) || 20;
    trilho.scrollBy({
      left: direcao * (cartao.offsetWidth + espaco),
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'instant'
        : 'smooth',
    });
  }

  return (
    <section
      id='categorias'
      aria-labelledby='titulo-categorias'
      className='scroll-mt-6 bg-white'
    >
      <Container classe='py-[47.5px] lg:min-h-[435px]'>
        <div className='flex flex-wrap items-center justify-between gap-4'>
          <CabecalhoSecao
            id='titulo-categorias'
            sobretitulo='CATEGORIAS EM DESTAQUE'
            classe='min-w-[min(100%,20rem)] flex-1 lg:min-h-[72px]'
          >
            Encontre seu público em várias áreas.
          </CabecalhoSecao>
          <div className='flex shrink-0 items-center text-[22px] font-bold'>
            <button
              type='button'
              onClick={() => rolar(-1)}
              disabled={limites.noInicio}
              aria-label='Categorias anteriores'
              aria-controls='lista-categorias'
              className='flex size-11 cursor-pointer items-center justify-center rounded-lg text-(--laranja-principal) hover:bg-(--azul-fundo) disabled:cursor-default disabled:opacity-40'
            >
              ←
            </button>
            <button
              type='button'
              onClick={() => rolar(1)}
              disabled={limites.noFim}
              aria-label='Próximas categorias'
              aria-controls='lista-categorias'
              className='flex size-11 cursor-pointer items-center justify-center rounded-lg text-(--laranja-principal) hover:bg-(--azul-fundo) disabled:cursor-default disabled:opacity-40'
            >
              →
            </button>
          </div>
        </div>

        <div
          ref={referenciaTrilho}
          id='lista-categorias'
          className='mt-[22px] grid auto-cols-[min(80%,15.1875rem)] grid-flow-col gap-5 overflow-x-auto overscroll-x-contain scroll-smooth snap-x snap-mandatory [scrollbar-width:none] lg:auto-cols-[calc((100%-5rem)/5)] motion-reduce:scroll-auto [&::-webkit-scrollbar]:hidden'
        >
          {categoriasDestaque.map(categoria => (
            <article
              key={categoria.id}
              className='flex min-w-0 snap-start flex-col gap-3 lg:min-h-[246px]'
            >
              <img
                src={categoria.imagem}
                alt={categoria.titulo}
                width='243'
                height='126'
                className='aspect-[243/126] w-full rounded-lg object-cover'
              />
              <Titulo
                como='h3'
                classe='font-corpo! text-2xl leading-[31px] font-bold text-(--azul-titulo)'
              >
                {categoria.titulo}
              </Titulo>
              <p className='text-[17px] leading-snug text-(--texto-secundario)'>
                {categoria.descricao}
              </p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
