import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FormField, Title } from '../../../shared/ui';
import { categories, safeUrl } from '../content';
import { Action, Card, Select } from './empresaUi';
import PhotoEditor from './photoEditor';
import samplePortfolio from '../assets/PhotoServices.png';

export default function CompanyProfile({ company, onSave }) {
  const [values, setValues] = useState(company);
  const [error, setError] = useState('');
  const change = event =>
    setValues(previous => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
  return (
    <form
      className='space-y-6'
      onSubmit={event => {
        event.preventDefault();
        if (
          !values.name.trim() ||
          !values.region.trim() ||
          !values.about.trim()
        ) {
          setError('Informe o nome, a região e a apresentação da empresa.');
          return;
        }
        if (values.website && !safeUrl(values.website)) {
          setError('Informe um endereço começando com https:// ou http://.');
          return;
        }
        if (onSave({ ...values, name: values.name.trim() })) setError('');
      }}
    >
      <Card>
        <div className='flex flex-wrap items-center gap-5'>
          {values.logo ? (
            <img
              src={values.logo}
              alt='Logo da empresa'
              className='size-20 rounded-xl object-contain'
            />
          ) : (
            <span className='flex size-20 shrink-0 items-center justify-center rounded-xl bg-(--laranja-fundo) text-2xl font-bold'>
              {values.name
                .split(' ')
                .slice(0, 2)
                .map(word => word[0])
                .join('')}
            </span>
          )}
          <div className='min-w-0 flex-1'>
            <Title className='text-3xl font-extrabold'>{values.name}</Title>
            <p className='mt-2 text-(--texto-apoio)'>
              {values.category} · {values.region}
            </p>
          </div>
          <Action secondary as={Link} to={'/empresas/' + company.id}>
            Ver perfil público ↗
          </Action>
        </div>
      </Card>
      <Card title='Informações da empresa'>
        <div className='grid gap-5 sm:grid-cols-2'>
          {[
            ['name', 'Nome da empresa', 'text'],
            ['email', 'E-mail de contato', 'email'],
            ['phone', 'Telefone comercial', 'tel'],
            ['region', 'Região de atendimento', 'text'],
            ['address', 'Endereço comercial (opcional)', 'text'],
            ['website', 'Site, redes sociais ou portfólio', 'url'],
            ['hours', 'Horário de atendimento', 'text'],
          ].map(([name, label, type]) => (
            <FormField
              key={name}
              id={'company-' + name}
              name={name}
              label={label}
              type={type}
              required={['name', 'email', 'region'].includes(name)}
              value={values[name]}
              onChange={change}
              maxLength={200}
            />
          ))}
          <Select
            id='company-category'
            name='category'
            label='Categoria principal'
            value={values.category}
            onChange={change}
          >
            {categories.map(category => (
              <option key={category}>{category}</option>
            ))}
          </Select>
        </div>
        <label
          className='mt-5 flex flex-col gap-2 text-sm font-bold'
          htmlFor='company-about'
        >
          Sobre a empresa
          <textarea
            id='company-about'
            name='about'
            value={values.about}
            onChange={change}
            maxLength={2000}
            rows={5}
            required
            className='rounded-lg border border-[#dbe5ed] p-4 font-normal'
          />
        </label>
      </Card>
      <Card title='Logo e fotos'>
        <PhotoEditor
          label='Logo da empresa'
          limit={1}
          photos={values.logo ? [values.logo] : []}
          onChange={photos =>
            setValues(previous => ({ ...previous, logo: photos[0] ?? '' }))
          }
        />
        <div className='mt-7'>
          <PhotoEditor
            label='Portfólio da empresa'
            photos={values.portfolio}
            onChange={portfolio =>
              setValues(previous => ({ ...previous, portfolio }))
            }
          />
        </div>
        {!values.portfolio.length && (
          <div className='mt-5'>
            <img
              src={samplePortfolio}
              alt='Exemplo de equipe de serviços'
              className='aspect-[2] w-full rounded-lg object-cover'
            />
            <p className='mt-2 text-xs text-(--texto-apoio)'>
              Imagem ilustrativa. Adicione suas próprias fotos para personalizar
              o perfil.
            </p>
          </div>
        )}
      </Card>
      {error && (
        <p
          role='alert'
          className='rounded-lg bg-red-50 p-4 text-sm text-red-800'
        >
          {error}
        </p>
      )}
      <div className='flex flex-wrap gap-3'>
        <Action type='submit'>Salvar perfil da empresa ↗</Action>
        <Action secondary as={Link} to='/anunciar-servico'>
          Anunciar um serviço ↗
        </Action>
      </div>
    </form>
  );
}
