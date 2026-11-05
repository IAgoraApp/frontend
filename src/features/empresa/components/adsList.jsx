import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { statuses, normalize } from '../content';
import { Action, Empty } from './empresaUi';

export default function AdsList({ data, compact = false }) {
  const [params, setParams] = useSearchParams();
  const requested = params.get('status');
  const filter = Object.hasOwn(statuses, requested) ? requested : 'all';
  const [search, setSearch] = useState('');
  const ads = data.ads.filter(
    ad =>
      (compact || filter === 'all' || ad.status === filter) &&
      normalize(ad.title + ad.category).includes(normalize(search))
  );
  return (
    <div className='space-y-5'>
      {!compact && (
        <>
          <div
            className='flex flex-wrap gap-2'
            role='group'
            aria-label='Status dos anúncios'
          >
            {[
              ['all', 'Todos'],
              ['active', 'Ativos'],
              ['review', 'Em análise'],
              ['paused', 'Pausados'],
              ['expired', 'Expirados'],
              ['draft', 'Rascunhos'],
            ].map(([key, label]) => (
              <Action
                key={key}
                secondary={key !== filter}
                aria-pressed={key === filter}
                onClick={() =>
                  setParams(
                    previous => {
                      const next = new URLSearchParams(previous);
                      if (key === 'all') next.delete('status');
                      else next.set('status', key);
                      return next;
                    },
                    { preventScrollReset: true }
                  )
                }
              >
                {label} (
                {
                  data.ads.filter(ad => key === 'all' || ad.status === key)
                    .length
                }
                )
              </Action>
            ))}
          </div>
          <input
            type='search'
            aria-label='Buscar anúncio'
            value={search}
            onChange={event => setSearch(event.target.value)}
            placeholder='Buscar anúncio...'
            className='min-h-13 w-full rounded-lg border border-[#dbe5ed] px-4'
          />
        </>
      )}
      {ads.length ? (
        <ul className='space-y-3 rounded-xl bg-(--azul-fundo) p-3 sm:p-5'>
          {ads.map(ad => (
            <li
              key={ad.id}
              className='flex flex-wrap items-center justify-between gap-4 rounded-lg bg-white p-5'
            >
              <div className='min-w-0'>
                <Link
                  className='text-lg font-bold hover:underline'
                  to={'/meus-servicos/' + ad.id}
                >
                  {ad.title || 'Rascunho sem título'}
                </Link>
                <p className='mt-2 text-sm text-(--texto-apoio)'>
                  {statuses[ad.status]} · {ad.category}
                </p>
                {!compact && (
                  <p className='mt-2 text-xs text-(--texto-apoio)'>
                    {ad.views} visualizações · {ad.contactCount} contatos
                    demonstrativos
                  </p>
                )}
              </div>
              <div className='flex flex-wrap gap-2'>
                <Action secondary as={Link} to={'/meus-servicos/' + ad.id}>
                  Gerenciar ↗
                </Action>
                <Action as={Link} to={'/meus-servicos/' + ad.id + '/editar'}>
                  Editar anúncio ↗
                </Action>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <Empty to='/anunciar-servico'>
          {data.ads.length
            ? 'Nenhum anúncio encontrado neste filtro.'
            : 'Sua empresa ainda não tem anúncios. Apresente o primeiro serviço.'}
        </Empty>
      )}
      {!compact && (
        <div className='flex flex-wrap gap-3'>
          <Action as={Link} to='/anunciar-servico'>
            + Novo anúncio
          </Action>
          <Action secondary as={Link} to='/dashboard'>
            Ver desempenho
          </Action>
        </div>
      )}
    </div>
  );
}
