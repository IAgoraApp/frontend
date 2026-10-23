import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui';
import { Panel, Empty } from '../App/ui';
import TaskForm from '../App/taskForm';
import { useAppStore } from '../../store/useAppStore';
import { dateLabel } from '../../utils/format';
import styles from '../../styles/app.module.css';

export default function RotinaSection() {
  const tasks = useAppStore(state => state.data.tasks);
  const completeTask = useAppStore(state => state.completeTask);
  const [adding, setAdding] = useState(false);
  const pending = tasks
    .filter(task => !task.done)
    .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));
  return (
    <Panel title='Seu próximo passo.' className={styles.tinted}>
      {pending.length ? (
        <ul className={styles.list}>
          {pending.slice(0, 4).map(task => (
            <li key={task.id}>
              <label className={styles.check}>
                <input
                  type='checkbox'
                  checked={false}
                  onChange={() => completeTask(task.id)}
                />
                <div>
                  <strong>{task.title}</strong>
                  <p className={styles.muted}>
                    {dateLabel(task.date)} · {task.time}
                  </p>
                </div>
              </label>
            </li>
          ))}
        </ul>
      ) : (
        <Empty
          title='Um respiro na sua rotina.'
          description='Nenhuma tarefa pendente. Que tal planejar os próximos dias?'
        />
      )}
      <div className={styles.actions}>
        <Button color='laranja' onClick={() => setAdding(true)}>
          + Adicionar tarefa
        </Button>
        <Button as={Link} to='/rotina' color='azul'>
          Ver minha rotina
        </Button>
      </div>
      {adding && <TaskForm onClose={() => setAdding(false)} />}
    </Panel>
  );
}
