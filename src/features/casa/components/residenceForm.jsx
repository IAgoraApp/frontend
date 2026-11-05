import { useState } from 'react';
import { FormField, Title } from '../../../shared/ui';
import { rooms } from '../content';
import { CasaButton, CasaCard, CasaSelect } from './casaUi';
import photo from '../assets/PhotoAmbienteDaResidencia.png';

export default function ResidenceForm({ residence, onSave, onCancel }) {
  const [values, setValues] = useState(
    residence ?? { name: '', type: 'Apartamento', location: '', rooms: [] }
  );
  const [error, setError] = useState('');
  const change = event =>
    setValues(previous => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
  return (
    <div className='grid items-start gap-6 lg:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)]'>
      <CasaCard>
        <form
          className='space-y-6'
          onSubmit={event => {
            event.preventDefault();
            if (
              !values.name.trim() ||
              !values.location.trim() ||
              !values.rooms.length
            ) {
              setError('Informe o nome, a localização e ao menos um cômodo.');
              return;
            }
            onSave({
              ...values,
              name: values.name.trim(),
              location: values.location.trim(),
            });
          }}
        >
          <FormField
            id='residence-name'
            name='name'
            label='Nome da residência'
            placeholder='Ex.: Meu apartamento'
            value={values.name}
            onChange={change}
            maxLength={100}
            required
          />
          <div className='grid gap-5 sm:grid-cols-2'>
            <CasaSelect
              id='residence-type'
              name='type'
              label='Tipo de imóvel'
              value={values.type}
              onChange={change}
            >
              {[
                'Apartamento',
                'Casa',
                'Kitnet',
                'Quarto compartilhado',
                'Outro',
              ].map(type => (
                <option key={type}>{type}</option>
              ))}
            </CasaSelect>
            <FormField
              id='residence-location'
              name='location'
              label='Cidade e bairro'
              placeholder='Ex.: São Paulo, Pinheiros'
              value={values.location}
              onChange={change}
              maxLength={150}
              required
            />
          </div>
          <fieldset>
            <legend className='mb-3 text-sm font-bold'>Cômodos</legend>
            <div className='grid gap-3 sm:grid-cols-2'>
              {rooms.map(room => (
                <label
                  key={room}
                  className='flex min-h-12 items-center gap-3 rounded-lg border border-[#dbe5ed] p-3 text-sm'
                >
                  <input
                    type='checkbox'
                    checked={values.rooms.includes(room)}
                    onChange={event =>
                      setValues(previous => ({
                        ...previous,
                        rooms: event.target.checked
                          ? [...previous.rooms, room]
                          : previous.rooms.filter(item => item !== room),
                      }))
                    }
                    className='size-5 accent-(--laranja-principal)'
                  />
                  {room}
                </label>
              ))}
            </div>
          </fieldset>
          {error && (
            <p role='alert' className='text-sm text-red-700'>
              {error}
            </p>
          )}
          <div className='flex flex-wrap gap-3'>
            <CasaButton type='submit'>Salvar minha casa</CasaButton>
            <CasaButton type='button' secondary onClick={onCancel}>
              Cancelar
            </CasaButton>
          </div>
        </form>
      </CasaCard>
      <aside className='overflow-hidden rounded-xl bg-(--azul-fundo)'>
        <img
          src={photo}
          alt='Ambiente de uma residência aconchegante'
          className='aspect-[1.4] w-full object-cover'
        />
        <div className='p-6'>
          <p className='text-xs font-bold text-(--laranja-principal)'>
            SEU CANTO COMEÇA AQUI
          </p>
          <Title className='mt-3 text-3xl font-extrabold'>
            Como você usa seu espaço?
          </Title>
          <p className='mt-4 leading-relaxed text-(--texto-apoio)'>
            Os cômodos escolhidos ajudam você a montar uma rotina possível de
            limpeza e cuidados.
          </p>
        </div>
      </aside>
    </div>
  );
}
