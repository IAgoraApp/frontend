import { categories, frequencies, reminderOptions } from '../content';
import { relativeDay } from '../utils/dates';
import { ModalHeading, Notice, RoutineButton } from './routineUi';
import classes from '../routineClasses';

export default function TaskDetail({
  task,
  onAction,
  onComplete,
  onUndo,
  titleId,
}) {
  const category = categories.find(item => item.id === task.category)?.label;
  const frequency =
    frequencies.find(item => item.id === task.frequency)?.label ??
    'Sem repetição';
  const reminder =
    reminderOptions.find(item => item.value === task.reminder)?.label ??
    'Sem lembrete';

  return (
    <div className={classes.modalContent}>
      <ModalHeading
        artwork
        id={titleId}
        title={task.title}
        description={`${category} · ${relativeDay(task.occurrenceDate)} às ${task.time} · ${frequency}.`}
      />
      <Notice
        title={
          task.completed ? 'Mais uma tarefa feita.' : 'Uma tarefa possível'
        }
      >
        {task.notes ||
          'Um passo de cada vez. Reserve um momento do seu dia para esta tarefa.'}
      </Notice>
      <div
        className={`${classes.actions} ${classes.detailActions}`}
        data-actions
      >
        {task.completed ? (
          <RoutineButton className='col-span-full' onClick={() => onUndo(task)}>
            Desfazer conclusão
          </RoutineButton>
        ) : (
          <>
            <RoutineButton
              className='col-span-full'
              onClick={() => onComplete(task)}
            >
              Marcar como concluída
            </RoutineButton>
            <RoutineButton
              tone='secondary'
              onClick={() => onAction('edit', task)}
            >
              Editar
            </RoutineButton>
            <RoutineButton
              tone='secondary'
              onClick={() => onAction('reschedule', task)}
            >
              Reagendar
            </RoutineButton>
          </>
        )}
      </div>
      {!task.completed && (
        <div
          className={`${classes.actions} ${classes.detailActions}`}
          data-actions
        >
          <RoutineButton
            tone='secondary'
            onClick={() => onAction('reminder', task)}
          >
            Ajustar lembrete
          </RoutineButton>
          <RoutineButton
            tone='secondary'
            onClick={() => onAction('recurrence', task)}
          >
            Repetição
          </RoutineButton>
          <RoutineButton
            className='col-span-full'
            tone='ghost'
            onClick={() => onAction('delete', task)}
          >
            Excluir tarefa
          </RoutineButton>
        </div>
      )}
      {!task.completed && task.reminder !== 'none' && (
        <p className={classes.smallNote}>
          Lembrete: {reminder.toLowerCase()}, na plataforma enquanto esta aba
          estiver aberta.
        </p>
      )}
    </div>
  );
}
