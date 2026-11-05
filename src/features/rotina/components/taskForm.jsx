import { useState } from 'react';
import { categories, frequencies, weekdays } from '../content';
import { dateKey, parseDate } from '../utils/dates';
import { validateTask } from '../utils/tasks';
import { useCompactWorkspace } from '../hooks/useCompactWorkspace';
import {
  ModalHeading,
  RoutineButton,
  RoutineField,
  RoutineSelect,
} from './routineUi';
import classes from '../routineClasses';

export default function TaskForm({
  task,
  defaultDate,
  onSave,
  onCancel,
  onAssistant,
  onDelete,
  titleId,
  presentation = 'modal',
}) {
  const [values, setValues] = useState(() => ({
    title: task?.title ?? '',
    category: task?.category ?? '',
    frequency: task?.frequency ?? 'none',
    date: task?.date ?? defaultDate ?? dateKey(),
    time: task?.time ?? '',
    notes: task?.notes ?? '',
    weekdays: task?.weekdays ?? [],
    endDate: task?.endDate ?? '',
  }));
  const [errors, setErrors] = useState({});
  const compact = useCompactWorkspace() && presentation === 'page';
  const [step, setStep] = useState(0);
  const steps = ['Sua tarefa', 'Quando fazer', 'Detalhes'];
  const fieldStep = name =>
    ['title', 'category'].includes(name)
      ? 0
      : ['date', 'time', 'frequency'].includes(name)
        ? 1
        : 2;

  function goToStep(next) {
    setStep(next);
    setErrors({});
  }

  function advance() {
    const nextErrors = Object.fromEntries(
      Object.entries(validateTask(values)).filter(
        ([name]) => fieldStep(name) === step
      )
    );
    setErrors(nextErrors);
    const first = Object.keys(nextErrors)[0];
    if (first)
      requestAnimationFrame(() =>
        document.getElementById(`${titleId}-${first}`)?.focus()
      );
    else setStep(previous => previous + 1);
  }

  function change(event) {
    const { name, value } = event.target;
    setValues(previous => ({
      ...previous,
      [name]: value,
      ...(name === 'frequency' &&
      value === 'weekly' &&
      !previous.weekdays.length
        ? { weekdays: [parseDate(previous.date || dateKey()).getDay()] }
        : {}),
      ...(name === 'frequency' && value === 'none' ? { endDate: '' } : {}),
    }));
    setErrors(previous => ({ ...previous, [name]: undefined }));
  }

  function submit(event) {
    event.preventDefault();
    const nextErrors = validateTask(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      const first = Object.keys(nextErrors)[0];
      if (compact) setStep(fieldStep(first));
      requestAnimationFrame(() =>
        document.getElementById(`${titleId}-${first}`)?.focus()
      );
      return;
    }
    onSave({
      ...values,
      title: values.title.trim(),
      notes: values.notes.trim(),
    });
  }

  return (
    <div className={classes.modalContent}>
      <ModalHeading
        id={titleId}
        as={presentation === 'page' ? 'h1' : 'h2'}
        ribbon={presentation !== 'page'}
        title={task ? 'Editar tarefa' : 'Criar nova tarefa'}
        description={
          task
            ? presentation === 'page'
              ? undefined
              : 'Ajuste os detalhes para a tarefa caber no seu dia.'
            : 'Adicione uma tarefa manualmente ou peça sugestões para a IA.'
        }
      />
      {!task && (
        <div
          className={classes.creationModes}
          hidden={compact && step > 0}
          role='group'
          aria-label='Como criar a tarefa'
        >
          <button type='button' aria-pressed='true'>
            Manual
          </button>
          <button type='button' onClick={onAssistant}>
            Com a IA
          </button>
        </div>
      )}
      {compact && (
        <nav className={classes.formSteps} aria-label='Etapas da tarefa'>
          {steps.map((label, index) => (
            <button
              key={label}
              type='button'
              aria-current={index === step ? 'step' : undefined}
              onClick={() => goToStep(index)}
            >
              <span>{index + 1}</span> {label}
            </button>
          ))}
        </nav>
      )}
      <form
        onSubmit={event => {
          if (compact && step < 2) {
            event.preventDefault();
            advance();
          } else submit(event);
        }}
        noValidate
        className={classes.taskForm}
        data-stepped={compact}
      >
        {Object.values(errors).some(Boolean) && (
          <p className={classes.srOnly} role='alert'>
            {Object.values(errors).filter(Boolean).join(' ')}
          </p>
        )}
        <div className={classes.formPanel} data-stepped={compact}>
          <div
            className={classes.formStep}
            data-stepped={compact}
            data-step='0'
            hidden={compact && step !== 0}
          >
            <RoutineField
              id={`${titleId}-title`}
              name='title'
              label='Título da tarefa'
              placeholder='Ex: Lavar a roupa'
              maxLength={120}
              value={values.title}
              onChange={change}
              required
              error={errors.title}
            />
            <RoutineSelect
              id={`${titleId}-category`}
              name='category'
              label='Categoria'
              value={values.category}
              onChange={change}
              required
              error={errors.category}
            >
              <option value='' disabled>
                Selecionar categoria
              </option>
              {categories.map(item => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </RoutineSelect>
          </div>
          <div
            className={classes.formStep}
            data-stepped={compact}
            data-step='1'
            hidden={compact && step !== 1}
          >
            <div className={classes.relatedFields}>
              <RoutineField
                id={`${titleId}-date`}
                name='date'
                label={task ? 'Data de início' : 'Data'}
                type='date'
                value={values.date}
                onChange={change}
                required
                error={errors.date}
              />
              <RoutineField
                id={`${titleId}-time`}
                name='time'
                label='Horário'
                type='time'
                value={values.time}
                onChange={change}
                required
                error={errors.time}
              />
            </div>
            <RoutineSelect
              id={`${titleId}-frequency`}
              name='frequency'
              label='Frequência'
              value={values.frequency}
              onChange={change}
              error={errors.frequency}
            >
              {frequencies.map(item => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </RoutineSelect>
          </div>
          <div
            className={classes.formStep}
            data-stepped={compact}
            data-step='2'
            hidden={compact && step !== 2}
          >
            {values.frequency === 'weekly' && (
              <fieldset
                id={`${titleId}-weekdays`}
                tabIndex={-1}
                className={classes.weekdayField}
              >
                <legend className={classes.fieldLabel}>Dias da semana</legend>
                <div className={classes.weekdayChoices}>
                  {weekdays.map(day => (
                    <label key={day.id}>
                      <input
                        type='checkbox'
                        name='weekdays'
                        checked={values.weekdays.includes(day.id)}
                        onChange={event => {
                          setValues(previous => ({
                            ...previous,
                            weekdays: event.target.checked
                              ? [...previous.weekdays, day.id]
                              : previous.weekdays.filter(
                                  value => value !== day.id
                                ),
                          }));
                          setErrors(previous => ({
                            ...previous,
                            weekdays: undefined,
                          }));
                        }}
                      />
                      <span>{day.short}</span>
                    </label>
                  ))}
                </div>
                {errors.weekdays && (
                  <p className={classes.fieldError}>{errors.weekdays}</p>
                )}
              </fieldset>
            )}
            {values.frequency !== 'none' && (
              <RoutineField
                id={`${titleId}-endDate`}
                name='endDate'
                label='Terminar repetição (opcional)'
                type='date'
                min={values.date}
                value={values.endDate}
                onChange={change}
                error={errors.endDate}
              />
            )}
            <div
              className={`${classes.formField} ${classes.formNotes}`}
              data-notes
            >
              <label
                className={classes.fieldLabel}
                htmlFor={`${titleId}-notes`}
              >
                Observações (opcional)
              </label>
              <textarea
                id={`${titleId}-notes`}
                name='notes'
                className={classes.textarea}
                maxLength={1000}
                placeholder='Ex: Usar sabão X, separar por cor...'
                value={values.notes}
                onChange={change}
              />
            </div>
            {task?.frequency !== 'none' && task && (
              <p className={classes.smallNote}>
                As alterações serão aplicadas à repetição inteira. Para mudar só
                uma data, use Reagendar.
              </p>
            )}
          </div>
        </div>
        <div className={classes.formActions}>
          <RoutineButton
            tone='outline'
            onClick={
              compact && step > 0
                ? () => goToStep(step - 1)
                : task
                  ? onDelete
                  : onCancel
            }
          >
            {compact && step > 0 ? 'Voltar' : task ? 'Excluir' : 'Cancelar'}
          </RoutineButton>
          <RoutineButton type='submit'>
            {compact && step < 2
              ? 'Continuar'
              : task
                ? 'Salvar alterações'
                : 'Salvar tarefa'}{' '}
            <span aria-hidden='true'>→</span>
          </RoutineButton>
        </div>
      </form>
    </div>
  );
}
