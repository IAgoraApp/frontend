import { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { formatDate, monthLabel } from '../utils/dates';
import { ModalHeading, RoutineButton } from './routineUi';
import TaskRow from './taskRow';
import classes from '../routineClasses';

export function DeleteTaskDialog({ task, onDelete, onCancel, titleId }) {
  return (
    <div className={classes.modalContent}>
      <ModalHeading
        editorial
        id={titleId}
        title={`Excluir ${task.title.charAt(0).toLowerCase() + task.title.slice(1)}?`}
        description={
          task.frequency === 'none'
            ? 'Esta tarefa será removida da sua rotina.'
            : 'Escolha se deseja excluir apenas esta ocorrência ou a repetição inteira.'
        }
      />
      <div className={classes.actions} data-actions>
        <RoutineButton onClick={() => onDelete('occurrence')}>
          {task.frequency === 'none' ? 'Excluir tarefa' : 'Só esta ocorrência'}
        </RoutineButton>
        {task.frequency !== 'none' && (
          <RoutineButton tone='secondary' onClick={() => onDelete('series')}>
            Toda a repetição
          </RoutineButton>
        )}
      </div>
      <RoutineButton tone='ghost' onClick={onCancel}>
        Cancelar
      </RoutineButton>
    </div>
  );
}

export function ResultDialog({ title, description, onContinue, titleId }) {
  return (
    <div className={classes.modalContent}>
      <ModalHeading
        editorial
        id={titleId}
        title={title}
        description={description}
      />
      <RoutineButton onClick={onContinue}>Continuar</RoutineButton>
    </div>
  );
}

export function MonthPicker({ month, onSelect, titleId }) {
  const [year, setYear] = useState(month.getFullYear());
  return (
    <div className={classes.modalContent}>
      <ModalHeading
        editorial
        id={titleId}
        title='Qual mês você quer ver?'
        description='Escolha o mês para organizar suas tarefas.'
      />
      <div className={classes.yearPicker}>
        <button
          type='button'
          className={classes.calendarControl}
          aria-label='Ano anterior'
          disabled={year <= 1900}
          onClick={() => setYear(value => value - 1)}
        >
          <ArrowLeft size={18} />
        </button>
        <span aria-live='polite'>{year}</span>
        <button
          type='button'
          className={classes.calendarControl}
          aria-label='Próximo ano'
          disabled={year >= 2100}
          onClick={() => setYear(value => value + 1)}
        >
          <ArrowRight size={18} />
        </button>
      </div>
      <div className={classes.monthChoices}>
        {Array.from({ length: 12 }, (_, i) => (
          <RoutineButton
            key={i}
            tone={
              i === month.getMonth() && year === month.getFullYear()
                ? 'primary'
                : 'secondary'
            }
            onClick={() => onSelect(new Date(year, i, 1, 12))}
          >
            {monthLabel(new Date(year, i, 1))}
          </RoutineButton>
        ))}
      </div>
    </div>
  );
}

export function DayTasksDialog({
  day,
  tasks,
  onOpen,
  onComplete,
  onUndo,
  onCreate,
  onCancel,
  titleId,
}) {
  return (
    <div className={classes.modalContent}>
      <ModalHeading
        editorial
        id={titleId}
        title='Tarefas deste dia.'
        description={formatDate(day, {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })}
      />
      {tasks.length ? (
        <div className={classes.dayTaskList}>
          {tasks.map(task => (
            <TaskRow
              key={task.occurrenceId}
              task={task}
              variant='day'
              dateLabel={task.time}
              onOpen={onOpen}
              onComplete={onComplete}
              onUndo={onUndo}
            />
          ))}
        </div>
      ) : (
        <p className={classes.muted}>
          Seu dia está livre por aqui. Que tal planejar o próximo passo?
        </p>
      )}
      <div className={classes.actions} data-actions>
        <RoutineButton onClick={onCreate}>Criar tarefa neste dia</RoutineButton>
        <RoutineButton tone='secondary' onClick={onCancel}>
          Voltar ao calendário
        </RoutineButton>
      </div>
    </div>
  );
}
