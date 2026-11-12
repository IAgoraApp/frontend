import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  AssinaturaEditorial,
  Botao,
  Container,
  Titulo,
} from '../../compartilhado/interface/indice';
import Rodape from '../../compartilhado/Rodape';
import {
  lerEstadoPlataforma,
  salvarEstadoPlataforma,
} from '../../aplicacao/estado/estadoPlataforma';
import { etapasFixasJornada } from './conteudo';
import {
  CartoesJornada,
  EtapaJornada,
  VisaoDetalheMeta,
  VisaoDocumentos,
  VisaoEditarMeta,
  VisaoHistorico,
  VisaoMetas,
  VisaoNovaMeta,
  VisaoPendencias,
} from './componentes/indice';

export default function MinhaJornada() {
  const [parametros, definirParametros] = useSearchParams();
  const [estado, setEstado] = useState(lerEstadoPlataforma);
  const [docsMarcados, setDocsMarcados] = useState(() => {
    const salvo = {};
    for (const doc of lerEstadoPlataforma().documentosJornada || []) {
      if (doc.situacao === 'Pronto') salvo[doc.id] = true;
    }
    return salvo;
  });

  useEffect(() => {
    const atualizar = () => setEstado(lerEstadoPlataforma());
    window.addEventListener('iagora:estado', atualizar);
    return () => window.removeEventListener('iagora:estado', atualizar);
  }, []);

  const visaoParam = parametros.get('visao');
  const etapaParam = parametros.get('etapa');
  const metaParam = parametros.get('meta');
  const etapaAtual =
    etapaParam !== null && Number.isInteger(Number(etapaParam))
      ? Number(etapaParam)
      : null;

  const metaAtual =
    (estado.metasJornada || []).find(item => item.id === metaParam) || null;

  const visao =
    etapaAtual !== null &&
    etapasFixasJornada.some(item => item.id === etapaAtual)
      ? 'etapa'
      : [
            'metas',
            'nova-meta',
            'detalhe-meta',
            'editar-meta',
            'pendencias',
            'documentos',
            'historico',
          ].includes(visaoParam)
        ? visaoParam
        : 'hub';

  function atualizarPlataforma(transformar) {
    setEstado(anterior => {
      const proximo = transformar(anterior);
      salvarEstadoPlataforma(proximo);
      return proximo;
    });
  }

  function abrirVisao(proxima, idEtapa = null, idMeta = null) {
    definirParametros(
      anterior => {
        const atualizado = new URLSearchParams(anterior);
        if (!proxima || proxima === 'hub') atualizado.delete('visao');
        else atualizado.set('visao', proxima);
        if (idEtapa !== null && idEtapa !== undefined) {
          atualizado.set('etapa', String(idEtapa));
        } else {
          atualizado.delete('etapa');
        }
        if (idMeta) atualizado.set('meta', idMeta);
        else atualizado.delete('meta');
        return atualizado;
      },
      { preventScrollReset: true }
    );
  }

  function alternarTarefaEtapa(chaveEtapa, indice, feito, tituloTarefa) {
    atualizarPlataforma(anterior => {
      const etapas = (anterior.etapasJornada || []).map(etapa => {
        if (etapa.id !== chaveEtapa) return etapa;
        const itens = [...(etapa.itens || [])];
        const existente = itens[indice] || {
          id: `${chaveEtapa}-${indice + 1}`,
          texto: tituloTarefa,
          feito: false,
        };
        itens[indice] = { ...existente, feito };
        const todosFeitos = itens.length > 0 && itens.every(item => item.feito);
        const algumFeito = itens.some(item => item.feito);
        return {
          ...etapa,
          itens,
          situacao: todosFeitos
            ? 'concluida'
            : algumFeito
              ? 'andamento'
              : 'pendente',
        };
      });
      return { ...anterior, etapasJornada: etapas };
    });
  }

  function concluirEtapa(chaveEtapa, tarefas) {
    atualizarPlataforma(anterior => {
      const etapas = (anterior.etapasJornada || []).map(etapa => {
        if (etapa.id !== chaveEtapa) return etapa;
        const itens = tarefas.map((tarefa, indice) => ({
          id: etapa.itens?.[indice]?.id || `${chaveEtapa}-${indice + 1}`,
          texto: etapa.itens?.[indice]?.texto || tarefa.titulo,
          feito: true,
        }));
        return { ...etapa, itens, situacao: 'concluida' };
      });
      return { ...anterior, etapasJornada: etapas };
    });
  }

  function situacaoEtapaRotulo(chaveEtapa) {
    const encontrada = (estado.etapasJornada || []).find(
      item => item.id === chaveEtapa
    );
    if (encontrada?.situacao === 'concluida') return 'Concluída ✓';
    if (encontrada?.situacao === 'andamento') return 'Em andamento ↗';
    return 'Começar ↗';
  }

  return (
    <div
      lang='pt-BR'
      className='min-w-0 flex-1 bg-white font-corpo text-(--azul-titulo) [&_a:focus-visible]:outline-2 [&_a:focus-visible]:outline-offset-4 [&_a:focus-visible]:outline-(--laranja-principal)'
    >
      <Container como='main' classe='py-7 sm:py-10'>
        {visao === 'hub' && (
          <>
            <div className='flex flex-col items-start justify-between gap-6 md:flex-row md:items-center'>
              <div className='space-y-3'>
                <Titulo
                  como='h1'
                  classe='text-3xl leading-tight font-extrabold sm:text-5xl'
                >
                  Sua independência, passo a passo.
                </Titulo>
                <p className='text-base text-(--texto-apoio) sm:text-lg'>
                  Retome de onde parou. Cada etapa pode ser ajustada ao seu
                  ritmo.
                </p>
              </div>
              <AssinaturaEditorial tipo='chave' etiqueta='DO SEU JEITO ↗' />
            </div>

            <section
              aria-label='Etapas da jornada'
              className='mt-8 space-y-4 rounded-xl bg-(--azul-fundo) p-4 sm:p-6'
            >
              {etapasFixasJornada.map(etapa => (
                <button
                  key={etapa.id}
                  type='button'
                  onClick={() => abrirVisao('etapa', etapa.id)}
                  className='flex min-h-20 w-full items-center justify-between gap-4 rounded-xl bg-white px-5 py-4 text-left transition-shadow hover:shadow-sm sm:px-8'
                >
                  <div className='min-w-0'>
                    <strong className='block text-lg font-bold text-(--azul-titulo)'>
                      {etapa.numero} / {etapa.tituloNav}
                    </strong>
                    <span className='mt-0.5 block text-sm text-(--texto-apoio)'>
                      {etapa.subtitulo}
                    </span>
                  </div>
                  <span className='shrink-0 text-sm font-bold text-(--azul-titulo)'>
                    {situacaoEtapaRotulo(etapa.chave)}
                  </span>
                </button>
              ))}
            </section>

            <div className='mt-6 flex flex-wrap gap-3'>
              <Botao
                cor='laranja'
                classe='rounded-full px-7'
                onClick={() => abrirVisao('metas')}
              >
                Minhas metas
              </Botao>
              <Botao
                variante='secundario'
                classe='rounded-full px-7'
                onClick={() => abrirVisao('pendencias')}
              >
                Pendências
              </Botao>
              <Botao
                variante='secundario'
                classe='rounded-full px-7'
                onClick={() => abrirVisao('historico')}
              >
                Histórico
              </Botao>
            </div>

            <CartoesJornada />
          </>
        )}

        {visao === 'etapa' && etapaAtual !== null && (
          <EtapaJornada
            etapaAtual={etapaAtual}
            estadoPlataforma={estado}
            aoAlternarTarefa={alternarTarefaEtapa}
            aoConcluirEtapa={concluirEtapa}
            aoAbrirEtapa={id => abrirVisao('etapa', id)}
            aoVoltar={() => abrirVisao('hub')}
            aoAbrirVisao={proxima => abrirVisao(proxima)}
          />
        )}

        {visao === 'metas' && (
          <VisaoMetas
            metas={estado.metasJornada || []}
            aoVoltar={() => abrirVisao('hub')}
            aoNovaMeta={() => abrirVisao('nova-meta')}
            aoAbrirHistorico={() => abrirVisao('historico')}
            aoAbrirDetalheMeta={idMeta => abrirVisao('detalhe-meta', null, idMeta)}
            aoAvancarMeta={idMeta =>
              atualizarPlataforma(anterior => ({
                ...anterior,
                metasJornada: (anterior.metasJornada || []).map(meta => {
                  if (meta.id !== idMeta) return meta;
                  const passo = meta.objetivo > 50 ? 500 : 1;
                  const atual = Math.min(meta.objetivo, meta.atual + passo);
                  return {
                    ...meta,
                    atual,
                    concluida: atual >= meta.objetivo,
                  };
                }),
              }))
            }
          />
        )}

        {visao === 'detalhe-meta' && (
          <VisaoDetalheMeta
            meta={metaAtual}
            aoVoltar={() => abrirVisao('metas')}
            aoEditarMeta={idMeta => abrirVisao('editar-meta', null, idMeta)}
            aoAvancarMeta={idMeta =>
              atualizarPlataforma(anterior => ({
                ...anterior,
                metasJornada: (anterior.metasJornada || []).map(meta => {
                  if (meta.id !== idMeta) return meta;
                  const passo = meta.objetivo > 50 ? 500 : 1;
                  const atual = Math.min(meta.objetivo, meta.atual + passo);
                  return {
                    ...meta,
                    atual,
                    concluida: atual >= meta.objetivo,
                  };
                }),
              }))
            }
          />
        )}

        {visao === 'editar-meta' && (
          <VisaoEditarMeta
            key={metaAtual?.id || 'vazia'}
            meta={metaAtual}
            aoVoltar={() =>
              abrirVisao(metaAtual ? 'detalhe-meta' : 'metas', null, metaAtual?.id)
            }
            aoVerMetas={() => abrirVisao('metas')}
            aoSalvar={metaAtualizada => {
              atualizarPlataforma(anterior => ({
                ...anterior,
                metasJornada: (anterior.metasJornada || []).map(meta =>
                  meta.id === metaAtualizada.id ? metaAtualizada : meta
                ),
              }));
              abrirVisao('detalhe-meta', null, metaAtualizada.id);
            }}
          />
        )}

        {visao === 'nova-meta' && (
          <VisaoNovaMeta
            aoVoltar={() => abrirVisao('metas')}
            aoSalvar={novaMeta => {
              atualizarPlataforma(anterior => ({
                ...anterior,
                metasJornada: [novaMeta, ...(anterior.metasJornada || [])],
              }));
              abrirVisao('metas');
            }}
          />
        )}

        {visao === 'pendencias' && (
          <VisaoPendencias
            pendencias={estado.pendenciasJornada || []}
            aoVoltar={() => abrirVisao('hub')}
            aoAlternarPendencia={id =>
              atualizarPlataforma(anterior => ({
                ...anterior,
                pendenciasJornada: (anterior.pendenciasJornada || []).map(item =>
                  item.id === id ? { ...item, feito: !item.feito } : item
                ),
              }))
            }
          />
        )}

        {visao === 'documentos' && (
          <VisaoDocumentos
            documentosMarcados={docsMarcados}
            aoAlternarDocumento={(id, marcado) =>
              setDocsMarcados(anterior => ({ ...anterior, [id]: marcado }))
            }
            aoVoltar={() => abrirVisao('etapa', 3)}
          />
        )}

        {visao === 'historico' && (
          <VisaoHistorico
            estadoPlataforma={estado}
            aoAbrirEtapa={id => abrirVisao('etapa', id)}
            aoAbrirVisao={proxima => abrirVisao(proxima)}
            aoVoltar={() => abrirVisao('hub')}
          />
        )}
      </Container>
      <Rodape />
    </div>
  );
}
