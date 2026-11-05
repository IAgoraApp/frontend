import { useState } from 'react';
import {
  CasaButton as Action,
  CasaCard as Card,
} from '../../casa/components/casaUi';
import { formatAmount, hasIngredient, missingIngredients } from '../content';
import { RecipeImage } from './recipeCards';

export default function RecipeDetail({
  recipe,
  data,
  onFavorite,
  onPantry,
  onShopping,
  onMeal,
  onCheck,
}) {
  const [portions, setPortions] = useState(recipe.portions);
  const missing = missingIngredients(recipe, portions, data.pantry);
  return (
    <div className='space-y-6'>
      <div className='grid items-start gap-6 lg:grid-cols-2'>
        <RecipeImage
          recipe={recipe}
          detail
          className='aspect-[1.4] rounded-xl'
        />
        <div className='space-y-5'>
          <p className='text-sm text-(--texto-apoio)'>
            {recipe.minutes} min · {portions} porções · Nível: {recipe.level}
          </p>
          <p className='text-lg leading-relaxed'>{recipe.description}</p>
          <div className='flex flex-wrap gap-3'>
            <Action
              secondary
              aria-pressed={data.favorites.includes(recipe.id)}
              onClick={() => onFavorite(recipe.id)}
            >
              {data.favorites.includes(recipe.id)
                ? 'Receita salva ♥'
                : 'Salvar receita ♡'}
            </Action>
            <Action onClick={() => onMeal(recipe, portions)}>
              Adicionar ao plano
            </Action>
          </div>
          <Card title='Ingredientes'>
            <div className='mb-5 flex flex-wrap items-center gap-3'>
              <button
                type='button'
                disabled={portions <= 1}
                onClick={() => setPortions(value => value - 1)}
                aria-label='Diminuir porções'
                className='size-11 rounded-full border border-[#dbe5ed] disabled:opacity-40'
              >
                −
              </button>
              <output
                aria-live='polite'
                className='min-w-20 text-center font-bold'
              >
                {portions} porções
              </output>
              <button
                type='button'
                disabled={portions >= 24}
                onClick={() => setPortions(value => value + 1)}
                aria-label='Aumentar porções'
                className='size-11 rounded-full border border-[#dbe5ed] disabled:opacity-40'
              >
                +
              </button>
            </div>
            <ul className='space-y-3'>
              {recipe.ingredients.map((item, index) => (
                <li key={index}>
                  <label className='flex min-h-11 items-center gap-3'>
                    <input
                      type='checkbox'
                      aria-label={'Já tenho ' + item.name + ' ' + item.unit}
                      checked={hasIngredient(data.pantry, item.name)}
                      onChange={event =>
                        onPantry(item.name, event.target.checked)
                      }
                      className='size-5 shrink-0 accent-(--laranja-principal)'
                    />
                    <span>
                      {formatAmount((item.amount * portions) / recipe.portions)}{' '}
                      {item.unit} de {item.name.toLocaleLowerCase('pt-BR')}
                    </span>
                  </label>
                </li>
              ))}
            </ul>
            <p className='mt-4 text-xs text-(--texto-apoio)'>
              Marque os ingredientes que você já tem em casa. As quantidades
              acompanham as porções.
            </p>
          </Card>
        </div>
      </div>
      <Card title='Modo de preparo'>
        <ol className='space-y-4'>
          {recipe.steps.map((step, index) => (
            <li key={index}>
              <label className='flex min-h-14 items-start gap-4 rounded-lg bg-(--azul-fundo) p-4'>
                <input
                  type='checkbox'
                  checked={Boolean(data.checks[recipe.id + ':' + index])}
                  onChange={event =>
                    onCheck(recipe.id + ':' + index, event.target.checked)
                  }
                  className='mt-1 size-5 shrink-0 accent-(--laranja-principal)'
                />
                <span>
                  <strong>{index + 1}. </strong>
                  {step}
                </span>
              </label>
            </li>
          ))}
        </ol>
      </Card>
      <div className='flex flex-wrap gap-3'>
        <Action onClick={() => onShopping(missing)} disabled={!missing.length}>
          Adicionar ingredientes faltantes ({missing.length})
        </Action>
        <Action secondary onClick={() => onMeal(recipe, portions)}>
          Planejar esta refeição
        </Action>
      </div>
      <p className='text-xs text-(--texto-apoio)'>
        Os tempos são aproximados e podem variar conforme o equipamento. Ajuste
        o preparo e confira o ponto dos alimentos.
      </p>
    </div>
  );
}
