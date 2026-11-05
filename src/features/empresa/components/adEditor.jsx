import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FormField, Title } from '../../../shared/ui';
import { categories, emptyAd, validateAd } from '../content';
import { Action, Card, Select, ServiceImage } from './empresaUi';
import PhotoEditor from './photoEditor';

export default function AdEditor({ ad, company, onSave }) {
  const [values, setValues] = useState(() => ad ?? emptyAd(company));
  const [error, setError] = useState('');
  const change = event =>
    setValues(previous => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
  function save(mode) {
    const next = {
      ...values,
      title: values.title.trim(),
      description: values.description.trim(),
      updatedAt: new Date().toISOString(),
    };
    const invalid = mode === 'draft' ? '' : validateAd(next);
    if (invalid) {
      setError(invalid);
      return;
    }
    onSave(next, mode);
  }
  const field = (name, label, required = false, type = 'text') => (
    <FormField
      key={name}
      id={'ad-' + name}
      name={name}
      label={label}
      value={values[name]}
      onChange={change}
      required={required}
      type={type}
      maxLength={name === 'description' ? 2000 : 200}
    />
  );
  return (
    <div className='grid items-start gap-6 lg:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)]'>
      <Card>
        <form
          className='space-y-6'
          onSubmit={event => {
            event.preventDefault();
            save(ad ? 'update' : 'preview');
          }}
        >
          <Title className='text-xl font-bold'>01 / Sobre o serviço</Title>
          {field('title', 'Título do anúncio', true)}
          <Select
            id='ad-category'
            name='category'
            label='Categoria'
            value={values.category}
            onChange={change}
          >
            {categories.map(category => (
              <option key={category}>{category}</option>
            ))}
          </Select>
          <label
            htmlFor='ad-description'
            className='flex flex-col gap-2 text-sm font-bold'
          >
            Descrição
            <textarea
              id='ad-description'
              name='description'
              rows={5}
              required
              value={values.description}
              onChange={change}
              maxLength={2000}
              placeholder='O que está incluído? Como funciona o atendimento?'
              className='rounded-lg border border-[#dbe5ed] p-4 font-normal'
            />
          </label>
          <Title className='text-xl font-bold'>
            02 / Atendimento e valores
          </Title>
          <div className='grid gap-5 sm:grid-cols-2'>
            {field('region', 'Região atendida', true)}
            {field('price', 'Preço ou orçamento', true)}
            {field('phone', 'Telefone')}
            {field('email', 'E-mail', false, 'email')}
          </div>
          <Select
            id='ad-attendance'
            name='attendance'
            label='Tipo de atendimento'
            value={values.attendance}
            onChange={change}
          >
            {['Residencial', 'Comercial', 'Ambos', 'On-line'].map(value => (
              <option key={value}>{value}</option>
            ))}
          </Select>
          {field('availability', 'Disponibilidade e horários')}
          <Title className='text-xl font-bold'>03 / Mostre seu trabalho</Title>
          <PhotoEditor
            photos={values.photos}
            onChange={photos =>
              setValues(previous => ({ ...previous, photos }))
            }
          />
          {error && (
            <p
              role='alert'
              className='rounded-lg bg-red-50 p-4 text-sm text-red-800'
            >
              {error}
            </p>
          )}
          <div className='flex flex-wrap gap-3'>
            <Action type='submit'>
              {ad ? 'Salvar alterações' : 'Revisar e publicar serviço'}
            </Action>
            <Action secondary type='button' onClick={() => save('preview')}>
              Ver prévia
            </Action>
            {!ad && (
              <Action secondary type='button' onClick={() => save('draft')}>
                Salvar rascunho
              </Action>
            )}
            <Action secondary as={Link} to='/meus-servicos'>
              Cancelar
            </Action>
          </div>
        </form>
      </Card>
      <aside className='space-y-5 lg:sticky lg:top-6'>
        <Card title='Como seu anúncio aparece'>
          <ServiceImage ad={values} className='mb-4 aspect-[1.5] rounded-lg' />
          <p className='text-xs font-bold text-(--laranja-principal)'>
            {company.name}
          </p>
          <Title className='mt-3 text-2xl font-extrabold'>
            {values.title || 'Título do seu serviço'}
          </Title>
          <p className='mt-3 text-sm text-(--texto-apoio)'>
            {values.region || 'Região de atendimento'} ·{' '}
            {values.price || 'Sob orçamento'}
          </p>
          <p className='mt-4 whitespace-pre-wrap text-sm'>
            {values.description ||
              'Uma descrição direta ajuda o consumidor a entender seu serviço.'}
          </p>
          <Action
            secondary
            as={Link}
            to={'/empresas/' + company.id}
            className='mt-5'
          >
            Ver perfil público ↗
          </Action>
        </Card>
      </aside>
    </div>
  );
}
