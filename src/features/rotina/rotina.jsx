import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { Container } from '../../shared/ui';
import {
  AgendaPanel,
  AssistantPanel,
  CalendarView,
  DayTasksDialog,
  DeleteTaskDialog,
  HistoryView,
  MonthPicker,
  ResultDialog,
  RoutineModal,
  RoutineOverview,
  RoutineToast,
  RoutineWorkspace,
  TaskDetail,
  TaskForm,
  TaskListView,
  TaskSettings,
} from './components';
import { useAvailableHeight } from './hooks/useAvailableHeight';
import { useReminders } from './hooks/useReminders';
import { useRoutine } from './hooks/useRoutine';
import { addDays, calendarDays, dateKey, monthRange } from './utils/dates';
import { createId, occurrencesBetween } from './utils/tasks';
import classes from './routineClasses';

const views = { calendar: 'calendario', list: 'lista', history: 'historico' };
const workspaceTypes = ['create', 'edit', 'assistant'];

export default function Rotina() {
  const location = useLocation();
  const { state, dispatch } = useRoutine();
  const [searchParams, setSearchParams] = useSearchParams();
  const view =
    Object.keys(views).find(key => views[key] === searchParams.get('visao')) ??
    'overview';
  const [month, setMonth] = useState(() => new Date());
  const [today, setToday] = useState(dateKey);
  const [modals, setModals] = useState([]);
  const [navigationKey, setNavigationKey] = useState(location.key);
  if (navigationKey !== location.key) {
    setNavigationKey(location.key);
    setModals([]);
  }
  const workspaceIndex = modals.findLastIndex(entry =>
    workspaceTypes.includes(entry.type)
  );
  const workspace = modals[workspaceIndex];
  const workspaceKey = workspace?.key;
  const dialogs = modals.slice(workspaceIndex + 1);
  const [toast, setToast] = useState(null);
  const ref = useAvailableHeight();
  const dismissToast = useCallback(() => setToast(null), []);
  const notify = useCallback(
    (message, action) => setToast({ message, action }),
    []
  );
  useReminders(state.tasks, state.completions, notify);

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.key, workspaceKey]);

  useEffect(() => {
    const interval = window.setInterval(() => setToday(dateKey()), 60_000);
    return () => window.clearInterval(interval);
  }, []);

  const pending = useMemo(() => {
    const start = addDays(today, -30);
    const recent = occurrencesBetween(
      state.tasks,
      state.completions,
      start,
      addDays(today, 30)
    );
    const older = state.tasks
      .filter(
        task =>
          task.frequency === 'none' &&
          task.date < start &&
          !state.completions.some(
            item => item.taskId === task.id && item.occurrenceDate === task.date
          )
      )
      .map(task => ({
        ...task,
        occurrenceDate: task.date,
        occurrenceId: `${task.id}:${task.date}`,
        completed: false,
      }));
    return [...older, ...recent].sort((a, b) =>
      `${a.occurrenceDate}T${a.time}`.localeCompare(
        `${b.occurrenceDate}T${b.time}`
      )
    );
  }, [state.tasks, state.completions, today]);

  const calendarTasks = useMemo(() => {
    const days = calendarDays(month);
    return occurrencesBetween(
      state.tasks,
      state.completions,
      days[0],
      days.at(-1),
      true
    );
  }, [state.tasks, state.completions, month]);

  function goTo(next) {
    setSearchParams(previous => {
      const params = new URLSearchParams(previous);
      if (views[next]) params.set('visao', views[next]);
      else params.delete('visao');
      return params;
    });
    setModals([]);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  function open(type, task, extra = {}) {
    const entry = { type, task, ...extra, key: createId() };
    setModals(previous => [...previous, entry]);
  }
  function close() {
    setModals([]);
  }
  function back() {
    setModals(previous => previous.slice(0, -1));
  }
  function result(title, description) {
    setModals([{ type: 'result', title, description, key: createId() }]);
  }

  function resolveTask(task) {
    const id = task.taskId ?? task.id;
    const source = state.tasks.find(item => item.id === id);
    const occurrenceDate = task.occurrenceDate ?? task.date;
    const occurrenceId = `${id}:${occurrenceDate}`;
    return {
      frequency: 'none',
      reminder: 'none',
      notes: '',
      weekdays: [],
      excludedDates: [],
      ...source,
      ...task,
      id,
      occurrenceDate,
      occurrenceId,
      completed: state.completions.some(item => item.id === occurrenceId),
    };
  }

  function undo(task) {
    dispatch({ type: 'undo', id: task.occurrenceId ?? task.id });
    notify('A tarefa voltou para a sua rotina.');
  }

  function complete(task, showResult = false) {
    const occurrence = resolveTask(task);
    if (occurrence.completed) return;
    dispatch({
      type: 'complete',
      occurrence,
      completedAt: new Date().toISOString(),
    });
    if (showResult)
      result(
        'Mais uma tarefa feita.',
        `${occurrence.title} foi adicionada ao seu histórico.`
      );
    else
      notify('Mais uma tarefa feita.', () => {
        dispatch({ type: 'undo', id: occurrence.occurrenceId });
        dismissToast();
      });
  }

  function saveTask(values, task) {
    if (task)
      dispatch({
        type: 'update',
        id: task.id,
        changes: {
          ...values,
          excludedDates:
            task.frequency === values.frequency ? task.excludedDates : [],
        },
      });
    else
      dispatch({
        type: 'add',
        tasks: [
          {
            ...values,
            id: createId(),
            reminder: 'none',
            excludedDates: [],
            icon:
              values.category === 'cozinha'
                ? 'spray'
                : values.category === 'pessoal'
                  ? 'study'
                  : 'list',
          },
        ],
      });
    result(
      task ? 'Sua tarefa foi atualizada.' : 'Sua tarefa está na rotina.',
      'Confira a nova organização na lista ou no calendário.'
    );
  }

  function saveSettings(type, task, values) {
    if (type === 'reschedule')
      dispatch({ type, occurrence: task, ...values, newId: createId() });
    else
      dispatch({
        type: 'update',
        id: task.id,
        changes:
          type === 'reminder'
            ? { reminder: values.reminder }
            : {
                frequency: values.frequency,
                weekdays: values.weekdays,
                endDate: values.frequency === 'none' ? '' : values.endDate,
                excludedDates: [],
              },
      });
    result(
      'Sua tarefa foi atualizada.',
      type === 'reminder'
        ? 'O lembrete foi salvo para aparecer nesta aba.'
        : 'Confira a nova organização na lista.'
    );
  }

  function addSuggestions(suggestions) {
    const tasks = suggestions.filter(
      item =>
        !state.tasks.some(
          task =>
            task.title === item.title &&
            task.category === item.category &&
            task.date === item.date &&
            task.frequency === item.frequency
        )
    );
    if (!tasks.length) {
      notify('Estas sugestões já estão na sua rotina.');
      return;
    }
    dispatch({
      type: 'add',
      tasks: tasks.map(item => ({ ...item, id: createId() })),
    });
    result(
      'Sua rotina ganhou novos passos.',
      `${tasks.length} ${tasks.length === 1 ? 'tarefa foi adicionada' : 'tarefas foram adicionadas'} à sua rotina.`
    );
  }

  function quickAction(action) {
    if (action in views) goTo(action);
    else open(action);
  }

  function modalContent(entry) {
    const titleId = `routine-modal-${entry.key}`;
    const task = entry.task ? resolveTask(entry.task) : null;
    const shared = { titleId };
    if (entry.type === 'create' || entry.type === 'edit')
      return (
        <TaskForm
          {...shared}
          presentation='page'
          task={entry.type === 'edit' ? task : undefined}
          defaultDate={entry.day}
          onCancel={back}
          onSave={values =>
            saveTask(values, entry.type === 'edit' ? task : null)
          }
          onAssistant={() => open('assistant')}
          onDelete={() => open('delete', task)}
        />
      );
    if (entry.type === 'detail')
      return (
        <TaskDetail
          {...shared}
          task={task}
          onAction={open}
          onComplete={value => complete(value, true)}
          onUndo={value => {
            undo(value);
            close();
          }}
        />
      );
    if (['reschedule', 'reminder', 'recurrence'].includes(entry.type))
      return (
        <TaskSettings
          {...shared}
          type={entry.type}
          task={task}
          onSave={values => saveSettings(entry.type, task, values)}
          onCancel={back}
        />
      );
    if (entry.type === 'delete')
      return (
        <DeleteTaskDialog
          {...shared}
          task={task}
          onCancel={back}
          onDelete={scope => {
            dispatch({ type: 'delete', occurrence: task, scope });
            close();
            notify(
              scope === 'series'
                ? 'A repetição foi removida. Seu histórico foi mantido.'
                : 'Tarefa excluída da rotina.'
            );
          }}
        />
      );
    if (entry.type === 'assistant')
      return (
        <AssistantPanel
          {...shared}
          presentation='page'
          onAdd={addSuggestions}
          onManual={() => open('create')}
        />
      );
    if (entry.type === 'agenda')
      return (
        <AgendaPanel
          {...shared}
          agenda={state.agenda}
          onCancel={back}
          onConnect={() =>
            dispatch({ type: 'agenda', changes: { connected: true } })
          }
          onSave={preferences => {
            dispatch({ type: 'agenda', changes: { preferences } });
            result(
              'Preferências atualizadas.',
              'A sincronização foi configurada no exemplo.'
            );
          }}
          onDisconnect={() => {
            dispatch({ type: 'agenda', changes: { connected: false } });
            result(
              'Conexão removida.',
              'Suas tarefas continuam disponíveis na plataforma.'
            );
          }}
        />
      );
    if (entry.type === 'month')
      return (
        <MonthPicker
          {...shared}
          month={month}
          onSelect={value => {
            setMonth(value);
            back();
          }}
        />
      );
    if (entry.type === 'day')
      return (
        <DayTasksDialog
          {...shared}
          day={entry.day}
          tasks={occurrencesBetween(
            state.tasks,
            state.completions,
            entry.day,
            entry.day,
            true
          )}
          onOpen={value => open('detail', value)}
          onComplete={complete}
          onUndo={undo}
          onCreate={() => open('create', undefined, { day: entry.day })}
          onCancel={back}
        />
      );
    return (
      <ResultDialog
        {...shared}
        title={entry.title}
        description={entry.description}
        onContinue={close}
      />
    );
  }

  const activeModal = dialogs.at(-1);
  const wide =
    activeModal &&
    ['reschedule', 'reminder', 'recurrence'].includes(activeModal.type);
  const { start: calendarStart, end: calendarEnd } = monthRange(month);

  return (
    <main
      ref={ref}
      lang='pt-BR'
      className={`${classes.scope} ${classes.page} ${workspace || view === 'overview' || view === 'calendar' ? classes.fitPage : ''}`}
      data-view={workspace ? 'workspace' : view}
      data-fit={Boolean(
        workspace || view === 'overview' || view === 'calendar'
      )}
      aria-label='Minha rotina'
    >
      <Container className={classes.container}>
        <div hidden={Boolean(workspace)} className={classes.viewPanel}>
          {view === 'overview' && (
            <RoutineOverview
              upcoming={pending.filter(task => task.occurrenceDate >= today)}
              onAction={quickAction}
              onOpen={task => open('detail', task)}
              onComplete={complete}
            />
          )}
          {view === 'calendar' && (
            <CalendarView
              month={month}
              onMonthChange={setMonth}
              occurrences={calendarTasks}
              onSelectDay={day => open('day', undefined, { day })}
              onChooseMonth={() => open('month')}
              onBack={() => goTo('overview')}
              onAgenda={() => open('agenda')}
              connected={state.agenda.connected}
            />
          )}
          {view === 'list' && (
            <TaskListView
              tasks={pending}
              onBack={() => goTo('overview')}
              onCreate={() => open('create')}
              onAssistant={() => open('assistant')}
              onOpen={task => open('detail', task)}
              onComplete={complete}
              onAction={open}
            />
          )}
          {view === 'history' && (
            <HistoryView
              completions={state.completions}
              pending={pending}
              onBack={() => goTo('overview')}
              onOpen={task => open('detail', task)}
              onUndo={undo}
            />
          )}
          <span className={classes.srOnly} aria-live='polite'>
            {view === 'calendar'
              ? `Calendário de ${calendarStart} a ${calendarEnd}.`
              : ''}
          </span>
        </div>
        {modals
          .slice(0, workspaceIndex + 1)
          .filter(entry => workspaceTypes.includes(entry.type))
          .map(entry => (
            <div
              key={entry.key}
              hidden={entry.key !== workspace?.key}
              className={classes.viewPanel}
              data-active-workspace={
                entry.key === workspace?.key ? 'true' : 'false'
              }
            >
              <RoutineWorkspace
                entry={entry}
                active={entry.key === workspace?.key}
                backLabel={
                  modals.indexOf(entry) > 0 ? 'Voltar' : 'Minha rotina'
                }
                onBack={back}
              >
                {modalContent(entry)}
              </RoutineWorkspace>
            </div>
          ))}
      </Container>
      {activeModal && (
        <RoutineModal
          onClose={() =>
            setModals(previous => previous.slice(0, workspaceIndex + 1))
          }
          onBack={dialogs.length > 1 ? back : undefined}
          modalKey={activeModal.key}
          titleId={`routine-modal-${activeModal.key}`}
          wide={wide}
        >
          {dialogs.map(entry => (
            <div
              key={entry.key}
              hidden={entry.key !== activeModal.key}
              data-active-modal={
                entry.key === activeModal.key ? 'true' : 'false'
              }
              className={classes.modalPanel}
            >
              {modalContent(entry)}
            </div>
          ))}
        </RoutineModal>
      )}
      {toast && <RoutineToast toast={toast} onDismiss={dismissToast} />}
    </main>
  );
}
