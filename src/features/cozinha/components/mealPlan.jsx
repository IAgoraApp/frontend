import { Title } from '../../../shared/ui';
import {
  CasaButton as Action,
  CasaCard as Card,
} from '../../casa/components/casaUi';
import { addDays, mealTypes, recipes } from '../content';

export default function MealPlan({
  week,
  meals,
  onWeek,
  onEdit,
  onSuggest,
  onShopping,
}) {
  const days = Array.from({ length: 7 }, (_, i) => addDays(week, i));
  return (
    <div className='space-y-5'>
      <div className='flex flex-wrap items-center justify-between gap-4'>
        <div className='flex items-center gap-3'>
          <button
            type='button'
            aria-label='Semana anterior'
            onClick={() => onWeek(addDays(week, -7))}
            className='size-11 rounded-full border border-[#dbe5ed] text-xl'
          >
            ‹
          </button>
          <strong className='text-sm'>
            {new Date(week + 'T12:00:00').toLocaleDateString('pt-BR')} —{' '}
            {new Date(days[6] + 'T12:00:00').toLocaleDateString('pt-BR')}
          </strong>
          <button
            type='button'
            aria-label='Próxima semana'
            onClick={() => onWeek(addDays(week, 7))}
            className='size-11 rounded-full border border-[#dbe5ed] text-xl'
          >
            ›
          </button>
        </div>
        <Action onClick={onSuggest}>Preencher plano de exemplo</Action>
      </div>
      <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-7'>
        {days.map(day => (
          <Card key={day} className='px-3!'>
            <Title className='mb-4 text-lg font-bold'>
              {new Date(day + 'T12:00:00').toLocaleDateString('pt-BR', {
                weekday: 'short',
                day: '2-digit',
              })}
            </Title>
            <div className='space-y-4'>
              {mealTypes.map(type => {
                const meal = meals.find(
                  item => item.date === day && item.type === type
                );
                const recipe =
                  meal && recipes.find(item => item.id === meal.recipeId);
                return (
                  <div key={type}>
                    <p className='mb-2 text-xs font-bold text-(--texto-apoio)'>
                      {type}
                    </p>
                    <button
                      type='button'
                      aria-label={
                        type +
                        ' em ' +
                        day +
                        (recipe ? ': ' + recipe.title : ': adicionar')
                      }
                      onClick={() =>
                        onEdit(
                          meal ?? {
                            date: day,
                            type,
                            recipeId: 'omelete',
                            portions: 1,
                          }
                        )
                      }
                      className={
                        'min-h-16 w-full rounded-lg border p-3 text-left text-sm ' +
                        (recipe
                          ? 'border-[#f5d3bf] bg-(--laranja-fundo)'
                          : 'border-dashed border-[#dbe5ed] bg-(--azul-fundo)')
                      }
                    >
                      {recipe ? (
                        <>
                          <strong className='block'>{recipe.title}</strong>
                          <span className='mt-1 block text-xs'>
                            {meal.portions} porção(ões)
                          </span>
                        </>
                      ) : (
                        '+ Adicionar'
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </Card>
        ))}
      </div>
      <div className='flex flex-wrap gap-3'>
        <Action onClick={onShopping}>Gerar compras desta semana</Action>
        <Action
          secondary
          onClick={() =>
            onEdit({
              date: week,
              type: 'Almoço',
              recipeId: 'macarrao',
              portions: 2,
            })
          }
        >
          + Adicionar refeição
        </Action>
      </div>
      <p className='text-xs text-(--texto-apoio)'>
        O plano de exemplo usa receitas do catálogo local e preenche apenas
        horários vazios.
      </p>
    </div>
  );
}
