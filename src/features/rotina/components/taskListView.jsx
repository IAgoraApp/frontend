import { useState } from 'react';
import { categories } from '../content';
import { dateKey, formatDate, relativeDay } from '../utils/dates';
import { EmptyState, RoutineButton, RoutineHeading } from './routineUi';
import TaskRow from './taskRow';
import classes from '../routineClasses';

export default function TaskListView({
  tasks,
  onBack,
  onCreate,
  onAssistant,
  onOpen,
  onComplete,
  onAction,
}) {
  const [category, setCategory] = useState('all');
  const [visibleDays, setVisibleDays] = useState(2);
  const filtered = tasks.filter(
    task => category === 'all' || task.category === category
  );
  const groups = [...Map.groupBy(filtered, task => task.occurrenceDate)];

  return (
    <div>
      <RoutineHeading
        title='Lista de tarefas'
        description='Veja todas as suas tarefas e gerencie sua rotina.'
        onBack={onBack}
      >
        <RoutineButton className={classes.smallButton} onClick={onCreate}>
          Criar tarefa <span aria-hidden='true'>+</span>
        </RoutineButton>
      </RoutineHeading>
      <div
        className={classes.categoryFilters}
        role='group'
        aria-label='Filtrar tarefas por categoria'
      >
        {[{ id: 'all', label: 'Todas' }, ...categories].map(item => (
          <button
            key={item.id}
            type='button'
            aria-pressed={category === item.id}
            className={category === item.id ? classes.activeFilter : ''}
            onClick={() => {
              setCategory(item.id);
              setVisibleDays(2);
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
      {groups.length ? (
        <>
          <div className={classes.taskGroups}>
            {groups.slice(0, visibleDays).map(([day, dayTasks]) => (
              <section key={day} aria-label={`Tarefas de ${formatDate(day)}`}>
                <h2 className={classes.dateGroupHeading}>
                  {day < dateKey() ? 'Pendente' : relativeDay(day)} ·{' '}
                  {formatDate(day)}
                </h2>
                <div>
                  {dayTasks.map(task => (
                    <TaskRow
                      key={task.occurrenceId}
                      task={task}
                      onOpen={onOpen}
                      onComplete={onComplete}
                      onAction={onAction}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
          {groups.length > visibleDays && (
            <RoutineButton
              tone='secondary'
              className={classes.loadMore}
              onClick={() => setVisibleDays(count => count + 7)}
            >
              Ver próximos dias
            </RoutineButton>
          )}
        </>
      ) : (
        <EmptyState
          title={
            category === 'all' ? undefined : 'Tudo em dia nesta categoria.'
          }
          description={
            category === 'all'
              ? undefined
              : 'Nenhuma tarefa pendente para os próximos 30 dias.'
          }
          onCreate={onCreate}
          onAssistant={onAssistant}
        />
      )}
    </div>
  );
}
