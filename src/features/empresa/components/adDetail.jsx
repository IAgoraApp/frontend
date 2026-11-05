import { useState } from 'react';
import { Link } from 'react-router-dom';
import { statuses, formatDate } from '../content';
import { Action, Card, Metrics, ServiceImage } from './empresaUi';

export default function AdDetail({ ad, onAction }) {
  const [tab, setTab] = useState('overview');
  return (
    <div className='space-y-6'>
      <p className='text-sm text-(--texto-apoio)'>
        {statuses[ad.status]} · Atualizado em {formatDate(ad.updatedAt)}
      </p>
      <div className='flex flex-wrap gap-3'>
        <Action as={Link} to={'/meus-servicos/' + ad.id + '/editar'}>
          Editar anúncio
        </Action>
        {ad.status === 'active' ? (
          <Action secondary onClick={() => onAction('pause')}>
            Pausar
          </Action>
        ) : ad.status === 'paused' ? (
          <Action secondary onClick={() => onAction('activate')}>
            Reativar anúncio
          </Action>
        ) : ad.status === 'expired' ? (
          <Action secondary onClick={() => onAction('renew')}>
            Renovar anúncio
          </Action>
        ) : (
          <Action
            secondary
            as={Link}
            to={'/meus-servicos/' + ad.id + '/previa'}
          >
            Revisar publicação
          </Action>
        )}
        <Action secondary as={Link} to={'/meus-servicos/' + ad.id + '/previa'}>
          Ver prévia pública
        </Action>
        <button
          type='button'
          onClick={() => onAction('delete')}
          className='min-h-12 px-4 text-sm font-bold text-red-700'
        >
          Excluir anúncio
        </button>
      </div>
      <div
        className='flex flex-wrap gap-3'
        role='group'
        aria-label='Informações do anúncio'
      >
        {[
          ['overview', 'Visão geral'],
          ['performance', 'Desempenho'],
          ['photos', 'Fotos'],
        ].map(([key, label]) => (
          <Action
            key={key}
            secondary={tab !== key}
            aria-pressed={tab === key}
            onClick={() => setTab(key)}
          >
            {label}
          </Action>
        ))}
      </div>
      {tab === 'overview' && (
        <div className='grid gap-6 lg:grid-cols-2'>
          <ServiceImage ad={ad} className='aspect-[1.5] rounded-xl' />
          <Card title='Informações'>
            <dl className='grid grid-cols-[auto_minmax(0,1fr)] gap-x-5 gap-y-4 text-sm'>
              {[
                ['Categoria', ad.category],
                ['Atendimento', ad.attendance],
                ['Preço', ad.price],
                ['Região', ad.region],
                ['Disponibilidade', ad.availability],
                ['Telefone', ad.phone],
                ['E-mail', ad.email],
              ].map(([label, value]) => (
                <div key={label} className='contents'>
                  <dt className='text-(--texto-apoio)'>{label}</dt>
                  <dd>{value || 'Não informado'}</dd>
                </div>
              ))}
            </dl>
          </Card>
          <Card title='Descrição' className='lg:col-span-2'>
            <p className='whitespace-pre-wrap leading-relaxed'>
              {ad.description ||
                'Adicione uma descrição para apresentar seu serviço.'}
            </p>
          </Card>
        </div>
      )}
      {tab === 'performance' && (
        <Metrics
          items={[
            ['Visualizações (exemplo)', ad.views],
            ['Contatos do anúncio', ad.contactCount],
            [
              'Conversão em contato',
              ad.views
                ? ((ad.contactCount / ad.views) * 100).toLocaleString('pt-BR', {
                    maximumFractionDigits: 1,
                  }) + '%'
                : '0%',
            ],
          ]}
        />
      )}
      {tab === 'photos' && (
        <Card title='Fotos do anúncio'>
          <div className='mb-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            {ad.photos.length ? (
              ad.photos.map((photo, index) => (
                <img
                  key={index}
                  src={photo}
                  alt={'Foto do serviço ' + (index + 1)}
                  className='aspect-[1.5] w-full rounded-lg object-cover'
                />
              ))
            ) : (
              <p className='text-(--texto-apoio)'>
                Nenhuma foto personalizada. A imagem exibida é ilustrativa.
              </p>
            )}
          </div>
          <Action as={Link} to={'/meus-servicos/' + ad.id + '/fotos'}>
            Editar fotos
          </Action>
        </Card>
      )}
    </div>
  );
}
