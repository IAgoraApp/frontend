import { useState } from 'react';
import { CalendarDays, List, Pencil, Trash2, Sparkles } from 'lucide-react';
import { Button } from '../components/ui';
import {
  Page,
  Panel,
  Field,
  Empty,
  Confirm,
  Modal,
  Badge,
} from '../components/App/ui';
import TaskForm from '../components/App/taskForm';
import { useAppStore } from '../store/useAppStore';
import { today, dateLabel, normalize } from '../utils/format';
import styles from '../styles/app.module.css';

export default function Rotina() {
  const { tasks, completions, person } = useAppStore(state => state.data);
  const completeTask = useAppStore(state => state.completeTask);
  const removeItem = useAppStore(state => state.removeItem);
  const notify = useAppStore(state => state.notify);
  const [editor, setEditor] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [view, setView] = useState('Lista');
  const [status, setStatus] = useState('Pendentes');
  const [query, setQuery] = useState('');
  const [month, setMonth] = useState(today().slice(0, 7));
  const [info, setInfo] = useState(false);
  const [assistant, setAssistant] = useState(false);
  const filtered = tasks
    .filter(
      task =>
        normalize(task.title).includes(normalize(query)) &&
        (status === 'Todas' ||
          (status === 'Concluídas' ? task.done : !task.done))
    )
    .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));
  const days = new Date(
    Number(month.slice(0, 4)),
    Number(month.slice(5)),
    0
  ).getDate();
  const offset = new Date(`${month}-01T12:00:00`).getDay();
  const reminders = tasks.filter(
    task => !task.done && task.reminder && task.date <= today()
  );

  return (
    <Page
      title='Minha rotina'
      eyebrow='MENOS ACÚMULO, MAIS VIDA'
      description='Organize o que precisa fazer, no ritmo que funciona para você.'
      action={
        <Button color='laranja' onClick={() => setEditor({})}>
          + Nova tarefa
        </Button>
      }
    >
      <div className={styles.actions}>
        <Button color='azul' onClick={() => setAssistant(true)}>
          <Sparkles size={18} className='mr-2' />
          Sugestões de IA · demo local
        </Button>
        <button className={styles.textButton} onClick={() => setInfo(true)}>
          Google Calendar · integração futura
        </button>
      </div>
      {person.notifications && reminders.length > 0 && (
        <p className={styles.info} role='status'>
          Lembrete local: {reminders.length} tarefa(s) pendente(s) até hoje.{' '}
          {reminders[0].title} às {reminders[0].time}.
        </p>
      )}
      <Panel title='Um combinado com sua semana.'>
        <div className={styles.filters}>
          <Field
            label='Buscar tarefa'
            type='search'
            value={query}
            onChange={event => setQuery(event.target.value)}
            placeholder='Nome da tarefa'
          />
          <Field
            label='Situação'
            value={status}
            onChange={event => setStatus(event.target.value)}
          >
            {['Pendentes', 'Concluídas', 'Todas'].map(value => (
              <option key={value}>{value}</option>
            ))}
          </Field>
          <div className={styles.tabs}>
            {[
              ['Lista', List],
              ['Calendário', CalendarDays],
              ['Histórico', List],
            ].map(([label, Icon]) => (
              <button
                key={label}
                aria-pressed={view === label}
                onClick={() => setView(label)}
              >
                <Icon size={16} className='inline mr-1' />
                {label}
              </button>
            ))}
          </div>
        </div>
        {view === 'Lista' &&
          (filtered.length ? (
            <ul className={styles.list}>
              {filtered.map(task => (
                <li key={task.id}>
                  <div className={styles.row}>
                    <label className={styles.check}>
                      <input
                        type='checkbox'
                        checked={task.done}
                        onChange={() => completeTask(task.id)}
                        aria-label={`Concluir ${task.title}`}
                      />
                      <div>
                        <h3 className={task.done ? styles.done : ''}>
                          {task.title}
                        </h3>
                        <small>
                          {dateLabel(task.date)} · {task.time} ·{' '}
                          {task.frequency} · {task.category}
                        </small>
                      </div>
                    </label>
                    <div className={styles.actions}>
                      <button
                        className={styles.iconButton}
                        aria-label={`Editar ${task.title}`}
                        onClick={() => setEditor(task)}
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        className={styles.iconButton}
                        aria-label={`Excluir ${task.title}`}
                        onClick={() => setDeleting(task)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <Empty
              title='Nenhuma tarefa encontrada.'
              description='Experimente outro filtro ou adicione uma nova tarefa.'
            />
          ))}
        {view === 'Calendário' && (
          <>
            <Field
              label='Mês do calendário'
              type='month'
              value={month}
              onChange={event => {
                if (event.target.value) setMonth(event.target.value);
              }}
              required
            />
            <p className={styles.muted}>
              Próximas ocorrências agendadas. Clique numa tarefa para editar ou
              reagendar.
            </p>
            <div className={styles.tableWrap}>
              <div className={styles.calendar}>
                {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
                  <strong key={day}>{day}</strong>
                ))}
                {Array.from({ length: offset }, (_, i) => (
                  <div key={`empty-${i}`} aria-hidden='true' />
                ))}
                {Array.from({ length: days }, (_, i) => {
                  const date = `${month}-${String(i + 1).padStart(2, '0')}`;
                  return (
                    <div key={date} data-today={date === today()}>
                      <strong>{i + 1}</strong>
                      {filtered
                        .filter(task => task.date === date)
                        .map(task => (
                          <button key={task.id} onClick={() => setEditor(task)}>
                            {task.time} · {task.title}
                          </button>
                        ))}
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
        {view === 'Histórico' &&
          (completions.filter(item =>
            normalize(item.title).includes(normalize(query))
          ).length ? (
            <ul className={styles.list}>
              {completions
                .filter(item =>
                  normalize(item.title).includes(normalize(query))
                )
                .slice()
                .reverse()
                .map(item => (
                  <li key={item.id}>
                    <h3>{item.title}</h3>
                    <small>
                      Concluída em {new Date(item.date).toLocaleString('pt-BR')}
                    </small>
                  </li>
                ))}
            </ul>
          ) : (
            <Empty
              title='Seu histórico começa com uma tarefa.'
              description='Ao concluir uma atividade, ela fica registrada aqui, mesmo se for recorrente.'
            />
          ))}
      </Panel>
      {editor && (
        <TaskForm
          task={editor.title ? editor : undefined}
          onClose={() => setEditor(null)}
        />
      )}
      {deleting && (
        <Confirm
          title={`Excluir “${deleting.title}”?`}
          onClose={() => setDeleting(null)}
          onConfirm={() => {
            removeItem('tasks', deleting.id);
            notify('Tarefa excluída. O histórico de conclusão foi mantido.');
          }}
        />
      )}
      {info && (
        <Modal
          title='Seu calendário, no futuro.'
          onClose={() => setInfo(false)}
        >
          <div className={styles.stack}>
            <Badge>Integração ainda indisponível</Badge>
            <p>
              A sincronização com Google Calendar depende de autenticação e de
              uma integração futura. Nenhum calendário está conectado.
            </p>
            <p>
              Por enquanto, organize as datas aqui. As tarefas e seus horários
              ficam salvos neste navegador.
            </p>
            <Button onClick={() => setInfo(false)}>Voltar à rotina</Button>
          </div>
        </Modal>
      )}
      {assistant && (
        <Modal
          title='Uma mão para começar.'
          onClose={() => setAssistant(false)}
        >
          <div className={styles.stack}>
            <p className={styles.info}>
              Demonstração por regras locais, sem conexão com IA. Escolha uma
              sugestão e personalize antes de salvar.
            </p>
            {[
              'Varrer os ambientes mais usados',
              'Planejar duas refeições da semana',
              'Revisar as contas e vencimentos',
            ].map(title => (
              <Button
                key={title}
                color='azul'
                onClick={() => {
                  setAssistant(false);
                  setEditor({ title });
                }}
              >
                {title}
              </Button>
            ))}
          </div>
        </Modal>
      )}
    </Page>
  );
}
