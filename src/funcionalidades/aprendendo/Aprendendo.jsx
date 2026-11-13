import { IconeConcluido } from '../../compartilhado/interface/IndicadoresFuncionais';
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Botao,
  CabecalhoSubpagina,
  Container,
  EstadoVazio,
  Titulo,
} from '../../compartilhado/interface/indice';
import Rodape from '../../compartilhado/Rodape';
import {
  cartoesAutonomia,
  guiasAprendendo,
  itensPrimeiraSemana,
  lerEstadoAprendendo,
  salvarEstadoAprendendo,
} from './conteudo';
import caixaVetor from '../../ativos/vetores/caixa/caixa.svg';
import linhasAbertura from '../../ativos/vetores/caixa/linhas-abertura.svg';
import editorialEssenciais from '../../ativos/imagens/fotografias/editorial-essenciais.png';
import editorialCozinha from '../../ativos/imagens/fotografias/editorial-cozinha.png';

export default function Aprendendo() {
  const [parametros, definirParametros] = useSearchParams();
  const [estado, setEstado] = useState(lerEstadoAprendendo);

  useEffect(() => {
    salvarEstadoAprendendo(estado);
  }, [estado]);

  const visaoParam = parametros.get('visao');
  const guiaParam = parametros.get('guia');
  const guiaSelecionado =
    guiasAprendendo.find(item => item.slug === guiaParam) || null;

  const visao = [
    'biblioteca',
    'guia',
    'simulacao',
    'escolha-consciente',
    'consequencia',
    'resultado',
    'retomar',
  ].includes(visaoParam)
    ? visaoParam
    : 'hub';

  function abrirVisao(proxima, slugGuia = null) {
    definirParametros(
      anterior => {
        const atualizado = new URLSearchParams(anterior);
        if (!proxima || proxima === 'hub') atualizado.delete('visao');
        else atualizado.set('visao', proxima);
        if (slugGuia) atualizado.set('guia', slugGuia);
        else atualizado.delete('guia');
        return atualizado;
      },
      { preventScrollReset: false }
    );
  }

  function alternarItemSemana(id) {
    setEstado(anterior => ({
      ...anterior,
      primeiraSemana: {
        ...anterior.primeiraSemana,
        [id]: !anterior.primeiraSemana[id],
      },
    }));
  }

  function alternarGuiaLido(slug) {
    setEstado(anterior => {
      const jaLido = anterior.lidos.includes(slug);
      return {
        ...anterior,
        lidos: jaLido
          ? anterior.lidos.filter(item => item !== slug)
          : [...anterior.lidos, slug],
      };
    });
  }

  function salvarPausaSimulacao(etapa) {
    setEstado(anterior => ({ ...anterior, etapaSimulacao: etapa }));
    abrirVisao('retomar');
  }

  return (
    <div
      lang='pt-BR'
      className='min-w-0 flex-1 bg-white font-corpo text-(--azul-titulo) [&_a:focus-visible]:outline-2 [&_a:focus-visible]:outline-offset-4 [&_a:focus-visible]:outline-(--laranja-principal)'
    >
      <main>
        <Container classe='py-8 sm:py-10'>
          {visao === 'hub' && (
            <>
              <section className='mx-auto flex max-w-3xl flex-col items-center pt-2 text-center'>
                <p className='text-[11px] font-bold tracking-[0.12em] text-(--laranja-principal) uppercase'>
                  APRENDE. TENTA. FAZ DO SEU JEITO
                </p>
                <h1 className='font-titulo mt-3 text-[clamp(2.5rem,5.5vw,4.5rem)] leading-[1.04] font-extrabold text-(--azul-titulo)'>
                  Ninguém nasce
                  <span className='mx-auto mt-3 block w-fit -rotate-2 bg-(--laranja-principal) px-7 py-2 text-white'>
                    sabendo
                  </span>
                </h1>
                <p className='mt-5 max-w-md text-base leading-relaxed text-(--texto-apoio)'>
                  Guias diretos para aprender o que ninguém te contou sobre
                  morar por conta própria.
                </p>
                <div className='mt-6 flex flex-wrap justify-center gap-3'>
                  <Botao
                    como={Link}
                    to='/minhajornada'
                    cor='laranja'
                    classe='rounded-full px-8 min-h-[50px]'
                  >
                    Ver minha jornada
                  </Botao>
                  <Botao
                    type='button'
                    variante='secundario'
                    classe='rounded-full px-7 min-h-[50px]'
                    onClick={() => abrirVisao('biblioteca')}
                  >
                    Explorar guias práticos
                  </Botao>
                </div>

                <div className='relative mt-10 grid w-full max-w-3xl items-center gap-6 sm:grid-cols-[1fr_auto_1fr]'>
                  <div className='mx-auto w-56 -rotate-3 rounded-lg bg-white p-2 shadow-md'>
                    <img
                      src={editorialEssenciais}
                      alt='Conjunto de panelas, pratos e utensílios para casa'
                      className='aspect-4/3 w-full rounded object-cover'
                    />
                  </div>

                  <div className='flex flex-col items-center gap-3'>
                    <img
                      src={linhasAbertura}
                      alt=''
                      aria-hidden='true'
                      className='h-4 w-12 object-contain'
                    />
                    <img
                      src={caixaVetor}
                      alt=''
                      aria-hidden='true'
                      className='h-24 w-24 object-contain'
                    />
                    <button
                      type='button'
                      onClick={() => abrirVisao('simulacao')}
                      className='rotate-1 bg-(--azul-titulo) px-4 py-1.5 text-[11px] font-bold tracking-wider text-white uppercase hover:bg-(--laranja-principal)'
                    >
                      UM PASSO DE CADA VEZ
                    </button>
                  </div>

                  <div className='relative mx-auto w-56 rotate-3 rounded-lg bg-white p-2 shadow-md'>
                    <img
                      src={editorialCozinha}
                      alt='Jovem preparando refeição na cozinha'
                      className='aspect-4/3 w-full rounded object-cover'
                    />
                    <span className='absolute right-3 -bottom-3 -rotate-2 bg-(--laranja-principal) px-3 py-1 text-[10px] font-bold tracking-wider text-white uppercase shadow-xs'>
                      seu canto ganha vida
                    </span>
                  </div>
                </div>
              </section>

              <section className='mt-14 space-y-6'>
                <div className='flex flex-wrap items-end justify-between gap-4'>
                  <div>
                    <p className='text-[11px] font-bold tracking-wider text-(--laranja-principal) uppercase'>
                      COMECE PELO QUE VOCÊ PRECISA
                    </p>
                    <Titulo classe='mt-1 text-2xl font-extrabold sm:text-3xl'>
                      O básico que dá autonomia
                    </Titulo>
                  </div>
                  <button
                    type='button'
                    onClick={() => abrirVisao('biblioteca')}
                    className='min-h-11 text-sm font-bold text-(--laranja-principal) hover:underline'
                  >
                    Ver todos os guias
                  </button>
                </div>

                <div className='grid gap-6 md:grid-cols-3'>
                  {cartoesAutonomia.map(cartao => (
                    <article
                      key={cartao.numero}
                      className={`flex flex-col justify-between overflow-hidden rounded-lg ${cartao.fundo}`}
                    >
                      <img
                        src={cartao.imagem}
                        alt={cartao.alt}
                        className='aspect-16/10 w-full object-cover'
                      />
                      <div className='flex flex-1 flex-col justify-between p-5 sm:p-6'>
                        <div>
                          <p className='text-[11px] font-bold tracking-wider text-(--laranja-principal) uppercase'>
                            {cartao.numero} / {cartao.categoria}
                          </p>
                          <h3 className='font-titulo mt-2 text-2xl font-extrabold text-(--azul-titulo)'>
                            {cartao.titulo}
                          </h3>
                          <p className='mt-2 text-sm leading-relaxed text-(--texto-apoio)'>
                            {cartao.descricao}
                          </p>
                        </div>
                        <Botao
                          como={Link}
                          to={cartao.rota}
                          cor='laranja'
                          classe='mt-5 w-full rounded-full'
                        >
                          {cartao.acao}
                        </Botao>
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              <section className='mt-14 space-y-5'>
                <div className='flex flex-wrap items-end justify-between gap-4'>
                  <div>
                    <p className='text-[11px] font-bold tracking-wider text-(--laranja-principal) uppercase'>
                      GUIA RÁPIDO
                    </p>
                    <Titulo classe='mt-1 text-2xl font-extrabold sm:text-3xl'>
                      A primeira semana no seu canto
                    </Titulo>
                  </div>
                  <button
                    type='button'
                    onClick={() => abrirVisao('simulacao')}
                    className='min-h-11 text-sm font-bold text-(--azul-titulo) hover:text-(--laranja-principal)'
                  >
                    Praticar em uma simulação
                  </button>
                </div>

                <div className='space-y-3 rounded-xl bg-(--azul-fundo) p-4 sm:p-6'>
                  {itensPrimeiraSemana.map(item => {
                    const marcado = Boolean(estado.primeiraSemana[item.id]);
                    return (
                      <label
                        key={item.id}
                        className='flex cursor-pointer items-start gap-4 rounded-xl bg-white p-4 transition-colors hover:bg-[#fff9f5] sm:p-5'
                      >
                        <input
                          type='checkbox'
                          checked={marcado}
                          onChange={() => alternarItemSemana(item.id)}
                          className='sr-only'
                        />
                        <span
                          aria-hidden='true'
                          className={
                            'mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold transition-colors ' +
                            (marcado
                              ? 'border-(--laranja-principal) bg-(--laranja-principal) text-white'
                              : 'border-[#c4d0da] bg-white text-transparent')
                          }
                        >
                          <IconeConcluido />
                        </span>
                        <span>
                          <strong
                            className={
                              'block text-base font-bold ' +
                              (marcado
                                ? 'text-(--texto-apoio) line-through'
                                : 'text-(--azul-titulo)')
                            }
                          >
                            {item.titulo}
                          </strong>
                          <span className='mt-1 block text-sm text-(--texto-apoio)'>
                            {item.descricao}
                          </span>
                        </span>
                      </label>
                    );
                  })}
                </div>
              </section>
            </>
          )}

          {visao === 'biblioteca' && (
            <div className='space-y-8'>
              <CabecalhoSubpagina
                aoVoltar={() => abrirVisao('hub')}
                rotuloVoltar=" Voltar"
                selo='UM PASSO DE CADA VEZ'
                titulo='O que ninguém te ensinou, aos poucos'
                subtitulo='Guias para ganhar autonomia no seu ritmo.'
                assinatura='livro'
                etiquetaAssinatura="DO SEU JEITO"
              />

              <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-3'>
                {guiasAprendendo.map(guia => {
                  const lido = estado.lidos.includes(guia.slug);
                  return (
                    <article
                      key={guia.slug}
                      className='flex flex-col justify-between overflow-hidden rounded-xl border border-[#e6edf2] bg-white'
                    >
                      <img
                        src={guia.imagem}
                        alt={guia.alt}
                        className='aspect-16/10 w-full object-cover'
                      />
                      <div className='flex flex-1 flex-col justify-between p-5'>
                        <div>
                          <div className='flex items-center justify-between gap-2'>
                            <span className='text-[11px] font-bold tracking-wider text-(--laranja-principal) uppercase'>
                              GUIA PRÁTICO
                            </span>
                            {lido && (
                              <span className='rounded-full bg-[#e6f5ec] px-2.5 py-0.5 text-[11px] font-bold text-(--verde-sucesso)'>
                                Lido
                              </span>
                            )}
                          </div>
                          <h2 className='font-titulo mt-2 text-2xl font-extrabold text-(--azul-titulo)'>
                            {guia.titulo}
                          </h2>
                          <p className='mt-1 text-sm text-(--texto-apoio)'>
                            {guia.subtitulo}
                          </p>
                        </div>
                        <Botao
                          type='button'
                          cor='laranja'
                          classe='mt-5 w-full rounded-full'
                          onClick={() => abrirVisao('guia', guia.slug)}
                        >
                          Ver guia
                        </Botao>
                      </div>
                    </article>
                  );
                })}
              </div>

              <div className='flex flex-wrap gap-3'>
                <Botao
                  type='button'
                  cor='laranja'
                  classe='rounded-full px-7'
                  onClick={() => abrirVisao('simulacao')}
                >
                  Experimentar uma situação
                </Botao>
                <Botao
                  type='button'
                  variante='secundario'
                  classe='rounded-full px-7'
                  onClick={() =>
                    abrirVisao(estado.etapaSimulacao || 'simulacao')
                  }
                >
                  Continuar de onde parei
                </Botao>
              </div>
            </div>
          )}

          {visao === 'guia' && (
            <>
              {guiaSelecionado ? (
                <div className='space-y-8'>
                  <CabecalhoSubpagina
                    aoVoltar={() => abrirVisao('biblioteca')}
                    rotuloVoltar=" Voltar"
                    selo='UM PASSO DE CADA VEZ'
                    titulo={`${guiaSelecionado.titulo}`}
                    subtitulo={guiaSelecionado.subtitulo}
                    assinatura=''
                  />

                  <div className='grid items-start gap-8 lg:grid-cols-[1.2fr_0.8fr]'>
                    <div className='space-y-6'>
                      <p className='text-base leading-relaxed text-(--azul-titulo)'>
                        {guiaSelecionado.introducao}
                      </p>

                      <div className='space-y-4'>
                        <Titulo classe='text-2xl font-extrabold'>
                          Teste assim, no seu ritmo
                        </Titulo>
                        <div className='space-y-4'>
                          {guiaSelecionado.passos.map(passo => (
                            <div
                              key={passo.numero}
                              className='flex items-start gap-4'
                            >
                              <span className='flex size-10 shrink-0 items-center justify-center rounded-lg bg-(--laranja-fundo) text-sm font-bold text-(--azul-titulo)'>
                                {passo.numero}
                              </span>
                              <div>
                                <strong className='block text-base font-bold text-(--azul-titulo)'>
                                  {passo.titulo}
                                </strong>
                                <p className='mt-0.5 text-sm text-(--texto-apoio)'>
                                  {passo.descricao}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className='flex flex-wrap gap-3 pt-2'>
                        <Botao
                          type='button'
                          cor='laranja'
                          classe='rounded-full px-7'
                          onClick={() => alternarGuiaLido(guiaSelecionado.slug)}
                        >
                          {estado.lidos.includes(guiaSelecionado.slug)
                            ? "Lido"
                            : 'Marcar como lido'}
                        </Botao>
                        <Botao
                          type='button'
                          variante='secundario'
                          classe='rounded-full px-7'
                          onClick={() => abrirVisao('simulacao')}
                        >
                          Praticar com uma situação
                        </Botao>
                      </div>
                    </div>

                    <aside className='space-y-5'>
                      <img
                        src={guiaSelecionado.imagem}
                        alt={guiaSelecionado.alt}
                        className='aspect-16/10 w-full rotate-1 rounded-xl object-cover shadow-md'
                      />
                      <div className='space-y-4 rounded-xl bg-(--laranja-fundo) p-6'>
                        <p className='text-[11px] font-bold tracking-wider text-(--azul-titulo) uppercase'>
                          PARA TESTAR HOJE
                        </p>
                        <p className='text-sm leading-relaxed text-(--azul-titulo)'>
                          {guiaSelecionado.testeHoje}
                        </p>
                        <Botao
                          como={Link}
                          to={guiaSelecionado.rotaTeste}
                          cor='laranja'
                          classe='w-full rounded-full'
                        >
                          {guiaSelecionado.acaoTeste}
                        </Botao>
                      </div>
                    </aside>
                  </div>
                </div>
              ) : (
                <EstadoVazio
                  varianteAlerta='erro'
                  titulo='Guia não encontrado'
                  descricao='Escolha um dos guias práticos da biblioteca.'
                  textoAcao='Ver biblioteca de guias'
                  aoClicar={() => abrirVisao('biblioteca')}
                />
              )}
            </>
          )}

          {visao === 'simulacao' && (
            <div className='space-y-6'>
              <CabecalhoSubpagina
                aoVoltar={() => abrirVisao('biblioteca')}
                rotuloVoltar=" Voltar"
                selo='UM PASSO DE CADA VEZ'
                titulo='Uma semana no seu primeiro canto'
                subtitulo='Experiência educativa com escolhas e consequências demonstrativas.'
                assinatura='livro'
                etiquetaAssinatura="DO SEU JEITO"
              />
              <div className='rounded-xl bg-(--azul-fundo) p-5 sm:p-6'>
                <strong className='block text-base font-bold text-(--azul-titulo)'>
                  A conta vence amanhã
                </strong>
                <p className='mt-1 text-sm text-(--texto-apoio)'>
                  Você está com a semana cheia. O que faria para não esquecer?
                </p>
              </div>
              <div className='flex flex-wrap gap-3'>
                <Botao
                  type='button'
                  cor='laranja'
                  classe='rounded-full px-7'
                  onClick={() => abrirVisao('escolha-consciente')}
                >
                  Criar um lembrete
                </Botao>
                <Botao
                  type='button'
                  variante='secundario'
                  classe='rounded-full px-7'
                  onClick={() => abrirVisao('consequencia')}
                >
                  Deixar para lembrar depois
                </Botao>
              </div>
              <button
                type='button'
                onClick={() => salvarPausaSimulacao('simulacao')}
                className='min-h-11 px-4 text-sm font-bold text-(--azul-titulo) hover:text-(--laranja-principal)'
              >
                Salvar e continuar depois
              </button>
            </div>
          )}

          {visao === 'escolha-consciente' && (
            <div className='space-y-6'>
              <CabecalhoSubpagina
                aoVoltar={() => abrirVisao('simulacao')}
                rotuloVoltar=" Voltar"
                selo='UM PASSO DE CADA VEZ'
                titulo='Você reservou um tempo para organizar'
                subtitulo='Experiência educativa com escolhas e consequências demonstrativas.'
                assinatura='livro'
                etiquetaAssinatura="DO SEU JEITO"
              />
              <div className='rounded-xl bg-(--azul-fundo) p-5 sm:p-6'>
                <strong className='block text-base font-bold text-(--azul-titulo)'>
                  Um lembrete tira a tarefa da cabeça
                </strong>
                <p className='mt-1 text-sm text-(--texto-apoio)'>
                  Você separou um momento para conferir e pagar a conta.
                  Acompanhar vencimentos ajuda na organização.
                </p>
              </div>
              <Botao
                type='button'
                cor='laranja'
                classe='rounded-full px-7'
                onClick={() => abrirVisao('resultado')}
              >
                Ver meu resultado
              </Botao>
              <div>
                <button
                  type='button'
                  onClick={() => salvarPausaSimulacao('escolha-consciente')}
                  className='min-h-11 px-4 text-sm font-bold text-(--azul-titulo) hover:text-(--laranja-principal)'
                >
                  Salvar e continuar depois
                </button>
              </div>
            </div>
          )}

          {visao === 'consequencia' && (
            <div className='space-y-6'>
              <CabecalhoSubpagina
                aoVoltar={() => abrirVisao('simulacao')}
                rotuloVoltar=" Voltar"
                selo='UM PASSO DE CADA VEZ'
                titulo='E se a conta ficar para depois?'
                subtitulo='Experiência educativa com escolhas e consequências demonstrativas.'
                assinatura='livro'
                etiquetaAssinatura="DO SEU JEITO"
              />
              <div className='rounded-xl bg-(--laranja-fundo) p-5 sm:p-6'>
                <strong className='block text-base font-bold text-(--azul-titulo)'>
                  A tarefa pode passar despercebida
                </strong>
                <p className='mt-1 text-sm text-(--azul-titulo)'>
                  Quando uma obrigação depende só da memória, fica mais fácil
                  esquecer. Uma lista ou lembrete pode ajudar.
                </p>
              </div>
              <div className='flex flex-wrap gap-3'>
                <Botao
                  type='button'
                  cor='laranja'
                  classe='rounded-full px-7'
                  onClick={() => abrirVisao('simulacao')}
                >
                  Tentar outra escolha
                </Botao>
                <Botao
                  type='button'
                  variante='secundario'
                  classe='rounded-full px-7'
                  onClick={() => abrirVisao('resultado')}
                >
                  Continuar
                </Botao>
              </div>
              <button
                type='button'
                onClick={() => salvarPausaSimulacao('consequencia')}
                className='min-h-11 px-4 text-sm font-bold text-(--azul-titulo) hover:text-(--laranja-principal)'
              >
                Salvar e continuar depois
              </button>
            </div>
          )}

          {visao === 'resultado' && (
            <div className='space-y-6'>
              <CabecalhoSubpagina
                aoVoltar={() => abrirVisao('biblioteca')}
                rotuloVoltar=" Voltar"
                selo='UM PASSO DE CADA VEZ'
                titulo='Uma decisão de cada vez'
                subtitulo='Experiência educativa com escolhas e consequências demonstrativas.'
                assinatura='livro'
                etiquetaAssinatura="DO SEU JEITO"
              />
              <div className='rounded-xl bg-(--azul-fundo) p-5 sm:p-6'>
                <strong className='block text-base font-bold text-(--azul-titulo)'>
                  Você explorou uma situação do dia a dia
                </strong>
                <p className='mt-1 text-sm text-(--texto-apoio)'>
                  Não existe pontuação de valor pessoal aqui. Use o que aprendeu
                  para construir uma rotina possível.
                </p>
              </div>
              <div className='flex flex-wrap gap-3'>
                <Botao
                  como={Link}
                  to='/rotina'
                  cor='laranja'
                  classe='rounded-full px-7'
                >
                  Criar lembrete na rotina
                </Botao>
                <Botao
                  type='button'
                  variante='secundario'
                  classe='rounded-full px-7'
                  onClick={() => abrirVisao('biblioteca')}
                >
                  Explorar outros guias
                </Botao>
              </div>
            </div>
          )}

          {visao === 'retomar' && (
            <div className='space-y-6'>
              <CabecalhoSubpagina
                aoVoltar={() => abrirVisao('biblioteca')}
                rotuloVoltar=" Voltar"
                selo='UM PASSO DE CADA VEZ'
                titulo='Sua experiência continua aqui'
                subtitulo='Experiência educativa com escolhas e consequências demonstrativas.'
                assinatura='livro'
                etiquetaAssinatura="DO SEU JEITO"
              />
              <div className='rounded-xl bg-(--azul-fundo) p-5 sm:p-6'>
                <strong className='block text-base font-bold text-(--azul-titulo)'>
                  Você parou na primeira decisão
                </strong>
                <p className='mt-1 text-sm text-(--texto-apoio)'>
                  A conta vence amanhã. Retome a escolha no seu ritmo.
                </p>
              </div>
              <Botao
                type='button'
                cor='laranja'
                classe='rounded-full px-7'
                onClick={() => abrirVisao(estado.etapaSimulacao || 'simulacao')}
              >
                Retomar experiência
              </Botao>
            </div>
          )}
        </Container>

        {visao === 'hub' && (
          <section className='mt-12 bg-(--azul-titulo) py-8 text-white'>
            <Container classe='flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center'>
              <div>
                <Titulo
                  como='h2'
                  classe='text-2xl font-extrabold text-white! sm:text-3xl'
                >
                  Autonomia também é saber pedir ajuda
                </Titulo>
                <p className='mt-1 text-sm text-white/80'>
                  Encontre empresas para o que precisa de cuidado especializado.
                </p>
              </div>
              <Botao
                como={Link}
                to='/marketplace'
                cor='laranja'
                classe='shrink-0 rounded-full px-7'
              >
                Encontrar uma empresa
              </Botao>
            </Container>
          </section>
        )}
      </main>
      <Rodape />
    </div>
  );
}
