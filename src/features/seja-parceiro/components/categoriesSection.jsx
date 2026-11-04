import { useEffect, useRef, useState } from 'react';
import { Container, SectionHeading, Title } from '../../../shared/ui';
import { categories } from '../content';

export default function CategoriesSection() {
  const trackRef = useRef(null);
  const [bounds, setBounds] = useState({ atStart: true, atEnd: false });

  useEffect(() => {
    const track = trackRef.current;
    function updateBounds() {
      setBounds({
        atStart: track.scrollLeft <= 1,
        atEnd: track.scrollLeft + track.clientWidth >= track.scrollWidth - 1,
      });
    }
    const observer = new ResizeObserver(updateBounds);
    observer.observe(track);
    track.addEventListener('scroll', updateBounds, { passive: true });
    return () => {
      observer.disconnect();
      track.removeEventListener('scroll', updateBounds);
    };
  }, []);

  function scroll(direction) {
    const track = trackRef.current;
    const card = track.querySelector('article');
    const gap = parseFloat(getComputedStyle(track).columnGap);
    track.scrollBy({
      left: direction * (card.offsetWidth + gap),
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'instant'
        : 'smooth',
    });
  }

  return (
    <section
      id='categorias'
      aria-labelledby='categorias-title'
      className='scroll-mt-6 bg-white'
    >
      <Container className='py-[47.5px] lg:min-h-[435px]'>
        <div className='flex flex-wrap items-center justify-between gap-4'>
          <SectionHeading
            id='categorias-title'
            eyebrow='CATEGORIAS EM DESTAQUE'
            className='min-w-[min(100%,20rem)] flex-1 lg:min-h-[72px]'
          >
            Encontre seu público em várias áreas.
          </SectionHeading>
          <div className='flex shrink-0 items-center text-[22px] font-bold'>
            <button
              type='button'
              onClick={() => scroll(-1)}
              disabled={bounds.atStart}
              aria-label='Categorias anteriores'
              aria-controls='categorias-lista'
              className='flex size-11 cursor-pointer items-center justify-center text-(--laranja-principal) hover:bg-(--azul-fundo) disabled:cursor-default'
            >
              ←
            </button>
            <button
              type='button'
              onClick={() => scroll(1)}
              disabled={bounds.atEnd}
              aria-label='Próximas categorias'
              aria-controls='categorias-lista'
              className='flex size-11 cursor-pointer items-center justify-center text-[#deadad] hover:bg-(--azul-fundo) enabled:hover:text-(--laranja-principal) disabled:cursor-default'
            >
              →
            </button>
          </div>
        </div>
        <div
          ref={trackRef}
          id='categorias-lista'
          className='mt-[22px] grid auto-cols-[min(80%,15.1875rem)] grid-flow-col gap-5 overflow-x-auto overscroll-x-contain scroll-smooth snap-x snap-mandatory [scrollbar-width:none] lg:auto-cols-[calc((100%-5rem)/5)] motion-reduce:scroll-auto [&::-webkit-scrollbar]:hidden'
        >
          {categories.map(category => (
            <article
              key={category.id}
              className='flex min-w-0 snap-start flex-col gap-4 lg:min-h-[246px]'
            >
              <img
                src={category.image}
                alt=''
                width='243'
                height='126'
                className='aspect-[243/126] w-full rounded object-cover'
              />
              <Title
                as='h3'
                className='font-body! text-2xl leading-[31px] font-bold text-(--azul-titulo)'
              >
                {category.title}
              </Title>
              <p className='text-[18px] leading-snug text-(--texto-apoio) lg:leading-4'>
                {category.description}
              </p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
