import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Botao, Container, Rodape } from '../../shared/index';
import fotoHeroSobreNos from './assets/casa.jpg';
import fotoEquipeCompleta from './assets/imgGrupo.png';
import fotoMissao from './assets/nossa-missao.jpg';
import fotoVisao from './assets/nossa-visao.jpg';
import { membrosEquipe, tecnologiasEquipe, valoresEquipe } from './content';

const propositos = [
  {
    titulo: 'Nossa missão',
    descricao:
      'Apoiar quem está conquistando sua independência com ferramentas práticas para planejar a mudança e cuidar da casa.',
    foto: fotoMissao,
  },
  {
    titulo: 'Nossa visão',
    descricao:
      'Ser a referência para quem quer morar por conta própria e viver essa fase com mais confiança e tranquilidade.',
    foto: fotoVisao,
  },
];

export function SobreNos() {
  return (
    <>
      <main className='bg-white text-(--azul-titulo)'>
        <section
          aria-labelledby='titulo-sobre'
          className='bg-(--azul-fundo) py-9 sm:py-14'
        >
          <Container classe='grid items-center gap-7 md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-12'>
            <div data-entrada='' className='grid justify-items-start gap-4'>
              <p className='text-sm font-bold text-(--laranja-principal)'>
                Sobre nós
              </p>
              <h1
                id='titulo-sobre'
                className='max-w-[15ch] text-[clamp(2.6rem,5vw,4.7rem)] leading-[0.99] font-extrabold tracking-[-0.045em]'
              >
                A vida no seu canto começa aqui
              </h1>
              <p className='max-w-[46ch] text-base leading-relaxed text-(--texto-apoio) sm:text-lg'>
                Criamos o IAgora para ajudar você a sair de casa com um plano e
                cuidar da rotina com mais autonomia.
              </p>
              <Botao como={Link} to='/login'>
                Acessar plataforma
              </Botao>
            </div>
            <figure data-entrada='' className='overflow-hidden'>
              <img
                src={fotoHeroSobreNos}
                alt='Studio mobiliado com sala e cozinha integradas'
                className='aspect-[16/10] w-full object-cover'
              />
            </figure>
          </Container>
        </section>

        <section
          aria-labelledby='titulo-proposito'
          className='bg-(--azul-titulo) py-8 text-white sm:py-12'
        >
          <Container>
            <h2
              id='titulo-proposito'
              data-entrada=''
              className='mb-5 text-3xl font-extrabold tracking-tight sm:text-4xl'
            >
              Por que o IAgora existe
            </h2>
            <div className='grid gap-4 md:grid-cols-2'>
              {propositos.map(({ titulo, descricao, foto }) => (
                <article
                  key={titulo}
                  data-entrada=''
                  className='grid grid-cols-[minmax(80px,0.55fr)_minmax(0,1fr)] overflow-hidden rounded-xl bg-white text-(--azul-titulo)'
                >
                  <img
                    src={foto}
                    alt=''
                    loading='lazy'
                    className='size-full min-h-32 object-cover'
                  />
                  <div className='grid content-center gap-2 p-3 sm:p-5'>
                    <h3 className='text-xl font-extrabold'>{titulo}</h3>
                    <p className='text-sm leading-relaxed text-(--texto-apoio) sm:text-base'>
                      {descricao}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </Container>
        </section>

        <section aria-labelledby='titulo-valores' className='py-8 sm:py-12'>
          <Container>
            <h2
              id='titulo-valores'
              data-entrada=''
              className='mb-4 text-3xl font-extrabold tracking-tight sm:text-4xl'
            >
              O que guia nossas escolhas
            </h2>
            <ul className='grid gap-px overflow-hidden rounded-xl border border-(--borda-suave) bg-(--borda-suave) md:grid-cols-3'>
              {valoresEquipe.map(({ titulo, descricao, icone }) => (
                <li
                  key={titulo}
                  data-entrada=''
                  className='grid grid-cols-[auto_1fr] items-start gap-x-3 bg-white p-4 sm:p-5'
                >
                  <img
                    src={icone}
                    alt=''
                    className='row-span-2 size-8 object-contain'
                  />
                  <h3 className='text-xl font-extrabold'>{titulo}</h3>
                  <p className='text-sm text-(--texto-apoio) sm:text-base'>
                    {descricao}
                  </p>
                </li>
              ))}
            </ul>
          </Container>
        </section>

        <section
          aria-labelledby='titulo-equipe'
          className='bg-(--azul-fundo) py-8 sm:py-12'
        >
          <Container>
            <h2
              id='titulo-equipe'
              data-entrada=''
              className='mb-4 text-3xl font-extrabold tracking-tight sm:text-4xl'
            >
              Quem faz o IAgora
            </h2>
            <div className='grid items-stretch gap-3 xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]'>
              <div
                data-entrada=''
                className='relative aspect-[16/10] min-w-0 overflow-hidden xl:aspect-auto'
              >
                <img
                  src={fotoEquipeCompleta}
                  alt='Equipe do IAgora reunida'
                  loading='lazy'
                  className='absolute inset-0 size-full object-cover object-[center_30%]'
                />
              </div>
              <ul className='grid gap-2 sm:grid-cols-2'>
                {membrosEquipe.map(({ id, nome, cargo, foto, github }) => (
                  <li key={id} data-entrada='' className='min-w-0'>
                    <a
                      href={github}
                      target='_blank'
                      rel='noreferrer'
                      aria-label={`GitHub de ${nome}`}
                      className='flex h-full items-center gap-3 rounded-xl border border-(--borda-suave) bg-white p-3 hover:border-(--azul-principal) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--azul-principal)'
                    >
                      <img
                        src={foto}
                        alt=''
                        loading='lazy'
                        className='size-12 shrink-0 rounded-full object-cover object-top'
                      />
                      <div className='min-w-0 flex-1'>
                        <h3 className='text-base font-extrabold break-words'>
                          {nome}
                        </h3>
                        <p className='text-xs leading-relaxed text-(--texto-apoio)'>
                          {cargo}
                        </p>
                      </div>
                      <ArrowUpRight
                        size={15}
                        className='shrink-0'
                        aria-hidden='true'
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <ul
              data-entrada=''
              aria-label='Tecnologias do projeto'
              className='mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-(--borda-suave) pt-4'
            >
              {tecnologiasEquipe.map(({ nome, icone }) => (
                <li
                  key={nome}
                  className='flex items-center gap-2 text-xs font-bold text-(--texto-apoio)'
                >
                  <img src={icone} alt='' className='size-5 object-contain' />{' '}
                  {nome}
                </li>
              ))}
            </ul>
          </Container>
        </section>
      </main>
      <Rodape />
    </>
  );
}
