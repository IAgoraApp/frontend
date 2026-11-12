import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Botao } from '../../../shared/ui/index';
import {
  coresRoscaServicos,
  origensAcessoEmpresa,
  periodosPainel,
  serieBaseVisualizacoes,
} from '../content';
import { CartaoEmpresa, GradeMetricasEmpresa } from './empresaUi';
import ListaAnuncios from './adsList';

export default function DashboardEmpresa({ dados }) {
  const [periodo, setPeriodo] = useState(30);

  const totalBaseVisualizacoes = dados.anuncios.reduce(
    (soma, item) => soma + item.visualizacoes,
    0
  );
  const totalBaseContatos = dados.anuncios.reduce(
    (soma, item) => soma + item.contatosRecebidos,
    0
  );
  const fator =
    periodosPainel.find(item => item.dias === periodo)?.fator ?? 1;

  const visualizacoesPeriodo = dados.exemplo
    ? Math.round(totalBaseVisualizacoes * fator)
    : totalBaseVisualizacoes;
  const contatosPeriodo = dados.exemplo
    ? Math.round(totalBaseContatos * fator)
    : totalBaseContatos;
  const cliquesPerfil = dados.exemplo
    ? Math.round(visualizacoesPeriodo * 0.24)
    : dados.anuncios.length * 12;
  const taxaConversao = visualizacoesPeriodo
    ? `${((contatosPeriodo / visualizacoesPeriodo) * 100).toLocaleString(
        'pt-BR',
        { maximumFractionDigits: 1 }
      )}%`
    : '0%';

  const pontosSerie = serieBaseVisualizacoes.map((item, indice) => {
    const valor = Math.round((item.percentual / 100) * visualizacoesPeriodo);
    const x = 40 + indice * 91;
    const y = 185 - (item.percentual / 100) * 145;
    return { ...item, valor, x, y };
  });

  const linhaPontos = pontosSerie.map(p => `${p.x},${p.y}`).join(' ');
  const areaPontos = `40,185 ${linhaPontos} ${pontosSerie.at(-1).x},185`;

  const raio = 58;
  const circunferencia = 2 * Math.PI * raio;
  let deslocamentoAcumulado = 0;

  return (
    <div className='space-y-8'>
      <div className='flex flex-wrap items-center justify-between gap-4'>
        <label
          htmlFor='painel-periodo'
          className='flex items-center gap-3 text-sm font-bold text-(--azul-titulo)'
        >
          <span>Período</span>
          <select
            id='painel-periodo'
            value={periodo}
            onChange={evento => setPeriodo(Number(evento.target.value))}
            className='min-h-11 rounded-full border border-[#dbe5ed] bg-white px-4 text-sm font-semibold text-(--azul-titulo)'
          >
            {periodosPainel.map(item => (
              <option key={item.dias} value={item.dias}>
                {item.rotulo}
              </option>
            ))}
          </select>
        </label>

        <Botao
          como={Link}
          to='/empresa/anunciar'
          cor='laranja'
          classe='min-h-[44px]!'
        >
          + Novo anúncio
        </Botao>
      </div>

      <GradeMetricasEmpresa
        colunas={4}
        itens={[
          {
            rotulo: dados.exemplo
              ? 'Visualizações (exemplo)'
              : 'Visualizações',
            valor: visualizacoesPeriodo,
            apoio: 'Pessoas que abriram seus serviços',
          },
          {
            rotulo: 'Contatos',
            valor: contatosPeriodo,
            apoio: 'Pedidos de orçamento recebidos',
            destaque: true,
          },
          {
            rotulo: 'Cliques no perfil',
            valor: cliquesPerfil,
            apoio: 'Visitas na página da empresa',
          },
          {
            rotulo: 'Taxa de conversão',
            valor: taxaConversao,
            apoio: 'Relação entre acessos e contatos',
          },
        ]}
      />

      <CartaoEmpresa
        titulo='Visualizações ao longo do tempo'
        subtitulo='Evolução ilustrativa das visualizações acumuladas no período selecionado.'
      >
        <div className='w-full overflow-x-auto'>
          <svg
            viewBox='0 0 900 220'
            role='img'
            aria-label='Gráfico de visualizações dos anúncios ao longo do tempo'
            className='h-56 w-full min-w-[520px]'
          >
            <defs>
              <linearGradient
                id='areaVisualizacoesEmpresa'
                x1='0'
                y1='0'
                x2='0'
                y2='1'
              >
                <stop offset='0%' stopColor='#e03b00' stopOpacity='0.22' />
                <stop offset='100%' stopColor='#e03b00' stopOpacity='0.02' />
              </linearGradient>
            </defs>

            {[40, 88, 136, 185].map(y => (
              <line
                key={y}
                x1='30'
                x2='880'
                y1={y}
                y2={y}
                stroke='#e6edf2'
                strokeWidth='1'
              />
            ))}

            <polygon points={areaPontos} fill='url(#areaVisualizacoesEmpresa)' />
            <polyline
              points={linhaPontos}
              fill='none'
              stroke='#e03b00'
              strokeWidth='3.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            />

            {pontosSerie.map(ponto => (
              <g key={ponto.rotulo}>
                <circle
                  cx={ponto.x}
                  cy={ponto.y}
                  r='5'
                  fill='#ffffff'
                  stroke='#e03b00'
                  strokeWidth='3'
                />
                <text
                  x={ponto.x}
                  y='208'
                  textAnchor='middle'
                  fill='#526579'
                  fontSize='11'
                  fontWeight='600'
                >
                  {ponto.rotulo}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </CartaoEmpresa>

      <div className='grid gap-6 lg:grid-cols-2'>
        <CartaoEmpresa titulo='Visualizações por serviço'>
          <div className='flex flex-col items-center gap-6 sm:flex-row'>
            <div className='relative flex size-40 shrink-0 items-center justify-center'>
              <svg
                viewBox='0 0 160 160'
                className='size-full -rotate-90'
                role='img'
                aria-label='Distribuição das visualizações por anúncio'
              >
                <circle
                  cx='80'
                  cy='80'
                  r={raio}
                  fill='none'
                  stroke='#e6edf2'
                  strokeWidth='22'
                />
                {totalBaseVisualizacoes > 0 &&
                  dados.anuncios.map((anuncio, indice) => {
                    if (!anuncio.visualizacoes) return null;
                    const fracao = anuncio.visualizacoes / totalBaseVisualizacoes;
                    const comprimento = fracao * circunferencia;
                    const deslocamento = -deslocamentoAcumulado * circunferencia;
                    deslocamentoAcumulado += fracao;
                    return (
                      <circle
                        key={anuncio.id}
                        cx='80'
                        cy='80'
                        r={raio}
                        fill='none'
                        stroke={
                          coresRoscaServicos[indice % coresRoscaServicos.length]
                        }
                        strokeWidth='22'
                        strokeDasharray={`${comprimento} ${circunferencia}`}
                        strokeDashoffset={deslocamento}
                      />
                    );
                  })}
              </svg>
              <div className='absolute inset-0 flex flex-col items-center justify-center text-center'>
                <strong className='font-titulo text-xl font-extrabold text-(--azul-titulo)'>
                  {totalBaseVisualizacoes}
                </strong>
                <span className='text-xs text-(--texto-apoio)'>acessos</span>
              </div>
            </div>

            <ul className='w-full space-y-3'>
              {dados.anuncios.map((anuncio, indice) => {
                const percentual = totalBaseVisualizacoes
                  ? Math.round(
                      (anuncio.visualizacoes / totalBaseVisualizacoes) * 100
                    )
                  : 0;
                const cor =
                  coresRoscaServicos[indice % coresRoscaServicos.length];
                return (
                  <li key={anuncio.id} className='space-y-1.5 text-sm'>
                    <div className='flex items-center justify-between gap-3'>
                      <span className='flex items-center gap-2 font-semibold text-(--azul-titulo)'>
                        <span
                          aria-hidden='true'
                          className='size-2.5 shrink-0 rounded-full'
                          style={{ backgroundColor: cor }}
                        />
                        {anuncio.titulo || 'Rascunho sem título'}
                      </span>
                      <span className='font-bold tabular-nums text-(--azul-titulo)'>
                        {percentual}%
                      </span>
                    </div>
                    <div className='h-2 overflow-hidden rounded-full bg-(--azul-fundo)'>
                      <div
                        className='h-full rounded-full'
                        style={{
                          width: `${percentual}%`,
                          backgroundColor: cor,
                        }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </CartaoEmpresa>

        <CartaoEmpresa titulo='Origem dos acessos'>
          <div className='space-y-4'>
            {origensAcessoEmpresa.map(origem => (
              <div key={origem.id} className='space-y-1.5'>
                <div className='flex items-center justify-between text-sm'>
                  <span className='font-semibold text-(--azul-titulo)'>
                    {origem.rotulo}
                  </span>
                  <strong className='tabular-nums text-(--azul-titulo)'>
                    {origem.percentual}%
                  </strong>
                </div>
                <div className='h-2.5 overflow-hidden rounded-full bg-[#f4f7fa]'>
                  <div
                    className='h-full rounded-full bg-(--azul-titulo)'
                    style={{ width: `${origem.percentual}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className='mt-6 flex flex-wrap gap-3 border-t border-[#e6edf2] pt-5'>
            <Botao
              como={Link}
              to='/empresa/contatos'
              variante='secundario'
              classe='min-h-[44px]!'
            >
              Ver contatos ({dados.contatos.length})
            </Botao>
            <Botao
              como={Link}
              to='/empresa/perfil'
              variante='secundario'
              classe='min-h-[44px]!'
            >
              Revisar perfil
            </Botao>
          </div>
        </CartaoEmpresa>
      </div>

      <section className='space-y-4'>
        <div className='flex flex-wrap items-center justify-between gap-3'>
          <h2 className='font-titulo text-2xl font-extrabold text-(--azul-titulo)'>
            Seus anúncios
          </h2>
          <Link
            to='/empresa/anuncios'
            className='text-sm font-bold text-(--laranja-principal) hover:underline'
          >
            Gerenciar em tela cheia ↗
          </Link>
        </div>
        <ListaAnuncios dados={dados} />
      </section>
    </div>
  );
}
