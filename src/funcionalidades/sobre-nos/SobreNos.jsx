import { useState } from 'react';
import { Container, Rodape } from '../../compartilhado/indice';
import fotoHeroSobreNos from '../../ativos/imagens/fotografias/apartamento-referencia.jpg';
import fotoEquipeCompleta from '../../ativos/imagens/equipe/equipe-completa.png';
import fotoMissao from '../../ativos/imagens/fotografias/nossa-missao.jpg';
import fotoVisao from '../../ativos/imagens/fotografias/nossa-visao.jpg';
import iconeGithub from '../../ativos/vetores/sobre-nos/github.svg';
import { membrosEquipe, tecnologiasEquipe, valoresEquipe } from './conteudo';

export function SobreNos() {
  const [membroAtivoId, setMembroAtivoId] = useState(membrosEquipe[0].id);
  const membroSelecionado =
    membrosEquipe.find(membro => membro.id === membroAtivoId) ??
    membrosEquipe[0];

  return (
    <>
      <main className='bg-white text-(--azul-titulo)'>
        <section className='relative flex min-h-[620px] items-center overflow-hidden py-16 lg:min-h-[740px] lg:py-24'>
          <img
            src={fotoHeroSobreNos}
            alt='Studio compacto mobiliado que representa o conceito do IAgora'
            className='absolute inset-0 size-full object-cover'
          />
          <div className='absolute inset-0 bg-[#102a43]/18' />

          <Container classe='relative z-10'>
            <div className='max-w-[710px] rounded-[20px] bg-white/88 p-8 shadow-lg backdrop-blur-xs sm:p-10 lg:p-12'>
              <h1 className='font-titulo text-[clamp(2rem,3.5vw,2.75rem)] leading-tight font-extrabold text-(--laranja-destaque)'>
                Sobre Nós
              </h1>
              <div className='mt-6 space-y-5 text-lg leading-relaxed text-[#14213b] sm:text-xl lg:text-2xl'>
                <p>
                  Morar sozinho ficou mais fácil com o{' '}
                  <span className='font-bold text-(--laranja-principal)'>
                    I Agora
                  </span>
                  !
                </p>
                <p>
                  Reunimos em um só lugar tudo o que você precisa para dar os
                  primeiros passos na vida independente: calculadoras,
                  checklists, guias práticos, dicas de segurança e ajuda para
                  encontrar profissionais. Menos complicação, mais autonomia.
                </p>
                <p className='font-medium'>
                  Sua vida independente começa aqui!
                </p>
              </div>
            </div>
          </Container>
        </section>

        <section className='py-16 lg:py-24'>
          <Container>
            <div className='flex flex-col items-center text-center'>
              <h2 className='font-titulo text-[clamp(2rem,3.2vw,2.75rem)] font-extrabold text-(--azul-titulo)'>
                Conheça nossa Equipe
              </h2>

              <div className='relative mt-10 w-full max-w-[1000px] px-4 py-8 sm:px-10 sm:py-10'>
                <div
                  aria-hidden='true'
                  className='absolute inset-x-4 inset-y-8 -rotate-[7deg] rounded-[20px] bg-(--azul-profundo) sm:inset-x-10'
                />
                <img
                  src={fotoEquipeCompleta}
                  alt='Equipe completa do projeto IAgora reunida'
                  className='relative z-10 aspect-[16/10] w-full rounded-[20px] object-cover object-[center_22%] shadow-[0_14px_30px_rgba(0,0,0,0.22)]'
                />
              </div>
            </div>

            <div className='mx-auto mt-16 grid max-w-[1160px] items-center gap-10 lg:grid-cols-[400px_minmax(0,1fr)] lg:gap-14'>
              <div className='flex flex-col gap-4'>
                {membrosEquipe.map(membro => {
                  const ativo = membro.id === membroSelecionado.id;
                  return (
                    <div
                      key={membro.id}
                      className={`overflow-hidden rounded-[20px] transition-all ${
                        ativo
                          ? 'bg-[#e6eaef] p-6 ring-2 ring-(--azul-escuro)'
                          : 'bg-[#d9d8d8] hover:bg-[#cfd4da]'
                      }`}
                    >
                      <button
                        type='button'
                        aria-pressed={ativo}
                        onClick={() => setMembroAtivoId(membro.id)}
                        className={`w-full cursor-pointer text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--laranja-principal) ${
                          ativo ? 'p-0' : 'px-6 py-4 text-center'
                        }`}
                      >
                        <span
                          className={`font-titulo block font-extrabold text-(--azul-escuro) ${
                            ativo
                              ? 'text-2xl sm:text-3xl'
                              : 'text-xl sm:text-2xl'
                          }`}
                        >
                          {membro.nome}
                        </span>
                      </button>

                      {ativo && (
                        <div className='mt-3 flex flex-col gap-3'>
                          <p className='text-sm font-bold tracking-wide text-[#244382] uppercase sm:text-base'>
                            {membro.cargo}
                          </p>
                          <div className='flex items-center gap-3'>
                            <a
                              href={membro.github}
                              target='_blank'
                              rel='noopener noreferrer'
                              aria-label={`GitHub de ${membro.nome}`}
                              className='inline-flex size-9 items-center justify-center rounded-lg transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--laranja-principal)'
                            >
                              <img
                                src={iconeGithub}
                                alt=''
                                className='size-7 object-contain'
                              />
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className='mx-auto w-full max-w-[586px] overflow-hidden rounded-[18px] border-[5px] border-(--azul-escuro) bg-white shadow-sm'>
                <div className='aspect-[586/560] w-full overflow-hidden bg-(--azul-fundo)'>
                  <img
                    src={membroSelecionado.foto}
                    alt={`Foto de ${membroSelecionado.nome}`}
                    className='size-full object-cover object-top'
                  />
                </div>
                <div className='grid grid-cols-4 gap-3 border-t border-(--borda-suave) bg-white px-4 py-6 sm:gap-6 sm:px-8 sm:py-8'>
                  {tecnologiasEquipe.map(tecnologia => (
                    <div
                      key={tecnologia.nome}
                      className='flex flex-col items-center justify-center gap-2.5 text-center'
                    >
                      <img
                        src={tecnologia.icone}
                        alt={tecnologia.nome}
                        className='size-11 object-contain sm:size-14'
                      />
                      <span className='text-xs font-bold text-(--azul-titulo) sm:text-sm'>
                        {tecnologia.nome}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Container>
        </section>

        <section className='bg-(--azul-titulo) text-white'>
          <div className='mx-auto grid max-w-[1440px] items-center lg:grid-cols-2'>
            <div className='px-(--margem-pagina) py-16 lg:py-24 lg:pr-14'>
              <h2 className='font-titulo text-[clamp(2rem,3vw,2.5rem)] font-extrabold'>
                Nossa Missão
              </h2>
              <p className='mt-8 max-w-[600px] text-lg leading-relaxed text-white/95 sm:text-xl lg:text-2xl'>
                Nossa missão é ser a principal plataforma de apoio aos jovens que
                desejam conquistar a independência, tornando a experiência de
                morar sozinho mais simples, acessível e segura.
              </p>
            </div>
            <div className='h-[340px] w-full overflow-hidden sm:h-[420px] lg:h-[514px]'>
              <img
                src={fotoMissao}
                alt='Jovens conversando em casa com organização e autonomia'
                className='size-full object-cover'
              />
            </div>
          </div>
        </section>

        <section className='bg-white text-(--azul-escuro)'>
          <div className='mx-auto grid max-w-[1440px] items-center lg:grid-cols-2'>
            <div className='order-2 h-[340px] w-full overflow-hidden sm:h-[420px] lg:order-1 lg:h-[495px]'>
              <img
                src={fotoVisao}
                alt='Grupo de jovens reunido planejando o futuro em casa'
                className='size-full object-cover object-center'
              />
            </div>
            <div className='order-1 px-(--margem-pagina) py-16 lg:order-2 lg:py-24 lg:pl-16'>
              <h2 className='font-titulo text-[clamp(2rem,3vw,2.5rem)] font-extrabold'>
                Nossa Visão
              </h2>
              <p className='mt-8 max-w-[580px] text-lg leading-relaxed text-(--azul-escuro) sm:text-xl lg:text-2xl'>
                Ser referência para jovens que buscam conquistar sua
                independência e viver essa nova fase com mais confiança e
                tranquilidade.
              </p>
            </div>
          </div>
        </section>

        <section className='bg-(--laranja-principal) py-16 text-white lg:py-20'>
          <Container>
            <h2 className='font-titulo text-[clamp(2rem,3vw,2.5rem)] font-extrabold'>
              Nossos Valores
            </h2>
            <div className='mt-10 grid gap-6 md:grid-cols-3 lg:gap-10'>
              {valoresEquipe.map(valor => (
                <article
                  key={valor.titulo}
                  className='flex flex-col justify-between rounded-[20px] bg-white px-7 py-8 text-(--azul-titulo) shadow-sm'
                >
                  <div className='flex items-center gap-3'>
                    <img
                      src={valor.icone}
                      alt={valor.alt}
                      className='size-9 shrink-0 object-contain'
                    />
                    <h3 className='font-titulo text-2xl font-extrabold text-(--azul-escuro)'>
                      {valor.titulo}
                    </h3>
                  </div>
                  <p className='mt-5 text-lg leading-relaxed text-[#1f2933]'>
                    {valor.descricao}
                  </p>
                </article>
              ))}
            </div>
          </Container>
        </section>
      </main>
      <Rodape />
    </>
  );
}
