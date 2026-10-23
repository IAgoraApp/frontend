import { useState } from 'react';
import { Button } from '../ui';
import { Field, Modal } from './ui';
import { useAppStore } from '../../store/useAppStore';
import { today } from '../../utils/format';
import styles from '../../styles/app.module.css';

const weekdays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export default function TaskForm({ task, onClose }) {
  const [frequency, setFrequency] = useState(task?.frequency || 'Uma vez');
  const [days, setDays] = useState(task?.days || []);
  const [error, setError] = useState('');
  const saveItem = useAppStore(state => state.saveItem);
  const notify = useAppStore(state => state.notify);
  function submit(event) {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget));
    if (!values.title.trim()) {
      setError('Escreva um nome para a tarefa.');
      return;
    }
    if (frequency === 'Semanal' && !days.length) {
      setError('Selecione pelo menos um dia da semana.');
      return;
    }
    saveItem('tasks', {
      ...task,
      title: values.title.trim(),
      date: values.date,
      time: values.time,
      frequency,
      days,
      monthDay: Number(values.date.slice(-2)),
      category: values.category,
      reminder: values.reminder === 'on',
      done: task?.done || false,
    });
    notify(
      task?.id
        ? 'Tarefa atualizada e reagendada.'
        : 'Tarefa adicionada à sua rotina.'
    );
    onClose();
  }
  return (
    <Modal
      title={task?.id ? 'Editar e reagendar tarefa' : 'Uma tarefa de cada vez.'}
      onClose={onClose}
    >
      <form onSubmit={submit} className={styles.form}>
        <Field
          label='O que precisa fazer?'
          name='title'
          defaultValue={task?.title}
          required
          maxLength={100}
          autoFocus
        />
        <div className={styles.formGrid}>
          <Field
            label='Próxima data'
            name='date'
            type='date'
            defaultValue={task?.date || today()}
            required
          />
          <Field
            label='Horário'
            name='time'
            type='time'
            defaultValue={task?.time || '09:00'}
            required
          />
        </div>
        <div className={styles.formGrid}>
          <Field
            label='Frequência'
            value={frequency}
            onChange={event => setFrequency(event.target.value)}
          >
            {['Uma vez', 'Diária', 'Semanal', 'Mensal'].map(value => (
              <option key={value}>{value}</option>
            ))}
          </Field>
          <Field
            label='Categoria'
            name='category'
            defaultValue={task?.category || 'Casa'}
          >
            {['Casa', 'Limpeza', 'Cozinha', 'Manutenção', 'Pessoal'].map(
              value => (
                <option key={value}>{value}</option>
              )
            )}
          </Field>
        </div>
        {frequency === 'Semanal' && (
          <fieldset>
            <legend className='font-bold mb-2'>Dias da semana</legend>
            <div className={styles.tabs}>
              {weekdays.map((day, i) => (
                <button
                  key={day}
                  type='button'
                  aria-pressed={days.includes(String(i))}
                  onClick={() =>
                    setDays(current =>
                      current.includes(String(i))
                        ? current.filter(value => value !== String(i))
                        : [...current, String(i)]
                    )
                  }
                >
                  {day}
                </button>
              ))}
            </div>
          </fieldset>
        )}
        <label className={styles.check}>
          <input
            type='checkbox'
            name='reminder'
            defaultChecked={task?.reminder ?? true}
          />
          Mostrar lembrete no início e na rotina
        </label>
        <p className={styles.muted}>
          Os lembretes aparecem na plataforma. A frequência agenda a próxima
          ocorrência ao concluir a tarefa.
        </p>
        {error && (
          <p role='alert' className={styles.error}>
            {error}
          </p>
        )}
        <Button color='laranja'>Salvar tarefa</Button>
      </form>
    </Modal>
  );
}
