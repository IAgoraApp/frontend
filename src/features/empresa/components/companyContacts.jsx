import { useState } from 'react';
import { Link } from 'react-router-dom';
import { companyId, contactStatuses, formatDate, normalize } from '../content';
import { Action, Card, Empty } from './empresaUi';

export default function CompanyContacts({ data, contact, onReply, onStatus }) {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');
  const contacts = data.contacts.filter(
    item => !item.companyId || item.companyId === companyId
  );
  if (contact)
    return (
      <div className='grid items-start gap-6 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]'>
        <Card>
          <div className='space-y-4'>
            {contact.messages.map(message => (
              <div
                key={message.id}
                className={
                  'rounded-xl p-5 ' +
                  (message.author === 'company'
                    ? 'ml-4 bg-(--laranja-fundo) sm:ml-12'
                    : 'mr-4 bg-(--azul-fundo) sm:mr-12')
                }
              >
                <p className='mb-2 text-xs font-bold text-(--texto-apoio)'>
                  {message.author === 'company'
                    ? data.company.name
                    : contact.name}{' '}
                  · {formatDate(message.date)}
                </p>
                <p className='whitespace-pre-wrap leading-relaxed'>
                  {message.text}
                </p>
              </div>
            ))}
          </div>
          <form
            className='mt-6 space-y-4'
            onSubmit={event => {
              event.preventDefault();
              if (!response.trim()) {
                setError('Escreva uma resposta antes de registrar.');
                return;
              }
              if (onReply(contact, response.trim())) {
                setResponse('');
                setError('');
              }
            }}
          >
            <label
              htmlFor='company-response'
              className='flex flex-col gap-2 text-sm font-bold'
            >
              Sua resposta
              <textarea
                id='company-response'
                value={response}
                onChange={event => setResponse(event.target.value)}
                required
                maxLength={2000}
                rows={4}
                className='rounded-lg border border-[#dbe5ed] p-4 font-normal'
              />
            </label>
            {error && (
              <p role='alert' className='text-sm text-red-700'>
                {error}
              </p>
            )}
            <p className='text-xs text-(--texto-apoio)'>
              A resposta será registrada somente neste navegador. Nenhuma
              mensagem será enviada ao cliente.
            </p>
            <div className='flex flex-wrap gap-3'>
              <Action type='submit'>Registrar resposta</Action>
              <Action
                secondary
                type='button'
                onClick={() =>
                  onStatus(
                    contact,
                    contact.status === 'done' ? 'progress' : 'done'
                  )
                }
              >
                {contact.status === 'done'
                  ? 'Reabrir contato'
                  : 'Marcar concluído'}
              </Action>
            </div>
          </form>
        </Card>
        <Card title='Sobre este contato'>
          <dl className='space-y-4 text-sm'>
            {[
              ['Serviço', contact.service],
              ['Contato informado', contact.contact],
              ['Status', contactStatuses[contact.status]],
              ['Primeiro contato', formatDate(contact.createdAt)],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className='font-bold'>{label}</dt>
                <dd className='mt-1 text-(--texto-apoio)'>{value}</dd>
              </div>
            ))}
          </dl>
          <p className='my-5 rounded-lg bg-(--azul-fundo) p-4 text-sm'>
            Confirme metragem, região e data antes de preparar uma proposta.
          </p>
          {data.ads.some(ad => ad.id === contact.adId) && (
            <Action secondary as={Link} to={'/meus-servicos/' + contact.adId}>
              Consultar o anúncio
            </Action>
          )}
        </Card>
      </div>
    );
  const visible = contacts.filter(
    item =>
      (filter === 'all' || item.status === filter) &&
      normalize(item.name + item.service + item.messages[0]?.text).includes(
        normalize(search)
      )
  );
  return (
    <div className='space-y-5'>
      <div
        className='flex flex-wrap gap-3'
        role='group'
        aria-label='Status dos contatos'
      >
        {[['all', 'Todos'], ...Object.entries(contactStatuses)].map(
          ([key, label]) => (
            <Action
              key={key}
              secondary={filter !== key}
              aria-pressed={filter === key}
              onClick={() => setFilter(key)}
            >
              {label} (
              {
                contacts.filter(item => key === 'all' || item.status === key)
                  .length
              }
              )
            </Action>
          )
        )}
      </div>
      <input
        type='search'
        aria-label='Buscar contato'
        value={search}
        onChange={event => setSearch(event.target.value)}
        placeholder='Buscar nome, serviço ou mensagem...'
        className='min-h-13 w-full rounded-lg border border-[#dbe5ed] px-4'
      />
      <div className='space-y-4'>
        {visible.map(item => (
          <Card key={item.id}>
            <div className='flex flex-wrap items-center justify-between gap-5'>
              <div className='min-w-0 flex-1'>
                <h2 className='text-xl font-bold'>{item.name}</h2>
                <p className='mt-2 text-sm text-(--texto-apoio)'>
                  {item.service} · {contactStatuses[item.status]}
                </p>
                <p className='mt-3 line-clamp-2 text-sm'>
                  {item.messages.at(-1)?.text}
                </p>
              </div>
              <Action secondary as={Link} to={'/contatos/' + item.id}>
                Ver conversa ↗
              </Action>
            </div>
          </Card>
        ))}
      </div>
      {!visible.length && (
        <Empty>
          Nenhum contato encontrado. Os pedidos recebidos pelo perfil público
          aparecem aqui.
        </Empty>
      )}
    </div>
  );
}
