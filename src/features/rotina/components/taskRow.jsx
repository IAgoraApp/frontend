import { Check, MoreVertical } from 'lucide-react';
import { CategoryPill, RoutineIcon } from './routineUi';
import { relativeDay } from '../utils/dates';
import classes from '../routineClasses';

export default function TaskRow({
  task,
  onOpen,
  onComplete,
  onAction,
  onUndo,
  variant = 'list',
  dateLabel,
}) {
  const done = task.completed || variant === 'history';
  function action(event, type) {
    event.currentTarget.closest('details')?.removeAttribute('open');
    onAction(type, task);
  }

  return (
    <article
      className={`${classes.taskRow} ${classes[`taskRow_${variant}`] ?? ''}`}
    >
      <button
        type='button'
        role='checkbox'
        aria-checked={Boolean(done)}
        aria-label={
          done
            ? `Desfazer conclusão de ${task.title}`
            : `Concluir ${task.title}`
        }
        className={`${classes.taskCheckbox} ${done ? classes.taskChecked : ''}`}
        onClick={() => (done ? onUndo?.(task) : onComplete(task))}
      >
        {done && <Check size={14} strokeWidth={3} aria-hidden='true' />}
      </button>
      <RoutineIcon
        name={task.icon}
        className={classes.taskIcon}
        data-task-icon
      />
      <button
        type='button'
        className={classes.taskCopy}
        title={task.title}
        onClick={() => onOpen(task)}
      >
        <strong>{task.title}</strong>
        {(variant === 'upcoming' ||
          variant === 'history' ||
          variant === 'day') && (
          <span>
            {dateLabel ?? `${relativeDay(task.occurrenceDate)} · ${task.time}`}
          </span>
        )}
      </button>
      {variant === 'list' && (
        <time className={classes.taskTime}>{task.time}</time>
      )}
      <CategoryPill category={task.category} neutral={variant === 'upcoming'} />
      {onAction && !done && (
        <details className={classes.taskMenu} name='routine-task-actions'>
          <summary aria-label={`Opções para ${task.title}`}>
            <MoreVertical size={19} aria-hidden='true' />
          </summary>
          <div className={classes.menuItems}>
            {[
              ['detail', 'Ver detalhes'],
              ['edit', 'Editar'],
              ['reschedule', 'Reagendar'],
              ['reminder', 'Ajustar lembrete'],
              ['recurrence', 'Repetição'],
              ['delete', 'Excluir tarefa'],
            ].map(([type, label]) => (
              <button
                key={type}
                type='button'
                onClick={event => action(event, type)}
              >
                {label}
              </button>
            ))}
          </div>
        </details>
      )}
    </article>
  );
}
