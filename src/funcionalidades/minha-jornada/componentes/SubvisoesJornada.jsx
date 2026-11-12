import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Botao,
  CabecalhoSubpagina,
  CampoFormulario,
  Titulo,
} from '../../../compartilhado/interface/indice';
import {
  checklistDocumentosPadrao,
  etapasFixasJornada,
  historicoInicialJornada,
} from '../conteudo';

export function VisaoMetas({
  metas,
  aoVoltar,
  aoNovaMeta,
  aoAbrirHistorico,
  aoAvancarMeta,
  aoAbrirDetalheMeta,
}) {
  const [metaAbertaId, setMetaAbertaId] = useState(null);

  return (
    <section className='space-y-6 py-4'>
      <CabecalhoSubpagina
        aoVoltar={aoVoltar}
        rotuloVoltar='Voltar'
        selo='ANTES DAS CHAVES'
        titulo='Suas metas têm espaço aqui.'
        subtitulo='Pequenas conquistas para a sua mudança.'
        assinatura='chave'
        etiquetaAssinatura='DO SEU JEITO ↗'
      />

      <div className='space-y-3 rounded-xl bg-(--azul-fundo) p-4 sm:p-6'>
        {metas.map(meta => {
          const percentual = meta.objetivo
            ? Math.min(100, Math.round((meta.atual / meta.objetivo) * 100))
            : meta.concluida
              ? 100
              : 0;
          const expandida = metaAbertaId === meta.id;

          return (
            <div
              key={meta.id}
              className='rounded-xl bg-white p-4 sm:p-5'
            >
              <div className='flex flex-wrap items-center justify-between gap-4'>
                <div className='flex min-w-0 items-center gap-4'>
                  <span
                    aria-hidden='true'
                    className='text-lg font-bold text-(--laranja-principal)'
                  >
                    {meta.concluida ? '✓' : '↗'}
                  </span>
                  <div className='min-w-0'>
                    <strong className='block text-base font-bold text-(--azul-titulo)'>
                      {meta.titulo}
                    </strong>
                    <span className='mt-0.5 block text-sm text-(--texto-apoio)'>
                      {percentual}% concluído · {meta.atual} de {meta.objetivo}{' '}
                      · Prazo: {meta.prazo}
                    </span>
                  </div>
                </div>
                <div className='flex shrink-0 items-center gap-4'>
                  <button
                    type='button'
                    onClick={() => aoAbrirDetalheMeta(meta.id)}
                    className='min-h-11 text-sm font-bold text-(--laranja-principal) hover:underline'
                  >
                    Abrir meta ↗
                  </button>
                  <button
                    type='button'
                    onClick={() =>
                      setMetaAbertaId(anterior =>
                        anterior === meta.id ? null : meta.id
                      )
                    }
                    className='min-h-11 text-sm font-bold text-(--azul-titulo) hover:text-(--laranja-principal)'
                  >
                    {expandida ? 'Fechar ↑' : 'Ver detalhes ↗'}
                  </button>
                </div>
              </div>

              {expandida && (
                <div className='mt-4 border-t border-[#eef2f6] pt-4'>
                  <div className='h-2 w-full overflow-hidden rounded-full bg-(--azul-fundo)'>
                    <div
                      className='h-full rounded-full bg-(--laranja-principal)'
                      style={{ width: `${percentual}%` }}
                    />
                  </div>
                  <div className='mt-3 flex flex-wrap gap-3'>
                    {!meta.concluida && (
                      <Botao
                        cor='laranja'
                        classe='rounded-full px-5 text-xs'
                        onClick={() => aoAvancarMeta(meta.id)}
                      >
                        Registrar avanço
                      </Botao>
                    )}
                    <Botao
                      variante='secundario'
                      classe='rounded-full px-5 text-xs'
                      onClick={() => aoAbrirDetalheMeta(meta.id)}
                    >
                      Gerenciar meta
                    </Botao>
                    <span className='inline-flex items-center text-xs text-(--texto-apoio)'>
                      {meta.observacoes ||
                        'Atualize aos poucos conforme a sua organização avança.'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className='flex flex-wrap gap-3'>
        <Botao cor='laranja' classe='rounded-full px-7' onClick={aoNovaMeta}>
          + Nova meta
        </Botao>
        <Botao
          variante='secundario'
          classe='rounded-full px-7'
          onClick={aoAbrirHistorico}
        >
          Ver histórico
        </Botao>
      </div>
    </section>
  );
}

export function VisaoDetalheMeta({
  meta,
  aoVoltar,
  aoAvancarMeta,
  aoEditarMeta,
}) {
  if (!meta) {
    return (
      <section className='space-y-6 py-4'>
        <CabecalhoSubpagina
          aoVoltar={aoVoltar}
          rotuloVoltar='← Voltar'
          selo='ANTES DAS CHAVES'
          titulo='Meta não encontrada.'
          subtitulo='Volte para a lista de metas e escolha um objetivo ativo.'
          assinatura='chave'
        />
      </section>
    );
  }

  const ehVisita = /visita|imóv|studio|apê|casa/i.test(meta.titulo);
  const textoRegistro = meta.concluida
    ? 'Meta concluída ✓'
    : ehVisita
      ? 'Registrar visita'
      : 'Registrar avanço';

  return (
    <section className='space-y-8 py-4'>
      <CabecalhoSubpagina
        aoVoltar={aoVoltar}
        rotuloVoltar='← Voltar'
        selo='ANTES DAS CHAVES'
        titulo={meta.titulo}
        subtitulo={
          meta.observacoes || 'Compare possibilidades antes de escolher.'
        }
        assinatura='chave'
        etiquetaAssinatura='DO SEU JEITO ↗'
      />

      <div className='space-y-1.5 rounded-xl bg-(--azul-fundo) p-5 sm:p-6'>
        <p className='text-lg font-bold text-(--azul-titulo)'>
          {meta.atual} de {meta.objetivo}{' '}
          {ehVisita ? 'visitas realizadas' : 'avanços registrados'}
        </p>
        <p className='text-sm text-(--texto-apoio)'>Prazo: {meta.prazo}.</p>
      </div>

      <div className='flex flex-wrap gap-4'>
        {!meta.concluida && (
          <Botao
            type='button'
            cor='laranja'
            classe='rounded-full px-7'
            onClick={() => aoAvancarMeta(meta.id)}
          >
            {textoRegistro}
          </Botao>
        )}
        <Botao
          type='button'
          variante='secundario'
          classe='rounded-full px-7'
          onClick={() => aoEditarMeta(meta.id)}
        >
          Editar meta
        </Botao>
        <Botao
          como={Link}
          to='/encontrar-casa'
          variante='secundario'
          classe='rounded-full px-7'
        >
          Pesquisar imóveis
        </Botao>
      </div>
    </section>
  );
}

export function VisaoEditarMeta({ meta, aoVoltar, aoVerMetas, aoSalvar }) {
  const [titulo, setTitulo] = useState(meta?.titulo || '');
  const [objetivo, setObjetivo] = useState(String(meta?.objetivo || 3));
  const [prazo, setPrazo] = useState(meta?.prazo || '30/11/2026');
  const [observacoes, setObservacoes] = useState(meta?.observacoes || '');
  const [erro, setErro] = useState('');

  if (!meta) {
    return (
      <section className='space-y-6 py-4'>
        <CabecalhoSubpagina
          aoVoltar={aoVerMetas}
          rotuloVoltar='← Voltar'
          selo='ANTES DAS CHAVES'
          titulo='Meta não encontrada.'
          subtitulo='Escolha uma meta existente para ajustar.'
          assinatura='chave'
        />
      </section>
    );
  }

  return (
    <section className='space-y-6 py-4'>
      <CabecalhoSubpagina
        aoVoltar={aoVoltar}
        rotuloVoltar='← Voltar'
        selo='ANTES DAS CHAVES'
        titulo='Ajustar sua meta.'
        subtitulo='Você pode mudar o plano quando precisar.'
        assinatura=''
      />

      <div className='grid items-start gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.85fr)]'>
        <form
          className='space-y-4 rounded-xl bg-(--azul-fundo) p-5 sm:p-7'
          onSubmit={evento => {
            evento.preventDefault();
            const valor = Number(objetivo);
            if (!titulo.trim()) {
              setErro('Informe o nome da meta.');
              return;
            }
            if (!Number.isFinite(valor) || valor <= 0) {
              setErro('Informe uma quantidade ou valor maior que zero.');
              return;
            }
            const atualLimitado = Math.min(meta.atual, valor);
            aoSalvar({
              ...meta,
              titulo: titulo.trim(),
              atual: atualLimitado,
              objetivo: valor,
              prazo: prazo.trim() || 'Sem prazo',
              observacoes: observacoes.trim(),
              concluida: atualLimitado >= valor,
            });
          }}
        >
          <CampoFormulario
            id='jornada-editar-nome'
            rotulo='Nome da meta'
            value={titulo}
            onChange={evento => {
              setTitulo(evento.target.value);
              setErro('');
            }}
            classeEntrada='bg-white'
            required
          />
          <CampoFormulario
            id='jornada-editar-valor'
            rotulo='Quantidade ou valor'
            type='number'
            min={1}
            value={objetivo}
            onChange={evento => {
              setObjetivo(evento.target.value);
              setErro('');
            }}
            classeEntrada='bg-white'
            required
          />
          <div className='grid gap-4 sm:grid-cols-2'>
            <CampoFormulario
              id='jornada-editar-prazo'
              rotulo='Prazo'
              value={prazo}
              onChange={evento => setPrazo(evento.target.value)}
              classeEntrada='bg-white'
            />
            <CampoFormulario
              id='jornada-editar-obs'
              rotulo='Observações'
              placeholder='Comparar bairro, transporte e custo total'
              value={observacoes}
              onChange={evento => setObservacoes(evento.target.value)}
              classeEntrada='bg-white'
            />
          </div>
          {erro && (
            <p role='alert' className='text-sm text-[#b42318]'>
              {erro}
            </p>
          )}
          <div className='flex flex-wrap gap-3 pt-2'>
            <Botao type='submit' cor='laranja' classe='rounded-full px-7'>
              Salvar meta
            </Botao>
            <Botao
              type='button'
              variante='secundario'
              classe='rounded-full px-7'
              onClick={aoVoltar}
            >
              Cancelar
            </Botao>
          </div>
        </form>

        <aside className='space-y-4 rounded-xl bg-(--laranja-fundo) p-6'>
          <p className='text-xs font-bold tracking-wider text-(--azul-titulo) uppercase'>
            AJUSTE O PRÓXIMO PASSO
          </p>
          <Titulo classe='text-2xl leading-tight font-extrabold'>
            Seu plano pode mudar.
          </Titulo>
          <div className='space-y-1 text-sm'>
            <strong className='block text-(--azul-titulo)'>
              {titulo.trim() || meta.titulo}
            </strong>
            <p className='text-(--texto-apoio)'>
              {meta.atual} de {objetivo || meta.objetivo} etapas registradas
            </p>
          </div>
          <div className='space-y-1 text-sm'>
            <strong className='block text-(--azul-titulo)'>
              Mude o que precisar
            </strong>
            <p className='text-(--texto-apoio)'>
              Prazo e quantidade podem acompanhar sua realidade.
            </p>
          </div>
          <Botao
            type='button'
            variante='secundario'
            classe='w-full rounded-full bg-white'
            onClick={aoVerMetas}
          >
            Ver minhas metas
          </Botao>
        </aside>
      </div>
    </section>
  );
}

export function VisaoNovaMeta({ aoVoltar, aoSalvar }) {
  const [titulo, setTitulo] = useState('');
  const [objetivo, setObjetivo] = useState('3');
  const [prazo, setPrazo] = useState('30/11/2026');
  const [observacoes, setObservacoes] = useState('');
  const [erro, setErro] = useState('');

  return (
    <section className='space-y-6 py-4'>
      <CabecalhoSubpagina
        aoVoltar={aoVoltar}
        rotuloVoltar='Voltar'
        selo='ANTES DAS CHAVES'
        titulo='Um próximo passo possível.'
        subtitulo='Você pode mudar o plano quando precisar.'
      />

      <div className='grid items-start gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.85fr)]'>
        <form
          className='space-y-4 rounded-xl bg-(--azul-fundo) p-5 sm:p-7'
          onSubmit={evento => {
            evento.preventDefault();
            const valor = Number(objetivo);
            if (!titulo.trim()) {
              setErro('Informe o nome da meta.');
              return;
            }
            if (!Number.isFinite(valor) || valor <= 0) {
              setErro('Informe uma quantidade ou valor maior que zero.');
              return;
            }
            aoSalvar({
              id: `meta-${Date.now()}`,
              titulo: titulo.trim(),
              atual: 0,
              objetivo: valor,
              prazo: prazo.trim() || 'Sem prazo',
              observacoes: observacoes.trim(),
              concluida: false,
            });
          }}
        >
          <CampoFormulario
            id='jornada-meta-nome'
            rotulo='Nome da meta'
            placeholder='Ex.: Visitar 3 imóveis'
            value={titulo}
            onChange={evento => {
              setTitulo(evento.target.value);
              setErro('');
            }}
            classeEntrada='bg-white'
            required
          />
          <CampoFormulario
            id='jornada-meta-valor'
            rotulo='Quantidade ou valor'
            type='number'
            min={1}
            value={objetivo}
            onChange={evento => {
              setObjetivo(evento.target.value);
              setErro('');
            }}
            classeEntrada='bg-white'
            required
          />
          <div className='grid gap-4 sm:grid-cols-2'>
            <CampoFormulario
              id='jornada-meta-prazo'
              rotulo='Prazo'
              value={prazo}
              onChange={evento => setPrazo(evento.target.value)}
              classeEntrada='bg-white'
            />
            <CampoFormulario
              id='jornada-meta-obs'
              rotulo='Observações'
              placeholder='Comparar bairro, transporte e custo total'
              value={observacoes}
              onChange={evento => setObservacoes(evento.target.value)}
              classeEntrada='bg-white'
            />
          </div>
          {erro && (
            <p role='alert' className='text-sm text-[#b42318]'>
              {erro}
            </p>
          )}
          <div className='flex flex-wrap gap-3 pt-2'>
            <Botao type='submit' cor='laranja' classe='rounded-full px-7'>
              Salvar meta
            </Botao>
            <Botao
              type='button'
              variante='secundario'
              classe='rounded-full px-7'
              onClick={aoVoltar}
            >
              Cancelar
            </Botao>
          </div>
        </form>

        <aside className='space-y-4 rounded-xl bg-(--laranja-fundo) p-6'>
          <p className='text-xs font-bold tracking-wider text-(--azul-titulo) uppercase'>
            SEU PRÓXIMO PASSO
          </p>
          <Titulo classe='text-2xl leading-tight font-extrabold'>
            Uma meta pequena já move o plano.
          </Titulo>
          <div className='space-y-1 text-sm'>
            <strong className='block text-(--azul-titulo)'>
              {titulo.trim() || 'Visitar 3 imóveis'}
            </strong>
            <p className='text-(--texto-apoio)'>
              {observacoes.trim() || 'Compare bairro, transporte e custo total.'}
            </p>
          </div>
          <div className='space-y-1 text-sm'>
            <strong className='block text-(--azul-titulo)'>
              Para acompanhar
            </strong>
            <p className='text-(--texto-apoio)'>
              Registre cada avanço e ajuste o prazo quando precisar.
            </p>
          </div>
          <Botao
            type='button'
            variante='secundario'
            classe='w-full rounded-full bg-white'
            onClick={aoVoltar}
          >
            Ver minhas metas
          </Botao>
        </aside>
      </div>
    </section>
  );
}

export function VisaoPendencias({
  pendencias,
  aoAlternarPendencia,
  aoVoltar,
}) {
  return (
    <section className='space-y-6 py-4'>
      <CabecalhoSubpagina
        aoVoltar={aoVoltar}
        rotuloVoltar='Voltar'
        selo='ANTES DAS CHAVES'
        titulo='O que falta para o próximo passo?'
        subtitulo='Documentos, finanças e tarefas práticas em um só lugar.'
        assinatura='chave'
        etiquetaAssinatura='DO SEU JEITO ↗'
      />

      <div className='space-y-3 rounded-xl bg-(--azul-fundo) p-4 sm:p-6'>
        {pendencias.map(item => (
          <div
            key={item.id}
            className='flex flex-wrap items-center justify-between gap-4 rounded-xl bg-white p-4 sm:p-5'
          >
            <div className='flex min-w-0 items-center gap-4'>
              <span
                aria-hidden='true'
                className={
                  'text-lg font-bold ' +
                  (item.feito
                    ? 'text-[#18794e]'
                    : 'text-(--laranja-principal)')
                }
              >
                {item.feito ? '✓' : '↗'}
              </span>
              <div className='min-w-0'>
                <strong
                  className={
                    'block text-base font-bold ' +
                    (item.feito
                      ? 'text-(--texto-apoio) line-through'
                      : 'text-(--azul-titulo)')
                  }
                >
                  {item.titulo}
                </strong>
                <span className='mt-0.5 block text-sm text-(--texto-apoio)'>
                  {item.feito ? 'Concluída' : 'Pendente'} · {item.categoria} ·{' '}
                  {item.prazo}
                </span>
              </div>
            </div>
            <button
              type='button'
              onClick={() => aoAlternarPendencia(item.id)}
              className='min-h-11 shrink-0 text-sm font-bold text-(--azul-titulo) hover:text-(--laranja-principal)'
            >
              {item.feito ? 'Reabrir ↗' : 'Marcar como feita ↗'}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

export function VisaoDocumentos({
  documentosMarcados,
  aoAlternarDocumento,
  aoVoltar,
}) {
  return (
    <section className='space-y-6 py-4'>
      <CabecalhoSubpagina
        aoVoltar={aoVoltar}
        rotuloVoltar='Voltar'
        selo='ANTES DAS CHAVES'
        titulo='Uma pasta para os próximos passos.'
        subtitulo='Checklist de organização. As exigências dependem da negociação e do imóvel.'
        assinatura='chave'
        etiquetaAssinatura='DO SEU JEITO ↗'
      />

      <div className='space-y-3 rounded-xl bg-(--azul-fundo) p-4 sm:p-6'>
        {checklistDocumentosPadrao.map(doc => {
          const marcado = Boolean(documentosMarcados[doc.id]);
          return (
            <label
              key={doc.id}
              className='flex cursor-pointer items-start gap-4 rounded-xl bg-white p-4 hover:bg-[#fff9f5] sm:p-5'
            >
              <input
                type='checkbox'
                checked={marcado}
                onChange={evento =>
                  aoAlternarDocumento(doc.id, evento.target.checked)
                }
                className='mt-1 size-5 shrink-0 accent-(--laranja-principal)'
              />
              <span>
                <strong className='block text-base font-bold text-(--azul-titulo)'>
                  {doc.titulo}
                </strong>
                <span className='mt-1 block text-sm text-(--texto-apoio)'>
                  {doc.descricao}
                </span>
              </span>
            </label>
          );
        })}
      </div>

      <div className='rounded-xl bg-(--azul-fundo) p-5'>
        <strong className='block text-base font-bold text-(--azul-titulo)'>
          Guarde seus documentos com cuidado
        </strong>
        <p className='mt-1 text-sm text-(--texto-apoio)'>
          Este protótipo não solicita upload de documentos pessoais.
        </p>
      </div>

      <Botao
        como={Link}
        to='/aprendendo?visao=guia&guia=contratos'
        cor='laranja'
        classe='rounded-full px-7'
      >
        Ver orientações sobre contratos
      </Botao>
    </section>
  );
}

export function VisaoHistorico({
  estadoPlataforma,
  aoAbrirEtapa,
  aoAbrirVisao,
  aoVoltar,
}) {
  const etapasConcluidas = (estadoPlataforma.etapasJornada || [])
    .filter(item => item.situacao === 'concluida')
    .map(item => ({
      id: item.id,
      titulo: `${item.titulo} concluída`,
      detalhe: `Etapa ${item.numero} · ${item.subtitulo}`,
      etapaId: etapasFixasJornada.findIndex(fixa => fixa.chave === item.id),
    }));

  const metasConcluidas = (estadoPlataforma.metasJornada || [])
    .filter(meta => meta.concluida)
    .map(meta => ({
      id: meta.id,
      titulo: meta.titulo,
      detalhe: `${meta.atual} de ${meta.objetivo} · Concluída`,
      visao: 'metas',
    }));

  const itens =
    etapasConcluidas.length || metasConcluidas.length
      ? [...etapasConcluidas, ...metasConcluidas]
      : historicoInicialJornada;

  return (
    <section className='space-y-6 py-4'>
      <CabecalhoSubpagina
        aoVoltar={aoVoltar}
        rotuloVoltar='Voltar'
        selo='ANTES DAS CHAVES'
        titulo='O caminho que você já percorreu.'
        subtitulo='Suas etapas e metas concluídas.'
        assinatura='chave'
        etiquetaAssinatura='DO SEU JEITO ↗'
      />

      <div className='space-y-3 rounded-xl bg-(--azul-fundo) p-4 sm:p-6'>
        {itens.map(item => (
          <div
            key={item.id}
            className='flex flex-wrap items-center justify-between gap-4 rounded-xl bg-white p-4 sm:p-5'
          >
            <div className='flex min-w-0 items-center gap-4'>
              <span
                aria-hidden='true'
                className='text-lg font-bold text-(--laranja-principal)'
              >
                ✓
              </span>
              <div className='min-w-0'>
                <strong className='block text-base font-bold text-(--azul-titulo)'>
                  {item.titulo}
                </strong>
                <span className='mt-0.5 block text-sm text-(--texto-apoio)'>
                  {item.detalhe}
                </span>
              </div>
            </div>
            <button
              type='button'
              onClick={() =>
                typeof item.etapaId === 'number' && item.etapaId >= 0
                  ? aoAbrirEtapa(item.etapaId)
                  : aoAbrirVisao(item.visao || 'metas')
              }
              className='min-h-11 shrink-0 text-sm font-bold text-(--azul-titulo) hover:text-(--laranja-principal)'
            >
              Consultar ↗
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
