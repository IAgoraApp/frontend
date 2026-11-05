import { useState } from 'react';
import { categories, frequencies, reminderOptions, weekdays } from '../content';
import { dateKey, parseDate, relativeDay } from '../utils/dates';
import {
  ModalHeading,
  Notice,
  RoutineButton,
  RoutineField,
  RoutineSelect,
} from './routineUi';
import classes from '../routineClasses';

const headings = {
  reschedule: 'Um novo horário para sua tarefa.',
  reminder: 'Um aviso na hora certa.',
  recurrence: 'Uma frequência que funciona.',
};

export default function TaskSettings({
  type,
  task,
  onSave,
  onCancel,
  titleId,
}) {
  const [values, setValues] = useState(() => ({
    date: task.occurrenceDate,
    time: task.time,
    scope: 'occurrence',
    reminder: task.reminder ?? 'none',
    frequency: task.frequency,
    weekdays: task.weekdays?.length
      ? task.weekdays
      : [parseDate(task.date).getDay()],
    endDate: task.endDate ?? '',
  }));
  const [error, setError] = useState('');
  function change(event) {
    setValues(previous => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
    setError('');
  }
  function submit(event) {
    event.preventDefault();
    if (
      type === 'reschedule' &&
      (!parseDate(values.date) ||
        !/^([01]\d|2[0-3]):[0-5]\d$/.test(values.time))
    ) {
      setError('Informe uma data e um horário válidos.');
      return;
    }
    if (
      type === 'reschedule' &&
      values.scope === 'series' &&
      task.endDate &&
      values.date > task.endDate
    ) {
      setError(
        'Escolha uma data antes do fim da repetição ou ajuste a repetição primeiro.'
      );
      return;
    }
    if (
      type === 'recurrence' &&
      values.frequency === 'weekly' &&
      !values.weekdays.length
    ) {
      setError('Escolha pelo menos um dia da semana.');
      return;
    }
    if (
      type === 'recurrence' &&
      values.endDate &&
      (!parseDate(values.endDate) || values.endDate < task.date)
    ) {
      setError(
        'O fim da repetição precisa ser igual ou posterior à data inicial.'
      );
      return;
    }
    onSave(values);
  }
  const daysLabel = weekdays
    .filter(day => values.weekdays.includes(day.id))
    .map(day => day.label.replace('-feira', '').toLowerCase())
    .join(', ');

  return (
    <div className={classes.modalContent}>
      <ModalHeading
        id={titleId}
        title={headings[type]}
        description={task.title}
      />
      <div className={classes.settingsWorkspace}>
        <form className={classes.formPanel} onSubmit={submit} noValidate>
          {error && (
            <Notice error title='Confira este detalhe.'>
              {error}
            </Notice>
          )}
          {type === 'reschedule' && (
            <>
              <div className={classes.relatedFields} data-related>
                <RoutineField
                  id='reschedule-date'
                  label='Data'
                  name='date'
                  type='date'
                  required
                  value={values.date}
                  onChange={change}
                />
                <RoutineField
                  id='reschedule-time'
                  label='Horário'
                  name='time'
                  type='time'
                  required
                  value={values.time}
                  onChange={change}
                />
              </div>
              <RoutineSelect
                id='reschedule-scope'
                name='scope'
                label='Aplicar mudança'
                value={values.scope}
                onChange={change}
              >
                <option value='occurrence'>Somente esta ocorrência</option>
                {task.frequency !== 'none' && (
                  <option value='series'>Toda a repetição</option>
                )}
              </RoutineSelect>
            </>
          )}
          {type === 'reminder' && (
            <>
              <RoutineSelect
                id='reminder-before'
                name='reminder'
                label='Avisar'
                value={values.reminder}
                onChange={change}
              >
                {reminderOptions.map(item => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </RoutineSelect>
              <RoutineSelect
                id='reminder-channel'
                label='Canal'
                value='platform'
                onChange={() => {}}
              >
                <option value='platform'>Na plataforma</option>
              </RoutineSelect>
              <RoutineField
                id='reminder-recurrence'
                label='Repetição'
                value={
                  frequencies.find(item => item.id === task.frequency)?.label
                }
                readOnly
              />
              <p className={classes.smallNote}>
                Os avisos aparecem enquanto esta aba estiver aberta.
              </p>
            </>
          )}
          {type === 'recurrence' && (
            <>
              <RoutineSelect
                id='recurrence-frequency'
                name='frequency'
                label='Frequência'
                value={values.frequency}
                onChange={change}
              >
                {frequencies.map(item => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </RoutineSelect>
              {values.frequency === 'weekly' && (
                <fieldset className={classes.weekdayField}>
                  <legend className={classes.fieldLabel}>Dias</legend>
                  <div className={classes.weekdayChoices}>
                    {weekdays.map(day => (
                      <label key={day.id}>
                        <input
                          type='checkbox'
                          checked={values.weekdays.includes(day.id)}
                          onChange={event =>
                            setValues(previous => ({
                              ...previous,
                              weekdays: event.target.checked
                                ? [...previous.weekdays, day.id]
                                : previous.weekdays.filter(
                                    value => value !== day.id
                                  ),
                            }))
                          }
                        />
                        <span>{day.short}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              )}
              {values.frequency !== 'none' && (
                <RoutineField
                  id='recurrence-end'
                  name='endDate'
                  type='date'
                  min={task.date || dateKey()}
                  label='Terminar repetição (opcional)'
                  value={values.endDate}
                  onChange={change}
                />
              )}
            </>
          )}
          <div className={classes.actions} data-actions>
            <RoutineButton type='submit'>Salvar</RoutineButton>
            <RoutineButton tone='secondary' onClick={onCancel}>
              Cancelar
            </RoutineButton>
          </div>
        </form>
        <aside className={classes.contextPanel}>
          <p className={classes.eyebrow}>VOCÊ ESTÁ AJUSTANDO</p>
          <h3>{task.title}</h3>
          <p>
            {categories.find(item => item.id === task.category)?.label} ·{' '}
            {frequencies
              .find(item => item.id === task.frequency)
              ?.label.toLowerCase()}
          </p>
          <hr />
          {type === 'reschedule' && (
            <>
              <div>
                <strong>Horário atual</strong>
                <p>
                  {relativeDay(task.occurrenceDate)} · {task.time}
                </p>
              </div>
              <div>
                <strong>Novo horário</strong>
                <p>
                  {parseDate(values.date)
                    ? `${relativeDay(values.date)} · ${values.time || 'Escolha o horário'}`
                    : 'Escolha a data'}
                </p>
              </div>
              <p>
                Ajuste uma ocorrência ou a repetição inteira no campo ao lado.
              </p>
            </>
          )}
          {type === 'reminder' && (
            <>
              <div>
                <strong>Como o aviso aparece</strong>
                <p>
                  {task.title} ·{' '}
                  {reminderOptions
                    .find(item => item.value === values.reminder)
                    ?.label.toLowerCase()}
                </p>
              </div>
              <p>
                O aviso escolhido acompanha o horário da tarefa. Você pode mudar
                a antecedência depois.
              </p>
            </>
          )}
          {type === 'recurrence' && (
            <>
              <div>
                <strong>Dias escolhidos</strong>
                <p>
                  {values.frequency === 'weekly'
                    ? daysLabel || 'Escolha seus dias'
                    : frequencies.find(item => item.id === values.frequency)
                        ?.label}
                </p>
              </div>
              <p>
                Escolha dias que cabem na sua semana. Para uma tarefa pontual,
                mantenha sem repetição.
              </p>
            </>
          )}
          <RoutineButton tone='secondary' onClick={onCancel}>
            Rever a tarefa
          </RoutineButton>
        </aside>
      </div>
    </div>
  );
}
