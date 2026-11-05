import { useState } from 'react';
import CheckStat from '../assets/stat-check.svg';
import ChartStat from '../assets/stat-chart.svg';
import FlameStat from '../assets/stat-flame.svg';
import { Title } from '../../../shared/ui';
import { addDays, dateKey, formatDate } from '../utils/dates';
import { EmptyState, RoutineButton, RoutineHeading } from './routineUi';
import TaskRow from './taskRow';
import classes from '../routineClasses';

export default function HistoryView({
  completions,
  pending,
  onBack,
  onOpen,
  onUndo,
}) {
  const [period, setPeriod] = useState('month');
  const [visible, setVisible] = useState(10);
  const today = dateKey();
  const start =
    period === 'month'
      ? `${today.slice(0, 7)}-01`
      : period === 'week'
        ? addDays(today, -6)
        : '0000-01-01';
  const completed = completions
    .filter(item => dateKey(new Date(item.completedAt)) >= start)
    .sort((a, b) => b.completedAt.localeCompare(a.completedAt));
  const pendingCount = pending.filter(
    item => item.occurrenceDate >= start && item.occurrenceDate <= today
  ).length;
  const rate = completed.length
    ? Math.round((completed.length / (completed.length + pendingCount)) * 100)
    : 0;
  const completedDays = new Set(
    completions.map(item => dateKey(new Date(item.completedAt)))
  );
  let day = completedDays.has(today) ? today : addDays(today, -1);
  let streak = 0;
  while (completedDays.has(day)) {
    streak++;
    day = addDays(day, -1);
  }
  const stats = [
    { label: 'Tarefas concluídas', value: completed.length, icon: CheckStat },
    { label: 'Taxa de conclusão', value: `${rate}%`, icon: ChartStat },
    {
      label: 'Sequência atual',
      value: `${streak} ${streak === 1 ? 'dia' : 'dias'}`,
      icon: FlameStat,
    },
  ];

  return (
    <div>
      <RoutineHeading
        ribbon
        title='Histórico de conclusão'
        description='Acompanhe o seu progresso ao longo do tempo.'
        onBack={onBack}
      >
        <select
          className={classes.periodSelect}
          aria-label='Período do histórico'
          value={period}
          onChange={event => {
            setPeriod(event.target.value);
            setVisible(10);
          }}
        >
          <option value='month'>Esse mês</option>
          <option value='week'>Últimos 7 dias</option>
          <option value='all'>Todo o período</option>
        </select>
      </RoutineHeading>
      <dl className={classes.statistics}>
        {stats.map(stat => (
          <div key={stat.label} className={classes.statistic}>
            <span className={classes.statisticIcon}>
              <img src={stat.icon} alt='' />
            </span>
            <div>
              <dt>{stat.label}</dt>
              <dd>{stat.value}</dd>
            </div>
          </div>
        ))}
      </dl>
      <section
        className={classes.completedSection}
        aria-labelledby='completed-heading'
      >
        <Title as='h2' id='completed-heading' className={classes.cardTitle}>
          Tarefas concluídas
        </Title>
        {completed.length ? (
          <div className={classes.completedTasks}>
            {completed.slice(0, visible).map(task => (
              <TaskRow
                key={task.id}
                task={task}
                variant='history'
                dateLabel={`${formatDate(task.occurrenceDate)} · ${task.time}`}
                onOpen={onOpen}
                onUndo={onUndo}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title='Cada passo vai aparecer aqui.'
            description='Você ainda não concluiu tarefas neste período.'
          >
            <RoutineButton tone='secondary' onClick={onBack}>
              Voltar à rotina
            </RoutineButton>
          </EmptyState>
        )}
        {completed.length > visible && (
          <RoutineButton
            tone='secondary'
            className={classes.loadMore}
            onClick={() => setVisible(count => count + 10)}
          >
            Ver mais conclusões
          </RoutineButton>
        )}
      </section>
    </div>
  );
}
