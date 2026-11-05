import { useState } from 'react';
import { FormField } from '../../../shared/ui';
import {
  CasaButton as Action,
  CasaSelect as Select,
} from '../../casa/components/casaUi';
import { dateKey, mealTypes, recipes } from '../content';

export function MealForm({ item, onSave, onCancel, onRemove }) {
  return (
    <form
      className='space-y-5'
      onSubmit={event => {
        event.preventDefault();
        const values = Object.fromEntries(new FormData(event.currentTarget));
        onSave({
          ...values,
          id: item?.id ?? crypto.randomUUID(),
          portions: Number(values.portions),
        });
      }}
    >
      <FormField
        id='meal-date'
        name='date'
        label='Dia'
        type='date'
        defaultValue={item?.date ?? dateKey()}
        required
      />
      <Select
        id='meal-type'
        name='type'
        label='Refeição'
        defaultValue={item?.type ?? 'Almoço'}
      >
        {mealTypes.map(type => (
          <option key={type}>{type}</option>
        ))}
      </Select>
      <Select
        id='meal-recipe'
        name='recipeId'
        label='Receita'
        defaultValue={item?.recipeId ?? 'omelete'}
      >
        {recipes.map(recipe => (
          <option key={recipe.id} value={recipe.id}>
            {recipe.title}
          </option>
        ))}
      </Select>
      <FormField
        id='meal-portions'
        name='portions'
        label='Porções'
        type='number'
        min={1}
        max={24}
        step={1}
        defaultValue={item?.portions ?? 1}
        required
      />
      <div className='flex flex-wrap gap-3'>
        <Action type='submit'>Salvar no plano</Action>
        <Action secondary type='button' onClick={onCancel}>
          Cancelar
        </Action>
        {item?.id && (
          <button
            type='button'
            onClick={onRemove}
            className='min-h-12 px-3 text-sm font-bold text-red-700'
          >
            Remover refeição
          </button>
        )}
      </div>
    </form>
  );
}
export function ShoppingForm({ item, onSave, onCancel, onRemove }) {
  const [error, setError] = useState('');
  return (
    <form
      className='space-y-5'
      onSubmit={event => {
        event.preventDefault();
        const values = Object.fromEntries(new FormData(event.currentTarget));
        const amount = Number(values.amount.replace(',', '.'));
        if (
          !values.name.trim() ||
          !Number.isFinite(amount) ||
          amount <= 0 ||
          amount > 100000
        ) {
          setError('Informe o item e uma quantidade válida maior que zero.');
          return;
        }
        onSave({
          ...values,
          name: values.name.trim(),
          amount,
          id: item?.id ?? crypto.randomUUID(),
          bought: item?.bought ?? false,
        });
      }}
    >
      <FormField
        id='shopping-name'
        name='name'
        label='Item'
        defaultValue={item?.name ?? ''}
        maxLength={100}
        required
      />
      <div className='grid gap-4 sm:grid-cols-2'>
        <FormField
          id='shopping-amount'
          name='amount'
          label='Quantidade'
          inputMode='decimal'
          defaultValue={item?.amount ?? 1}
          maxLength={10}
          required
        />
        <Select
          id='shopping-unit'
          name='unit'
          label='Unidade'
          defaultValue={item?.unit ?? 'unidade'}
        >
          {[
            ...new Set(
              [
                'unidade',
                'g',
                'kg',
                'ml',
                'L',
                'xícara',
                'colher de sopa',
                'colher de chá',
                'dente',
                'pitada',
                item?.unit,
              ].filter(Boolean)
            ),
          ].map(unit => (
            <option key={unit}>{unit}</option>
          ))}
        </Select>
      </div>
      <Select
        id='shopping-category'
        name='category'
        label='Categoria'
        defaultValue={item?.category ?? 'Frescos'}
      >
        {['Frescos', 'Básicos', 'Outros'].map(category => (
          <option key={category}>{category}</option>
        ))}
      </Select>
      {error && (
        <p role='alert' className='text-sm text-red-700'>
          {error}
        </p>
      )}
      <div className='flex flex-wrap gap-3'>
        <Action type='submit'>Salvar item</Action>
        <Action secondary type='button' onClick={onCancel}>
          Cancelar
        </Action>
        {item && (
          <button
            type='button'
            onClick={onRemove}
            className='min-h-12 px-3 text-sm font-bold text-red-700'
          >
            Excluir item
          </button>
        )}
      </div>
    </form>
  );
}
