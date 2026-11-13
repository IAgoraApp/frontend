import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Botao,
  CampoFormulario,
  Container,
  Titulo,
} from '../../compartilhado/interface/indice';
import Rodape from '../../compartilhado/Rodape';
import {
  lerEstadoPlataforma,
  salvarEstadoPlataforma,
} from '../../aplicacao/estado/estadoPlataforma';
import {
  CHAVE_BUSCA_CASA,
  filtrarImoveis,
  filtrosIniciaisCasa,
  imoveisExemplo,
  lerFiltrosCasa,
} from './conteudo';
import {
  VisaoBuscar,
  VisaoComparar,
  VisaoContato,
  VisaoDetalhe,
  VisaoFavoritos,
  VisaoGaleria,
  VisaoImpacto,
  VisaoPreferencias,
  VisaoResultados,
} from './componentes/SubvisoesCasaBusca';
import argolaChaveiro from '../../ativos/vetores/assinaturas/chaveiro-argola.svg';
import brilhoChaveiro from '../../ativos/vetores/assinaturas/chaveiro-brilho.svg';
import casinhaChaveiro from '../../ativos/vetores/assinaturas/chaveiro-casinha.svg';
import chaveChaveiro from '../../ativos/vetores/assinaturas/chaveiro-chave.svg';

function ChaveiroHeroiCasa() {
  return (
    <div
      aria-hidden='true'
      className='relative hidden h-[170px] w-[170px] shrink-0 select-none sm:block'
    >
      <img
        src={brilhoChaveiro}
        alt=''
        className='absolute top-2 left-0 h-6 w-6'
      />
      <img
        src={argolaChaveiro}
        alt=''
        className='absolute top-1 left-12 h-14 w-14'
      />
      <img
        src={chaveChaveiro}
        alt=''
        className='animar-pulsar absolute top-14 left-1 h-24 w-16 rotate-16'
      />
      <img
        src={casinhaChaveiro}
        alt=''
        className='absolute top-12 left-14 h-28 w-24 -rotate-6'
      />
    </div>
  );
}

export default function EncontrarCasa() {
  const [parametros, definirParametros] = useSearchParams();
  const [estadoPlataforma, setEstadoPlataforma] = useState(lerEstadoPlataforma);
  const [filtros, setFiltros] = useState(lerFiltrosCasa);

  useEffect(() => {
    try {
      localStorage.setItem(CHAVE_BUSCA_CASA, JSON.stringify(filtros));
    } catch {
      return;
    }
  }, [filtros]);

  useEffect(() => {
    const atualizar = () => setEstadoPlataforma(lerEstadoPlataforma());
    window.addEventListener('iagora:estado', atualizar);
    return () => window.removeEventListener('iagora:estado', atualizar);
  }, []);

  const visaoParam = parametros.get('visao');
  const idImovelParam = parametros.get('imovel');
  const imovelAtual =
    imoveisExemplo.find(item => item.id === idImovelParam) || null;

  const visaoSolicitada = [
    'buscar',
    'resultados',
    'favoritos',
    'preferencias',
    'detalhe',
    'galeria',
    'comparar',
    'impacto',
    'contato',
  ].includes(visaoParam)
    ? visaoParam
    : 'hub';
  const exigeImovel = ['detalhe', 'galeria', 'impacto', 'contato'].includes(visaoSolicitada);
  const visao = exigeImovel && !imovelAtual ? 'detalhe' : visaoSolicitada;

  function abrirVisao(proxima, idImovel = null) {
    definirParametros(
      anterior => {
        const atualizado = new URLSearchParams(anterior);
        if (!proxima || proxima === 'hub') atualizado.delete('visao');
        else atualizado.set('visao', proxima);
        if (idImovel) atualizado.set('imovel', idImovel);
        else atualizado.delete('imovel');
        return atualizado;
      },
      { preventScrollReset: false }
    );
  }

  function atualizarPlataforma(transformar) {
    setEstadoPlataforma(anterior => {
      const proximo = transformar(anterior);
      salvarEstadoPlataforma(proximo);
      return proximo;
    });
  }

  function alternarFavorito(id) {
    atualizarPlataforma(anterior => {
      const atuais = anterior.imoveisFavoritos || [];
      const jaSalvo = atuais.includes(id);
      return {
        ...anterior,
        imoveisFavoritos: jaSalvo
          ? atuais.filter(item => item !== id)
          : [...atuais, id],
      };
    });
  }

  function alternarComparar(id) {
    atualizarPlataforma(anterior => {
      const atuais = anterior.imoveisComparados || [];
      const jaTem = atuais.includes(id);
      const proximos = jaTem
        ? atuais.filter(item => item !== id)
        : [...atuais.slice(-1), id];
      return { ...anterior, imoveisComparados: proximos };
    });
  }

  function alterarFiltro(chave, valor) {
    setFiltros(anterior => ({ ...anterior, [chave]: valor }));
  }

  const favoritos = estadoPlataforma.imoveisFavoritos || [];
  const comparados = estadoPlataforma.imoveisComparados || [];
  const filtrados = filtrarImoveis(imoveisExemplo, filtros);
  const vitrineHub = [imoveisExemplo[0], imoveisExemplo[3]];

  return (
    <div
      lang='pt-BR'
      className='min-w-0 flex-1 bg-white font-corpo text-(--azul-titulo) [&_a:focus-visible]:outline-2 [&_a:focus-visible]:outline-offset-4 [&_a:focus-visible]:outline-(--laranja-principal)'
    >
      <main>
        <Container classe='py-8 sm:py-10'>
          {visao === 'hub' && (
            <>
              <section className='flex flex-col justify-between gap-8 pb-8 sm:flex-row sm:items-center'>
                <div className='space-y-4'>
                  <p className='text-xs font-bold tracking-wider text-(--laranja-principal) uppercase'>
                    ENCONTRAR CASA / UM CANTO PRA CHAMAR DE SEU
                  </p>
                  <h1 className='font-titulo text-[clamp(2.5rem,5.4vw,4.3rem)] leading-[1.04] font-extrabold text-(--azul-titulo)'>
                    Abre a porta.
                    <span className='block text-(--laranja-principal)'>
                      Pro seu agora
                    </span>
                  </h1>
                  <span className='inline-block -rotate-2 bg-(--azul-titulo) px-5 py-2 text-xs font-bold tracking-wider text-white uppercase'>
                    DO SEU JEITO. NO SEU TEMPO
                  </span>
                </div>
                <ChaveiroHeroiCasa />
              </section>

              <form
                onSubmit={e => {
                  e.preventDefault();
                  abrirVisao('resultados');
                }}
                className='grid gap-4 rounded-xl bg-(--pessego-suave) p-5 sm:p-6 lg:grid-cols-[1.2fr_1fr_auto] lg:items-end'
              >
                <CampoFormulario
                  id='hub-casa-onde'
                  rotulo='Onde você quer morar?'
                  placeholder='Cidade ou bairro'
                  value={filtros.local}
                  onChange={e => alterarFiltro('local', e.target.value)}
                  classeEntrada='bg-white'
                />
                <CampoFormulario
                  id='hub-casa-quanto'
                  rotulo='Até quanto por mês?'
                  placeholder='Aluguel + condomínio + outras contas'
                  value={filtros.teto}
                  onChange={e => alterarFiltro('teto', e.target.value)}
                  classeEntrada='bg-white'
                />
                <Botao
                  type='submit'
                  cor='laranja'
                  classe='rounded-full px-8 min-h-[50px]'
                >
                  Buscar meu canto
                </Botao>
              </form>

              <div className='mt-8 grid items-start gap-8 lg:grid-cols-[260px_1fr]'>
                <aside className='space-y-4 rounded-xl bg-(--azul-fundo) p-5'>
                  <p className='text-[11px] font-bold tracking-wider text-(--laranja-principal) uppercase'>
                    DO SEU JEITO
                  </p>
                  <Titulo classe='text-xl font-extrabold'>
                    Refine sua busca
                  </Titulo>

                  <CampoFormulario
                    id='ref-tipo'
                    rotulo='Tipo de espaço'
                    placeholder='Apartamento, casa ou estúdio'
                    value={filtros.tipo}
                    onChange={e => alterarFiltro('tipo', e.target.value)}
                    classeEntrada='bg-white'
                  />
                  <CampoFormulario
                    id='ref-quartos'
                    rotulo='Quartos'
                    placeholder='1 ou mais'
                    value={filtros.quartos}
                    onChange={e => alterarFiltro('quartos', e.target.value)}
                    classeEntrada='bg-white'
                  />
                  <CampoFormulario
                    id='ref-prioridade'
                    rotulo='O que importa pra você?'
                    placeholder='Transporte, trabalho, estudo'
                    value={filtros.prioridade}
                    onChange={e => alterarFiltro('prioridade', e.target.value)}
                    classeEntrada='bg-white'
                  />

                  <p className='text-xs leading-relaxed text-(--texto-apoio)'>
                    Lembre do gasto total: aluguel, condomínio, contas e
                    deslocamento.
                  </p>

                  <Botao
                    como={Link}
                    to='/planejamento?visao=realidade'
                    cor='marinho'
                    classe='w-full rounded-full'
                  >
                    Simular meu orçamento
                  </Botao>
                </aside>

                <section className='space-y-5'>
                  <div className='flex flex-wrap items-center justify-between gap-3'>
                    <Titulo classe='text-xl font-extrabold sm:text-2xl'>
                      Espaços para imaginar seu próximo capítulo
                    </Titulo>
                    <div className='flex gap-4 text-sm font-bold'>
                      <button
                        type='button'
                        onClick={() => abrirVisao('favoritos')}
                        className='min-h-11 text-(--azul-titulo) hover:text-(--laranja-principal)'
                      >
                        Favoritos ({favoritos.length})
                      </button>
                      <button
                        type='button'
                        onClick={() => abrirVisao('resultados')}
                        className='min-h-11 text-(--laranja-principal) hover:underline'
                      >
                        Ver todos
                      </button>
                    </div>
                  </div>

                  <div className='space-y-5'>
                    {vitrineHub.map(imovel => {
                      const salvo = favoritos.includes(imovel.id);
                      return (
                        <article
                          key={imovel.id}
                          className='grid items-center gap-5 rounded-xl bg-(--azul-fundo) p-4 sm:grid-cols-[260px_1fr] sm:p-5'
                        >
                          <button
                            type='button'
                            onClick={() => abrirVisao('detalhe', imovel.id)}
                            className='overflow-hidden rounded-lg text-left'
                          >
                            <img
                              src={imovel.imagem}
                              alt={imovel.alt}
                              className='aspect-4/3 w-full object-cover transition-transform hover:scale-[1.02]'
                            />
                          </button>

                          <div className='space-y-2.5'>
                            <p className='text-[11px] font-bold tracking-wider text-(--laranja-principal) uppercase'>
                              {imovel.seloHub}
                            </p>
                            <h3 className='font-titulo text-2xl font-extrabold text-(--azul-titulo)'>
                              {imovel.tituloHub}
                            </h3>
                            <p className='text-sm text-(--texto-apoio)'>
                              {imovel.detalheHub}
                            </p>
                            <p className='font-titulo text-2xl font-extrabold text-(--azul-titulo)'>
                              R$ {imovel.total.toLocaleString('pt-BR')} / mês
                            </p>
                            <div className='flex flex-wrap gap-3 pt-1'>
                              <Botao
                                type='button'
                                cor='laranja'
                                classe='rounded-full px-6'
                                onClick={() => alternarFavorito(imovel.id)}
                              >
                                {salvo
                                  ? "Salvo na minha jornada"
                                  : "Salvar na minha jornada"}
                              </Botao>
                              <Botao
                                type='button'
                                variante='secundario'
                                classe='rounded-full border border-[#dbe5ed] bg-white px-5'
                                onClick={() => abrirVisao('detalhe', imovel.id)}
                              >
                                Ver detalhes
                              </Botao>
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </section>
              </div>
            </>
          )}

          {visao === 'buscar' && (
            <VisaoBuscar
              filtros={filtros}
              aoAlterarFiltro={alterarFiltro}
              aoAbrirVisao={abrirVisao}
            />
          )}

          {visao === 'resultados' && (
            <VisaoResultados
              imoveis={filtrados}
              favoritos={favoritos}
              comparados={comparados}
              aoAlternarFavorito={alternarFavorito}
              aoAlternarComparar={alternarComparar}
              aoLimparFiltros={() => setFiltros(filtrosIniciaisCasa)}
              aoAbrirVisao={abrirVisao}
            />
          )}

          {visao === 'favoritos' && (
            <VisaoFavoritos
              favoritos={favoritos}
              aoAlternarFavorito={alternarFavorito}
              aoAbrirVisao={abrirVisao}
            />
          )}

          {visao === 'preferencias' && (
            <VisaoPreferencias
              filtros={filtros}
              aoAlterarFiltro={alterarFiltro}
              aoLimparFiltros={() => setFiltros(filtrosIniciaisCasa)}
              aoAbrirVisao={abrirVisao}
            />
          )}

          {visao === 'detalhe' && (
            <VisaoDetalhe
              imovel={imovelAtual}
              favorito={imovelAtual ? favoritos.includes(imovelAtual.id) : false}
              comparado={
                imovelAtual ? comparados.includes(imovelAtual.id) : false
              }
              aoAlternarFavorito={alternarFavorito}
              aoAlternarComparar={alternarComparar}
              aoAbrirVisao={abrirVisao}
            />
          )}

          {visao === 'galeria' && (
            <VisaoGaleria imovel={imovelAtual} aoAbrirVisao={abrirVisao} />
          )}

          {visao === 'comparar' && (
            <VisaoComparar comparados={comparados} aoAbrirVisao={abrirVisao} />
          )}

          {visao === 'impacto' && (
            <VisaoImpacto
              imovel={imovelAtual}
              rendaMensal={estadoPlataforma.perfil?.orcamentoMensal}
              aoAbrirVisao={abrirVisao}
            />
          )}

          {visao === 'contato' && (
            <VisaoContato
              imovel={imovelAtual}
              nomeUsuario={estadoPlataforma.perfil?.nomeCompleto}
              aoAbrirVisao={abrirVisao}
            />
          )}
        </Container>

        {visao === 'hub' && (
          <section className='mt-10 bg-(--azul-titulo) py-8 text-white'>
            <Container classe='flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center'>
              <div>
                <Titulo
                  como='h2'
                  classe='text-2xl font-extrabold text-white! sm:text-3xl'
                >
                  Gostou do espaço? Olhe além da foto
                </Titulo>
                <p className='mt-1 text-sm text-white/80'>
                  Liste suas perguntas e compare cada opção com o seu orçamento.
                </p>
              </div>
              <Botao
                como={Link}
                to='/minhajornada'
                cor='laranja'
                classe='shrink-0 rounded-full px-7'
              >
                Organizar minha jornada
              </Botao>
            </Container>
          </section>
        )}
      </main>
      <Rodape />
    </div>
  );
}
