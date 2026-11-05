import { Title } from '../../../shared/ui';
import { hasIngredient } from '../content';

const images = import.meta.glob('../assets/*.png', {
  eager: true,
  query: '?url',
  import: 'default',
});
export function RecipeImage({ recipe, detail = false, className = '' }) {
  return (
    <img
      src={
        images[
          '../assets/' +
            (detail && recipe.detailImage ? recipe.detailImage : recipe.image) +
            '.png'
        ]
      }
      alt={recipe.title}
      className={'w-full object-cover ' + className}
    />
  );
}
export default function RecipeCards({
  recipes,
  onOpen,
  pantry,
  onFavorite,
  favorites,
}) {
  return recipes.length ? (
    <div className='grid gap-6 sm:grid-cols-2 xl:grid-cols-3'>
      {recipes.map(recipe => (
        <article
          key={recipe.id}
          className='relative min-w-0 overflow-hidden rounded-xl border border-[#dbe5ed] bg-white'
        >
          <button
            type='button'
            onClick={() => onOpen(recipe.id)}
            className='block w-full text-left hover:bg-(--azul-fundo)'
          >
            <RecipeImage recipe={recipe} className='aspect-[1.6]' />
            <div className='space-y-3 p-5'>
              <Title className='pr-9 text-2xl font-extrabold'>
                {recipe.title}
              </Title>
              <p className='text-sm text-(--texto-apoio)'>
                {recipe.minutes} min · {recipe.portions}{' '}
                {recipe.portions === 1 ? 'porção' : 'porções'}
              </p>
              <div className='flex flex-wrap gap-2'>
                {recipe.tags.map(tag => (
                  <span
                    key={tag}
                    className='rounded-full bg-(--azul-fundo) px-3 py-1 text-xs'
                  >
                    {tag}
                  </span>
                ))}
              </div>
              {pantry && (
                <p className='text-xs text-(--texto-apoio)'>
                  {
                    recipe.ingredients.filter(item =>
                      hasIngredient(pantry, item.name)
                    ).length
                  }{' '}
                  de {recipe.ingredients.length} ingredientes disponíveis
                </p>
              )}
              <span className='inline-block text-sm font-bold text-(--laranja-principal)'>
                Ver receita →
              </span>
            </div>
          </button>
          <button
            type='button'
            aria-label={
              (favorites.includes(recipe.id)
                ? 'Remover dos favoritos: '
                : 'Salvar receita: ') + recipe.title
            }
            aria-pressed={favorites.includes(recipe.id)}
            onClick={() => onFavorite(recipe.id)}
            className='absolute right-3 bottom-3 flex size-11 items-center justify-center rounded-full border border-[#dbe5ed] bg-white text-xl text-(--laranja-principal)'
          >
            {favorites.includes(recipe.id) ? '♥' : '♡'}
          </button>
        </article>
      ))}
    </div>
  ) : (
    <p
      role='status'
      className='rounded-xl bg-(--azul-fundo) p-10 text-center text-(--texto-apoio)'
    >
      Nenhuma receita encontrada. Tente outro termo ou explore o catálogo.
    </p>
  );
}
