import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Botao,
  EstadoVazio,
} from '../../../shared/ui/index';
import {
  formatarData,
  idEmpresaPadrao,
  normalizarTexto,
  situacoesContato,
} from '../../../app/estado/estadoEmpresa';
import {
  abasSituacaoContato,
  obterIniciaisNome,
} from '../content';
import {
  CartaoEmpresa,
  EtiquetaSituacaoContato,
} from './empresaUi';

export default function ContatosEmpresa({
  dados,
  contato,
  aoResponder,
  aoAlterarSituacao,
}) {
  const [filtro, setFiltro] = useState('todos');
  const [busca, setBusca] = useState('');
  const [resposta, setResposta] = useState('');
  const [erro, setErro] = useState('');

  const contatosEmpresa = dados.contatos.filter(
    item => !item.empresaId || item.empresaId === idEmpresaPadrao
  );

  if (contato) {
    return (
      <div className='grid items-start gap-8 lg:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)]'>
        <CartaoEmpresa>
          <div className='space-y-4'>
            {contato.mensagens.map(mensagem => {
              const daEmpresa = mensagem.autor === 'empresa';
              return (
                <div
                  key={mensagem.id}
                  className={`rounded-2xl p-5 ${
                    daEmpresa
                      ? 'ml-4 border border-[#f8ccb4] bg-[#fce8dc] sm:ml-12'
                      : 'mr-4 border border-[#dbe5ed] bg-[#f4f7fa] sm:mr-12'
                  }`}
                >
                  <p className='mb-2 text-xs font-bold text-(--texto-apoio)'>
                    {daEmpresa ? dados.empresa.nome : contato.nome} ·{' '}
                    {formatarData(mensagem.data)}
                  </p>
                  <p className='leading-relaxed whitespace-pre-wrap text-(--azul-titulo)'>
                    {mensagem.texto}
                  </p>
                </div>
              );
            })}
          </div>

          <form
            noValidate
            className='mt-7 space-y-4 border-t border-[#e6edf2] pt-6'
            onSubmit={evento => {
              evento.preventDefault();
              if (!resposta.trim()) {
                setErro('Escreva uma resposta antes de enviar.');
                return;
              }
              if (aoResponder(contato, resposta.trim())) {
                setResposta('');
                setErro('');
              }
            }}
          >
            <label
              htmlFor='empresa-resposta-contato'
              className='flex flex-col gap-2 text-sm font-bold text-(--azul-titulo)'
            >
              Sua resposta
              <textarea
                id='empresa-resposta-contato'
                rows={4}
                maxLength={2000}
                required
                value={resposta}
                onChange={evento => {
                  setResposta(evento.target.value);
                  if (erro) setErro('');
                }}
                placeholder='Escreva valores estimados, datas disponíveis ou próximos passos...'
                className='rounded-xl border border-[#dbe5ed] bg-white p-4 text-base font-normal text-(--azul-titulo) placeholder:text-(--texto-apoio) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--laranja-principal)'
              />
            </label>

            {erro && (
              <p role='alert' className='text-sm font-semibold text-[#b42318]'>
                {erro}
              </p>
            )}

            <p className='text-xs text-(--texto-apoio)'>
              A resposta fica salva localmente nesta demonstração e também
              aparece no histórico do consumidor.
            </p>

            <div className='flex flex-wrap gap-3'>
              <Botao type='submit' cor='laranja' classe='px-7!'>
                Enviar resposta ↗
              </Botao>
              <Botao
                type='button'
                variante='secundario'
                onClick={() =>
                  aoAlterarSituacao(
                    contato,
                    contato.situacao === 'concluido'
                      ? 'andamento'
                      : 'concluido'
                  )
                }
              >
                {contato.situacao === 'concluido'
                  ? 'Reabrir contato'
                  : 'Marcar concluído'}
              </Botao>
            </div>
          </form>
        </CartaoEmpresa>

        <aside className='space-y-5 rounded-2xl border border-[#f8ccb4] bg-[#fce8dc] p-6 sm:p-7'>
          <p className='text-xs font-bold tracking-[0.8px] text-(--azul-titulo) uppercase'>
            SOBRE ESTE CONTATO
          </p>

          <dl className='space-y-4 text-sm'>
            {[
              ['Serviço', contato.servico],
              ['Canal informado', contato.contato],
              ['Status', situacoesContato[contato.situacao]],
              ['Primeiro contato', formatarData(contato.criadoEm)],
              [
                'Próximo passo',
                contato.situacao === 'concluido'
                  ? 'Atendimento finalizado'
                  : 'Confirmar metragem, região e data antes de fechar o orçamento.',
              ],
            ].map(([rotulo, valor]) => (
              <div key={rotulo}>
                <dt className='font-bold text-(--azul-titulo)'>{rotulo}</dt>
                <dd className='mt-0.5 text-(--texto-apoio)'>{valor}</dd>
              </div>
            ))}
          </dl>

          {dados.anuncios.some(anuncio => anuncio.id === contato.anuncioId) && (
            <Botao
              como={Link}
              to={`/empresa/anuncios/${contato.anuncioId}`}
              cor='laranja'
              classe='w-full'
            >
              Consultar o anúncio ↗
            </Botao>
          )}
        </aside>
      </div>
    );
  }

  const visiveis = contatosEmpresa.filter(
    item =>
      (filtro === 'todos' || item.situacao === filtro) &&
      normalizarTexto(
        `${item.nome} ${item.servico} ${item.mensagens[0]?.texto || ''}`
      ).includes(normalizarTexto(busca))
  );

  return (
    <div className='space-y-6'>
      <div
        role='group'
        aria-label='Filtrar contatos por situação'
        className='flex flex-wrap gap-2'
      >
        {abasSituacaoContato.map(aba => {
          const ativo = filtro === aba.id;
          const total = contatosEmpresa.filter(
            item => aba.id === 'todos' || item.situacao === aba.id
          ).length;
          return (
            <button
              key={aba.id}
              type='button'
              aria-pressed={ativo}
              onClick={() => setFiltro(aba.id)}
              className={`min-h-11 cursor-pointer rounded-full px-5 text-sm font-bold transition-colors ${
                ativo
                  ? 'bg-(--azul-titulo) text-white'
                  : 'border border-[#dbe5ed] bg-[#f4f7fa] text-(--azul-titulo) hover:bg-[#e6edf2]'
              }`}
            >
              {aba.rotulo} ({total})
            </button>
          );
        })}
      </div>

      <input
        type='search'
        aria-label='Buscar contato por nome, serviço ou mensagem'
        value={busca}
        onChange={evento => setBusca(evento.target.value)}
        placeholder='Buscar cliente, serviço ou mensagem...'
        className='h-12 w-full rounded-xl border border-[#dbe5ed] bg-white px-4 text-sm text-(--azul-titulo) placeholder:text-(--texto-apoio) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--laranja-principal)'
      />

      {visiveis.length ? (
        <div className='space-y-4'>
          {visiveis.map(item => (
            <article
              key={item.id}
              className='flex flex-col justify-between gap-5 rounded-2xl border border-[#dbe5ed] bg-white p-5 sm:flex-row sm:items-center sm:p-6'
            >
              <div className='flex min-w-0 flex-1 items-start gap-4'>
                <span
                  aria-hidden='true'
                  className='font-titulo flex size-12 shrink-0 items-center justify-center rounded-full bg-[#fce8dc] text-base font-extrabold text-(--laranja-principal)'
                >
                  {obterIniciaisNome(item.nome)}
                </span>
                <div className='min-w-0 space-y-1.5'>
                  <div className='flex flex-wrap items-center gap-2.5'>
                    <h2 className='font-titulo text-xl font-extrabold text-(--azul-titulo)'>
                      {item.nome}
                    </h2>
                    <EtiquetaSituacaoContato situacao={item.situacao} />
                  </div>
                  <p className='text-xs font-bold text-(--texto-apoio) uppercase'>
                    {item.servico} · {formatarData(item.criadoEm)}
                  </p>
                  <p className='line-clamp-2 text-sm text-(--texto-apoio)'>
                    {item.mensagens.at(-1)?.texto}
                  </p>
                </div>
              </div>

              <Botao
                como={Link}
                to={`/empresa/contatos/${item.id}`}
                cor='laranja'
                classe='min-h-[44px]! shrink-0 px-6!'
              >
                Ver conversa ↗
              </Botao>
            </article>
          ))}
        </div>
      ) : (
        <EstadoVazio
          titulo='Nenhum contato encontrado'
          descricao='Os pedidos registrados pelos moradores no perfil público da empresa aparecerão aqui.'
          textoAcao={busca || filtro !== 'todos' ? 'Limpar filtros' : 'Ir para anúncios'}
          rotaAcao={busca || filtro !== 'todos' ? '' : '/empresa/anuncios'}
          aoClicar={
            busca || filtro !== 'todos'
              ? () => {
                  setBusca('');
                  setFiltro('todos');
                }
              : null
          }
        />
      )}
    </div>
  );
}
