import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Botao,
  EstadoVazio,
} from '../../../compartilhado/interface/indice';
import {
  normalizarTexto,
  situacoesAnuncio,
} from '../../../aplicacao/estado/estadoEmpresa';
import { abasSituacaoAnuncio } from '../conteudo';
import {
  EtiquetaSituacaoAnuncio,
  ImagemServicoEmpresa,
} from './InterfaceEmpresa';

export default function ListaAnuncios({ dados, compacto = false }) {
  const [parametros, definirParametros] = useSearchParams();
  const situacaoSolicitada = parametros.get('status') || '';
  const filtroSituacao = Object.hasOwn(situacoesAnuncio, situacaoSolicitada)
    ? situacaoSolicitada
    : 'todos';
  const estadoForcado = parametros.get('estado');
  const [busca, setBusca] = useState('');

  const forcarVazio = !compacto && estadoForcado === 'vazio';
  const destaqueRenovacao = estadoForcado === 'renovacao';

  const anunciosFiltrados = forcarVazio
    ? []
    : dados.anuncios.filter(
        anuncio =>
          (compacto ||
            filtroSituacao === 'todos' ||
            anuncio.situacao === filtroSituacao) &&
          normalizarTexto(`${anuncio.titulo} ${anuncio.categoria}`).includes(
            normalizarTexto(busca)
          )
      );

  const alterarFiltro = chave => {
    definirParametros(
      anterior => {
        const proximo = new URLSearchParams(anterior);
        if (chave === 'todos') proximo.delete('status');
        else proximo.set('status', chave);
        proximo.delete('estado');
        return proximo;
      },
      { preventScrollReset: true }
    );
  };

  return (
    <div className='space-y-5'>
      {!compacto && (
        <div className='space-y-4'>
          <div
            role='group'
            aria-label='Filtrar anúncios por situação'
            className='flex flex-wrap gap-2'
          >
            {abasSituacaoAnuncio.map(aba => {
              const ativo = aba.id === filtroSituacao;
              const quantidade = dados.anuncios.filter(
                item => aba.id === 'todos' || item.situacao === aba.id
              ).length;
              return (
                <button
                  key={aba.id}
                  type='button'
                  aria-pressed={ativo}
                  onClick={() => alterarFiltro(aba.id)}
                  className={`min-h-11 cursor-pointer rounded-full px-5 text-sm font-bold transition-colors ${
                    ativo
                      ? 'bg-(--azul-titulo) text-white'
                      : 'border border-[#dbe5ed] bg-[#f4f7fa] text-(--azul-titulo) hover:bg-[#e6edf2]'
                  }`}
                >
                  {aba.rotulo} ({quantidade})
                </button>
              );
            })}
          </div>

          <input
            type='search'
            aria-label='Buscar anúncio por título ou categoria'
            value={busca}
            onChange={evento => setBusca(evento.target.value)}
            placeholder='Buscar anúncio por nome ou categoria...'
            className='h-12 w-full rounded-xl border border-[#dbe5ed] bg-white px-4 text-sm text-(--azul-titulo) placeholder:text-(--texto-apoio) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--laranja-principal)'
          />

          {destaqueRenovacao && (
            <div className='flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[#f4c7c3] bg-[#fef3f2] p-4'>
              <p className='text-sm font-semibold text-[#b42318]'>
                Você possui anúncios expirados aguardando renovação para voltar ao
                catálogo.
              </p>
              <Botao
                type='button'
                cor='laranja'
                classe='min-h-[40px]! px-5! text-xs!'
                onClick={() => alterarFiltro('expirado')}
              >
                Ver expirados
              </Botao>
            </div>
          )}
        </div>
      )}

      {anunciosFiltrados.length ? (
        <ul className='space-y-3 rounded-2xl bg-[#f4f7fa] p-3 sm:p-5'>
          {anunciosFiltrados.map(anuncio => (
            <li
              key={anuncio.id}
              className='flex flex-col justify-between gap-4 rounded-xl border border-[#e6edf2] bg-white p-4 sm:flex-row sm:items-center sm:p-5'
            >
              <div className='flex min-w-0 flex-1 items-center gap-4'>
                <ImagemServicoEmpresa
                  anuncio={anuncio}
                  classe='hidden h-16 w-24 shrink-0 rounded-lg sm:block'
                />
                <div className='min-w-0 space-y-1.5'>
                  <div className='flex flex-wrap items-center gap-2.5'>
                    <Link
                      to={`/empresa/anuncios/${anuncio.id}`}
                      className='font-titulo text-lg font-extrabold text-(--azul-titulo) hover:text-(--laranja-principal) hover:underline'
                    >
                      {anuncio.titulo || 'Rascunho sem título'}
                    </Link>
                    <EtiquetaSituacaoAnuncio situacao={anuncio.situacao} />
                  </div>
                  <p className='text-sm text-(--texto-apoio)'>
                    {anuncio.categoria} · {anuncio.preco} · {anuncio.regiao}
                  </p>
                  {!compacto && (
                    <p className='text-xs font-semibold text-(--texto-apoio)'>
                      {anuncio.visualizacoes} visualizações ·{' '}
                      {anuncio.contatosRecebidos} contatos recebidos
                    </p>
                  )}
                </div>
              </div>

              <div className='flex flex-wrap items-center gap-2.5'>
                <Botao
                  como={Link}
                  to={`/empresa/anuncios/${anuncio.id}`}
                  variante='secundario'
                  classe='min-h-[42px]! px-4! text-sm!'
                >
                  Gerenciar ↗
                </Botao>
                <Botao
                  como={Link}
                  to={`/empresa/anuncios/${anuncio.id}/editar`}
                  cor='laranja'
                  classe='min-h-[42px]! px-4! text-sm!'
                >
                  {anuncio.situacao === 'expirado'
                    ? 'Renovar anúncio ↗'
                    : 'Editar anúncio ↗'}
                </Botao>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <EstadoVazio
          titulo={
            forcarVazio || !dados.anuncios.length
              ? 'Você ainda não tem anúncios'
              : 'Nenhum anúncio encontrado neste filtro'
          }
          descricao={
            forcarVazio || !dados.anuncios.length
              ? 'Publique o primeiro serviço da sua empresa para aparecer para quem precisa cuidar da casa.'
              : 'Limpe os filtros ou cadastre um novo serviço para ampliar sua presença.'
          }
          textoAcao={
            forcarVazio || !dados.anuncios.length
              ? 'Criar primeiro anúncio'
              : 'Mostrar todos os anúncios'
          }
          rotaAcao={
            forcarVazio || !dados.anuncios.length ? '/empresa/anunciar' : ''
          }
          aoClicar={
            forcarVazio || !dados.anuncios.length
              ? null
              : () => {
                  setBusca('');
                  alterarFiltro('todos');
                }
          }
        />
      )}

      {!compacto && (
        <div className='flex flex-wrap items-center justify-between gap-4 border-t border-[#e6edf2] pt-4'>
          <p className='text-xs text-(--texto-apoio)'>
            Os status e métricas mostrados nesta tela ficam armazenados localmente
            para simulação do painel.
          </p>
          <div className='flex flex-wrap gap-3'>
            <Botao
              como={Link}
              to='/empresa/anunciar'
              cor='laranja'
              classe='min-h-[44px]!'
            >
              + Novo anúncio
            </Botao>
            <Botao
              como={Link}
              to='/empresa/dashboard'
              variante='secundario'
              classe='min-h-[44px]!'
            >
              Ver desempenho
            </Botao>
          </div>
        </div>
      )}
    </div>
  );
}
