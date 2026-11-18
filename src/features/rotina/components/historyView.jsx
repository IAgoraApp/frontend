import { useState } from 'react';
import EstatisticaConcluido from '../assets/stat-check.svg';
import EstatisticaGrafico from '../assets/stat-chart.svg';
import EstatisticaSequencia from '../assets/stat-flame.svg';
import { useCategoriasRotina } from '../hooks/useRotinaBanco';
import { adicionarDias, chaveData } from '../utils/dates';
import { CabecalhoRotina } from './routineUi';
import ExtratoRotina from './routineStatement';
import classesRotina from '../routineClasses';

export default function VisaoHistorico({ conclusoes, pendentes, aoAbrir }) {
  const [periodo, setPeriodo] = useState('mes');
  const categorias = useCategoriasRotina();
  const hoje = chaveData();
  const inicio =
    periodo === 'mes'
      ? `${hoje.slice(0, 7)}-01`
      : periodo === 'semana'
        ? adicionarDias(hoje, -6)
        : '0000-01-01';
  const concluidas = conclusoes
    .filter(item => chaveData(new Date(item.completedAt)) >= inicio)
    .sort((a, b) => b.completedAt.localeCompare(a.completedAt));
  const quantidadePendentes = pendentes.filter(
    item => item.occurrenceDate >= inicio && item.occurrenceDate <= hoje
  ).length;
  const taxa = concluidas.length
    ? Math.round(
        (concluidas.length / (concluidas.length + quantidadePendentes)) * 100
      )
    : 0;
  const diasConcluidos = new Set(
    conclusoes.map(item => chaveData(new Date(item.completedAt)))
  );
  let dia = diasConcluidos.has(hoje) ? hoje : adicionarDias(hoje, -1);
  let sequencia = 0;
  while (diasConcluidos.has(dia)) {
    sequencia++;
    dia = adicionarDias(dia, -1);
  }
  const estatisticas = [
    {
      rotulo: 'Tarefas concluídas',
      valor: concluidas.length,
      icone: EstatisticaConcluido,
      tom: 'verde',
    },
    {
      rotulo: 'Taxa de conclusão',
      valor: `${taxa}%`,
      icone: EstatisticaGrafico,
      tom: 'azul',
    },
    {
      rotulo: 'Sequência atual',
      valor: `${sequencia} ${sequencia === 1 ? 'dia' : 'dias'}`,
      icone: EstatisticaSequencia,
      tom: 'laranja',
    },
  ];

  const registros = concluidas.map(tarefa => ({
    id: tarefa.id,
    data: chaveData(new Date(tarefa.completedAt)),
    tipo: 'tarefa',
    titulo: tarefa.title,
    categoria: categorias.find(c => c.id === tarefa.category)?.rotulo,
    detalhe: new Date(tarefa.completedAt).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    }),
    situacao: 'Concluída',
    estado: 'concluida',
    icone: tarefa.icon,
    aoAbrir: () => aoAbrir(tarefa),
  }));

  return (
    <div className='rotina-extrato'>
      <CabecalhoRotina titulo='Histórico'>
        <select
          className='rotina-extrato-controle'
          aria-label='Período do histórico'
          value={periodo}
          onChange={evento => setPeriodo(evento.target.value)}
        >
          <option value='mes'>Este mês</option>
          <option value='semana'>Últimos 7 dias</option>
          <option value='tudo'>Todo o período</option>
        </select>
      </CabecalhoRotina>
      <dl
        className={classesRotina.estatisticas + ' rotina-extrato-estatisticas'}
      >
        {estatisticas.map(estatistica => (
          <div
            key={estatistica.rotulo}
            className={classesRotina.estatistica}
            data-tom={estatistica.tom}
          >
            <span className={classesRotina.iconeEstatistica}>
              <img src={estatistica.icone} alt='' />
            </span>
            <div>
              <dt>{estatistica.rotulo}</dt>
              <dd>{estatistica.valor}</dd>
            </div>
          </div>
        ))}
      </dl>
      <section
        className='rotina-extrato-painel'
        aria-labelledby='historico-lista-titulo'
      >
        <h2 id='historico-lista-titulo' className='rotina-extrato-titulo'>
          Tarefas concluídas
        </h2>
        <ExtratoRotina
          registros={registros}
          rotulo='Histórico de tarefas concluídas'
          vazio='Nenhuma tarefa concluída neste período.'
          decrescente
        />
      </section>
    </div>
  );
}
