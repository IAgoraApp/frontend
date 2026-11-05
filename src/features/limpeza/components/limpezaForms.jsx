import { useState } from 'react';
import { FormField } from '../../../shared/ui';
import {
  CasaButton as Action,
  CasaSelect as Select,
} from '../../casa/components/casaUi';
import { addToRoutine, todayKey } from '../content';

export function RoutineForm({ guide, onDone, onCancel }) {
  const [error, setError] = useState('');
  return (
    <form
      className='space-y-5'
      onSubmit={event => {
        event.preventDefault();
        const values = Object.fromEntries(new FormData(event.currentTarget));
        try {
          const added = addToRoutine(values, guide);
          onDone(
            added
              ? 'Cuidado adicionado à sua rotina.'
              : 'Este cuidado já está na sua rotina neste horário.'
          );
        } catch (error) {
          setError(
            error.message || 'Não foi possível salvar. Tente novamente.'
          );
        }
      }}
    >
      <p className='font-bold'>{guide.title}</p>
      <Select
        id='clean-frequency'
        name='frequency'
        label='Frequência'
        defaultValue='weekly'
      >
        <option value='none'>Sem repetição</option>
        <option value='daily'>Diária</option>
        <option value='weekly'>Semanal</option>
        <option value='monthly'>Mensal</option>
      </Select>
      <div className='grid gap-4 sm:grid-cols-2'>
        <FormField
          id='clean-date'
          name='date'
          label='Data'
          type='date'
          defaultValue={todayKey()}
          required
        />
        <FormField
          id='clean-time'
          name='time'
          label='Horário'
          type='time'
          defaultValue='10:00'
          required
        />
      </div>
      <Select
        id='clean-reminder'
        name='reminder'
        label='Lembrete'
        defaultValue='30'
      >
        <option value='none'>Sem lembrete</option>
        <option value='0'>Na hora</option>
        <option value='30'>30 minutos antes</option>
        <option value='60'>1 hora antes</option>
      </Select>
      <p className='rounded-lg bg-(--azul-fundo) p-4 text-sm text-(--texto-apoio)'>
        O cuidado ficará identificado como Limpeza na categoria Casa da sua
        rotina.
      </p>
      {error && (
        <p role='alert' className='text-sm text-red-700'>
          {error}
        </p>
      )}
      <div className='flex flex-wrap gap-3'>
        <Action type='submit'>Confirmar</Action>
        <Action type='button' secondary onClick={onCancel}>
          Cancelar
        </Action>
      </div>
    </form>
  );
}
export function ChecklistForm({ onSave, onCancel }) {
  const [error, setError] = useState('');
  return (
    <form
      className='space-y-5'
      onSubmit={event => {
        event.preventDefault();
        const values = Object.fromEntries(new FormData(event.currentTarget));
        if (!values.title.trim()) {
          setError('Informe o título da tarefa.');
          return;
        }
        onSave({
          ...values,
          title: values.title.trim(),
          id: crypto.randomUUID(),
        });
      }}
    >
      <FormField
        id='clean-task'
        name='title'
        label='Título da tarefa'
        placeholder='Ex.: Limpar a bancada'
        maxLength={120}
        required
      />
      <Select id='clean-room' name='room' label='Cômodo'>
        {['Cozinha', 'Banheiro', 'Sala', 'Quarto', 'Lavanderia'].map(room => (
          <option key={room}>{room}</option>
        ))}
      </Select>
      <Select id='clean-task-frequency' name='frequency' label='Frequência'>
        <option>Diária</option>
        <option>Semanal</option>
        <option>Mensal</option>
      </Select>
      <FormField
        id='clean-task-materials'
        name='materials'
        label='Materiais (opcional)'
        maxLength={200}
      />
      {error && (
        <p role='alert' className='text-sm text-red-700'>
          {error}
        </p>
      )}
      <div className='flex flex-wrap gap-3'>
        <Action type='submit'>Salvar tarefa</Action>
        <Action secondary type='button' onClick={onCancel}>
          Cancelar
        </Action>
      </div>
    </form>
  );
}
