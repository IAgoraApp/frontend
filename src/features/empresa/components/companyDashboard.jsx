import { useState } from 'react';
import { Action, Card, Metrics } from './empresaUi';
import { Link } from 'react-router-dom';
import AdsList from './adsList';

export default function CompanyDashboard({ data }) {
  const [period, setPeriod] = useState(30);
  const views = data.ads.reduce((sum, ad) => sum + ad.views, 0);
  const contacts = data.ads.reduce((sum, ad) => sum + ad.contactCount, 0);
  const factor = period === 7 ? 0.25 : period === 90 ? 1.8 : 1;
  const amount = data.example ? Math.round(views * factor) : views;
  const series = data.example
    ? [12, 27, 24, 45, 62, 43, 81, 64, 83, 100].map(
        value => (value * amount) / 100
      )
    : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  const max = Math.max(...series, 1);
  const points = series
    .map((value, index) => index * 100 + ',' + (180 - (value / max) * 150))
    .join(' ');
  return (
    <div className='space-y-6'>
      <div className='flex flex-wrap items-center justify-between gap-4'>
        <label htmlFor='company-period' className='text-sm font-bold'>
          Período{' '}
          <select
            id='company-period'
            value={period}
            onChange={event => setPeriod(Number(event.target.value))}
            className='ml-3 min-h-12 rounded-full border border-[#dbe5ed] bg-white px-4'
          >
            {[7, 30, 90].map(value => (
              <option key={value} value={value}>
                Últimos {value} dias
              </option>
            ))}
          </select>
        </label>
        <Action as={Link} to='/anunciar-servico'>
          + Novo anúncio
        </Action>
      </div>
      <Metrics
        items={[
          [data.example ? 'Visualizações (exemplo)' : 'Visualizações', amount],
          ['Contatos dos anúncios', contacts],
          [
            'Anúncios ativos',
            data.ads.filter(ad => ad.status === 'active').length,
          ],
          [
            'Conversão em contato',
            views
              ? ((contacts / views) * 100).toLocaleString('pt-BR', {
                  maximumFractionDigits: 1,
                }) + '%'
              : '0%',
          ],
        ]}
      />
      <Card title='Visualizações ao longo do tempo'>
        <svg
          viewBox='0 0 900 200'
          role='img'
          aria-label='Evolução ilustrativa das visualizações'
          className='h-52 w-full sm:h-64'
          preserveAspectRatio='none'
        >
          {[30, 80, 130, 180].map(y => (
            <line key={y} x1='0' x2='900' y1={y} y2={y} stroke='#e6edf2' />
          ))}
          <polyline
            points={points}
            fill='none'
            stroke='#d54c15'
            strokeWidth='3'
            vectorEffect='non-scaling-stroke'
          />
        </svg>
        <p className='mt-4 text-xs text-(--texto-apoio)'>
          Gráfico ilustrativo com dados de exemplo. Não há rastreamento de
          acessos conectado.
        </p>
      </Card>
      <div className='grid gap-6 lg:grid-cols-2'>
        <Card title='Visualizações por serviço'>
          <ul className='space-y-4'>
            {data.ads.map(ad => (
              <li key={ad.id}>
                <div className='mb-2 flex justify-between gap-3 text-sm'>
                  <span>{ad.title || 'Rascunho'}</span>
                  <strong>
                    {views ? Math.round((ad.views / views) * 100) : 0}%
                  </strong>
                </div>
                <div className='h-2 rounded-full bg-(--azul-fundo)'>
                  <div
                    className='h-full rounded-full bg-(--laranja-principal)'
                    style={{
                      width: (views ? (ad.views / views) * 100 : 0) + '%',
                    }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </Card>
        <Card title='Sua operação em um lugar'>
          <p className='mb-5 text-(--texto-apoio)'>
            Acompanhe os anúncios e os contatos para organizar seus próximos
            atendimentos.
          </p>
          <div className='flex flex-wrap gap-3'>
            <Action secondary as={Link} to='/contatos'>
              Ver contatos
            </Action>
            <Action secondary as={Link} to='/perfil-empresa'>
              Revisar perfil
            </Action>
          </div>
        </Card>
      </div>
      <AdsList data={data} />
    </div>
  );
}
