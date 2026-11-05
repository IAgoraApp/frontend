import { useState } from 'react';
import { FormField } from '../../../shared/ui';
import { dateKey } from '../../rotina/utils/dates';
import { rooms } from '../content';
import { CasaButton, CasaSelect } from './casaUi';

export default function MaintenanceForm({ item, onSave, onCancel }) {
  const [values, setValues] = useState(
    item ?? {
      title: '',
      room: 'Cozinha',
      priority: 'Média',
      date: dateKey(),
      frequency: 'none',
      notes: '',
    }
  );
  const [error, setError] = useState('');
  const change = event =>
    setValues(previous => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
  return (
    <form
      className='space-y-5'
      onSubmit={event => {
        event.preventDefault();
        if (!values.title.trim()) {
          setError('Informe o título da manutenção.');
          return;
        }
        onSave({
          ...values,
          title: values.title.trim(),
          id: item?.id ?? crypto.randomUUID(),
          completedAt: item?.completedAt ?? null,
        });
      }}
    >
      <FormField
        id='maintenance-title'
        name='title'
        label='Título'
        placeholder='Ex.: Revisar torneira'
        value={values.title}
        onChange={change}
        maxLength={120}
        required
      />
      <div className='grid gap-5 sm:grid-cols-2'>
        <CasaSelect
          id='maintenance-room'
          name='room'
          label='Cômodo'
          value={values.room}
          onChange={change}
        >
          {rooms.map(room => (
            <option key={room}>{room}</option>
          ))}
        </CasaSelect>
        <CasaSelect
          id='maintenance-priority'
          name='priority'
          label='Prioridade'
          value={values.priority}
          onChange={change}
        >
          {['Alta', 'Média', 'Baixa'].map(value => (
            <option key={value}>{value}</option>
          ))}
        </CasaSelect>
      </div>
      <div className='grid gap-5 sm:grid-cols-2'>
        <FormField
          id='maintenance-date'
          name='date'
          label='Data'
          type='date'
          value={values.date}
          onChange={change}
          required
        />
        <CasaSelect
          id='maintenance-frequency'
          name='frequency'
          label='Frequência'
          value={values.frequency}
          onChange={change}
        >
          <option value='none'>Sem repetição</option>
          <option value='monthly'>Mensal</option>
        </CasaSelect>
      </div>
      <label
        className='flex flex-col gap-2 text-sm font-bold'
        htmlFor='maintenance-notes'
      >
        Observações
        <textarea
          id='maintenance-notes'
          name='notes'
          value={values.notes}
          onChange={change}
          maxLength={1000}
          rows={3}
          className='rounded-lg border border-[#dbe5ed] p-3 font-normal'
        />
      </label>
      {error && (
        <p role='alert' className='text-sm text-red-700'>
          {error}
        </p>
      )}
      <div className='flex flex-wrap gap-3'>
        <CasaButton type='submit'>Salvar manutenção</CasaButton>
        <CasaButton secondary type='button' onClick={onCancel}>
          Cancelar
        </CasaButton>
      </div>
    </form>
  );
}
