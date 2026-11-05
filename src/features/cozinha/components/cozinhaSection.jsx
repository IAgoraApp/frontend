import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Container, Title } from '../../../shared/ui';
import Footer from '../../../shared/footer';
import {
  CasaButton as Action,
  CasaCard as Card,
  CasaDialog as Dialog,
} from '../../casa/components/casaUi';
import {
  addDays,
  addShopping,
  formatAmount,
  hasIngredient,
  headings,
  ingredientKey,
  monday,
  normalize,
  planIngredients,
  readState,
  recipes,
  storageKey,
} from '../content';
import CozinhaHero from './cozinhaHero';
import RecipeCards from './recipeCards';
import RecipeDetail from './recipeDetail';
import { MealForm, ShoppingForm } from './cozinhaForms';
import MealPlan from './mealPlan';
import ShoppingList from './shoppingList';

export default function CozinhaSection() {
  const [loaded] = useState(readState);
  const [data, setData] = useState(loaded.data);
  const [error, setError] = useState(
    loaded.error
      ? 'Não foi possível carregar a cozinha salva. Os dados anteriores foram preservados.'
      : ''
  );
  const [params, setParams] = useSearchParams();
  const requested = params.get('visao');
  const recipe = recipes.find(item => item.id === params.get('receita'));
  const view = recipe
    ? 'receita'
    : Object.hasOwn(headings, requested)
      ? requested
      : 'inicio';
  const [search, setSearch] = useState('');
  const [pantryText, setPantryText] = useState('');
  const [week, setWeek] = useState(monday);
  const [dialog, setDialog] = useState(null);
  const [formError, setFormError] = useState('');
  const [message, setMessage] = useState('');
  useEffect(() => {
    if (loaded.error) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(data));
    } catch {
      const timer = setTimeout(
        () =>
          setError(
            'Não foi possível salvar no navegador. As alterações ficam disponíveis nesta sessão.'
          ),
        0
      );
      return () => clearTimeout(timer);
    }
  }, [data, loaded.error]);
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(''), 5000);
    return () => clearTimeout(timer);
  }, [message]);
  function navigate(next, id) {
    setParams(
      previous => {
        const updated = new URLSearchParams(previous);
        if (next === 'inicio') updated.delete('visao');
        else updated.set('visao', next);
        if (id) updated.set('receita', id);
        else updated.delete('receita');
        return updated;
      },
      { preventScrollReset: true }
    );
  }
  function open(type, item) {
    setFormError('');
    setDialog({ type, item });
  }
  function favorite(id) {
    setData(previous => ({
      ...previous,
      favorites: previous.favorites.includes(id)
        ? previous.favorites.filter(value => value !== id)
        : [...previous.favorites, id],
    }));
  }
  function pantry(name, available) {
    setData(previous => ({
      ...previous,
      pantry: available
        ? hasIngredient(previous.pantry, name)
          ? previous.pantry
          : [...previous.pantry, name]
        : previous.pantry.filter(
            value => ingredientKey(value) !== ingredientKey(name)
          ),
    }));
  }
  function addPantry(text) {
    const names = text
      .split(/[,;\n]/)
      .map(value => value.trim().slice(0, 80))
      .filter(Boolean);
    setData(previous => ({
      ...previous,
      pantry: names.reduce(
        (result, name) =>
          hasIngredient(result, name) ? result : [...result, name],
        [...previous.pantry]
      ),
    }));
    setPantryText('');
  }
  function check(key, value) {
    setData(previous => ({
      ...previous,
      checks: { ...previous.checks, [key]: value },
    }));
  }
  function shopping(ingredients) {
    if (!ingredients.length) {
      setMessage('Não há ingredientes faltantes para adicionar.');
      return;
    }
    setData(previous => addShopping(previous, ingredients));
    setMessage(
      'Ingredientes adicionados à lista de compras. Itens repetidos foram agrupados.'
    );
  }
  function generateShopping() {
    const meals = data.meals.filter(
      item => item.date >= week && item.date <= addDays(week, 6)
    );
    if (!meals.length) {
      setMessage('Adicione refeições ao plano desta semana primeiro.');
      return;
    }
    shopping(planIngredients(meals, data.pantry));
  }
  function suggestPlan() {
    setData(previous => {
      const meals = [...previous.meals];
      for (let day = 0; day < 7; day++) {
        const date = addDays(week, day);
        for (const [index, type] of ['Almoço', 'Jantar'].entries())
          if (!meals.some(item => item.date === date && item.type === type))
            meals.push({
              id: crypto.randomUUID(),
              date,
              type,
              recipeId: ['macarrao', 'omelete', 'shakshuka'][(day + index) % 3],
              portions: 2,
            });
      }
      return { ...previous, meals };
    });
    setMessage(
      'Espaços vazios preenchidos com sugestões do catálogo. Ajuste ao seu ritmo.'
    );
  }
  function saveMeal(item) {
    if (
      data.meals.some(
        meal =>
          meal.id !== item.id &&
          meal.date === item.date &&
          meal.type === item.type
      )
    ) {
      setFormError(
        'Já existe uma refeição neste dia e horário. Edite a refeição existente ou escolha outro horário.'
      );
      return;
    }
    setData(previous => ({
      ...previous,
      meals: previous.meals.some(meal => meal.id === item.id)
        ? previous.meals.map(meal => (meal.id === item.id ? item : meal))
        : [...previous.meals, item],
    }));
    setWeek(monday(item.date));
    setDialog(null);
    setMessage('Refeição salva no plano.');
  }
  function saveItem(item) {
    setData(previous => ({
      ...previous,
      shopping: previous.shopping.some(entry => entry.id === item.id)
        ? previous.shopping.map(entry => (entry.id === item.id ? item : entry))
        : [...previous.shopping, item],
    }));
    setDialog(null);
    setMessage('Item salvo na lista.');
  }
  function exportList() {
    const text =
      'Minha lista de compras\n\n' +
      data.shopping
        .map(
          item =>
            (item.bought ? '[x] ' : '[ ] ') +
            item.name +
            ' · ' +
            formatAmount(item.amount) +
            ' ' +
            item.unit
        )
        .join('\n');
    const url = URL.createObjectURL(
      new Blob([text], { type: 'text/plain;charset=utf-8' })
    );
    const link = document.createElement('a');
    link.href = url;
    link.download = 'minha-lista-de-compras.txt';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  const searchResults = recipes.filter(item =>
    normalize(
      item.title +
        ' ' +
        item.tags.join(' ') +
        ' ' +
        item.ingredients.map(ingredient => ingredient.name).join(' ')
    ).includes(normalize(search))
  );
  const pantryRecipes = [...recipes]
    .filter(item =>
      item.ingredients.some(ingredient =>
        hasIngredient(data.pantry, ingredient.name)
      )
    )
    .sort(
      (a, b) =>
        b.ingredients.filter(item => hasIngredient(data.pantry, item.name))
          .length /
          b.ingredients.length -
        a.ingredients.filter(item => hasIngredient(data.pantry, item.name))
          .length /
          a.ingredients.length
    );
  const cards = items => (
    <RecipeCards
      recipes={items}
      favorites={data.favorites}
      onFavorite={favorite}
      pantry={view === 'despensa' ? data.pantry : undefined}
      onOpen={id => navigate('receita', id)}
    />
  );
  return (
    <div
      lang='pt-BR'
      className='min-w-0 flex-1 bg-white font-body leading-normal text-(--azul-titulo) wrap-anywhere [&_:is(a,button,input,select,textarea):focus-visible]:outline-2 [&_:is(a,button,input,select,textarea):focus-visible]:outline-offset-3 [&_:is(a,button,input,select,textarea):focus-visible]:outline-(--laranja-principal)'
    >
      <main>
        <Container className='pt-4'>
          {error && (
            <p role='alert' className='mt-4 rounded-lg bg-amber-50 p-4 text-sm'>
              {error}
            </p>
          )}
        </Container>
        <Container className='pb-10'>
          {view === 'inicio' ? (
            <CozinhaHero
              navigate={navigate}
              checks={data.checks}
              onCheck={check}
            />
          ) : (
            <>
              <header className='py-8'>
                <button
                  type='button'
                  onClick={() =>
                    navigate(view === 'receita' ? 'buscar' : 'inicio')
                  }
                  className='mb-4 min-h-11 text-sm font-bold text-(--texto-apoio)'
                >
                  ← Voltar
                </button>
                <p className='text-xs font-bold text-(--laranja-principal)'>
                  HOJE TEM EU QUE FIZ
                </p>
                <Title
                  as='h1'
                  className='mt-3 text-3xl leading-tight font-extrabold sm:text-4xl'
                >
                  {recipe?.title ?? headings[view][0]}
                </Title>
                <p className='mt-3 text-(--texto-apoio)'>
                  {recipe ? recipe.description : headings[view][1]}
                </p>
              </header>
              {view === 'buscar' && (
                <div className='space-y-6'>
                  <input
                    aria-label='Buscar receita'
                    type='search'
                    value={search}
                    onChange={event => setSearch(event.target.value)}
                    placeholder='Ex.: Bolo de chocolate, macarrão, omelete...'
                    maxLength={200}
                    className='min-h-13 w-full rounded-full border border-[#dbe5ed] px-5'
                  />
                  <div className='flex flex-wrap gap-2'>
                    {[
                      'Bolo de chocolate',
                      'Macarrão',
                      'Omelete',
                      'Sem ovos',
                    ].map(text => (
                      <button
                        type='button'
                        key={text}
                        onClick={() => setSearch(text)}
                        className='min-h-11 rounded-full bg-(--azul-fundo) px-4 text-sm'
                      >
                        {text}
                      </button>
                    ))}
                  </div>
                  <p className='text-xs text-(--texto-apoio)'>
                    Busca no catálogo local de receitas. A IA ainda não está
                    conectada.
                  </p>
                  {cards(searchResults)}
                </div>
              )}
              {view === 'despensa' && (
                <div className='space-y-6'>
                  <form
                    className='flex flex-wrap gap-3'
                    onSubmit={event => {
                      event.preventDefault();
                      addPantry(pantryText);
                    }}
                  >
                    <input
                      aria-label='Ingredientes disponíveis'
                      value={pantryText}
                      onChange={event => setPantryText(event.target.value)}
                      placeholder='Ex.: ovo, cebola, tomate'
                      maxLength={1000}
                      required
                      className='min-h-13 min-w-0 flex-1 rounded-full border border-[#dbe5ed] px-5'
                    />
                    <Action type='submit'>Adicionar ingredientes</Action>
                  </form>
                  <div className='flex flex-wrap gap-3'>
                    {data.pantry.map(name => (
                      <button
                        type='button'
                        key={name}
                        aria-label={'Remover ingrediente ' + name}
                        onClick={() => pantry(name, false)}
                        className='min-h-11 rounded-full bg-(--laranja-fundo) px-4 text-sm'
                      >
                        {name} ×
                      </button>
                    ))}
                  </div>
                  <p className='text-xs text-(--texto-apoio)'>
                    As receitas são comparadas com os ingredientes informados.
                    Confira os itens faltantes na receita; as quantidades
                    disponíveis não são controladas.
                  </p>
                  {data.pantry.length ? (
                    cards(pantryRecipes)
                  ) : (
                    <Card title='Comece pelo que você já tem'>
                      <p className='mb-4 text-(--texto-apoio)'>
                        Adicione seus ingredientes para encontrar ideias no
                        catálogo.
                      </p>
                      <Action
                        secondary
                        onClick={() => addPantry('Ovo, Cebola, Tomate')}
                      >
                        Experimentar ovo, cebola e tomate
                      </Action>
                    </Card>
                  )}
                </div>
              )}
              {view === 'receita' && recipe && (
                <RecipeDetail
                  key={recipe.id}
                  recipe={recipe}
                  data={data}
                  onFavorite={favorite}
                  onPantry={pantry}
                  onShopping={shopping}
                  onMeal={(item, portions) =>
                    open('meal', { recipeId: item.id, portions })
                  }
                  onCheck={check}
                />
              )}
              {view === 'favoritas' &&
                cards(recipes.filter(item => data.favorites.includes(item.id)))}
              {view === 'plano' && (
                <MealPlan
                  week={week}
                  meals={data.meals}
                  onWeek={setWeek}
                  onEdit={item => open('meal', item)}
                  onSuggest={suggestPlan}
                  onShopping={generateShopping}
                />
              )}
              {view === 'compras' && (
                <ShoppingList
                  items={data.shopping}
                  onEdit={item => open('shopping', item)}
                  onToggle={id =>
                    setData(previous => ({
                      ...previous,
                      shopping: previous.shopping.map(item =>
                        item.id === id
                          ? { ...item, bought: !item.bought }
                          : item
                      ),
                    }))
                  }
                  onGenerate={generateShopping}
                  onClear={() => open('clear')}
                  onExport={exportList}
                />
              )}
              {view === 'basico' && (
                <div className='space-y-6'>
                  <Card title='Uma refeição de cada vez.'>
                    <ul className='list-inside list-disc space-y-3 text-(--texto-apoio)'>
                      <li>
                        Leia a receita inteira e separe os ingredientes antes de
                        começar.
                      </li>
                      <li>
                        Use utensílios adequados e mantenha a bancada limpa.
                      </li>
                      <li>Prepare pequenas porções e ajuste ao seu tempo.</li>
                      <li>
                        Confira o ponto dos alimentos e tenha cuidado com o fogo
                        e os utensílios quentes.
                      </li>
                    </ul>
                  </Card>
                  {cards(recipes.filter(item => item.minutes <= 25))}
                  <Action
                    secondary
                    as={Link}
                    to='/limpeza?visao=guia&guia=cozinha'
                  >
                    Aprender a limpar a cozinha ↗
                  </Action>
                </div>
              )}
            </>
          )}
        </Container>
        <section className='bg-(--azul-titulo) py-8 text-white'>
          <Container className='flex flex-wrap items-center justify-between gap-6'>
            <div>
              <Title className='text-3xl font-extrabold'>
                Aprender a cozinhar também é se cuidar.
              </Title>
              <p className='mt-2 text-sm'>
                Um repertório simples já muda a sua semana.
              </p>
            </div>
            <Action onClick={() => navigate('basico')}>
              Aprender o básico ↗
            </Action>
          </Container>
        </section>
      </main>
      <Footer variant='landing' />
      {message && (
        <div
          role='status'
          className='fixed right-4 bottom-4 left-4 z-40 flex items-center justify-between gap-4 rounded-xl bg-(--azul-titulo) p-4 text-sm text-white sm:left-auto sm:max-w-md'
        >
          {message}
          <button
            type='button'
            onClick={() => setMessage('')}
            aria-label='Fechar aviso'
            className='size-11 shrink-0 text-xl'
          >
            ×
          </button>
        </div>
      )}
      {dialog && (
        <Dialog
          title={
            dialog.type === 'meal'
              ? dialog.item?.id
                ? 'Editar refeição'
                : 'Uma receita no seu plano.'
              : dialog.type === 'shopping'
                ? dialog.item
                  ? 'Editar item'
                  : 'O que falta comprar?'
                : dialog.type === 'clear'
                  ? 'Limpar itens comprados?'
                  : 'Remover registro?'
          }
          onClose={() => setDialog(null)}
        >
          {formError && (
            <p
              role='alert'
              className='mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-800'
            >
              {formError}
            </p>
          )}
          {dialog.type === 'meal' ? (
            <MealForm
              item={dialog.item}
              onSave={saveMeal}
              onCancel={() => setDialog(null)}
              onRemove={() => open('remove-meal', dialog.item)}
            />
          ) : dialog.type === 'shopping' ? (
            <ShoppingForm
              item={dialog.item}
              onSave={saveItem}
              onCancel={() => setDialog(null)}
              onRemove={() => open('remove-item', dialog.item)}
            />
          ) : (
            <>
              <p className='mb-6 text-(--texto-apoio)'>
                {dialog.type === 'clear'
                  ? 'Os itens marcados como comprados serão removidos da lista.'
                  : 'Este registro será removido. Deseja continuar?'}
              </p>
              <div className='flex flex-wrap gap-3'>
                <Action
                  onClick={() => {
                    setData(previous =>
                      dialog.type === 'clear'
                        ? {
                            ...previous,
                            shopping: previous.shopping.filter(
                              item => !item.bought
                            ),
                          }
                        : dialog.type === 'remove-meal'
                          ? {
                              ...previous,
                              meals: previous.meals.filter(
                                item => item.id !== dialog.item.id
                              ),
                            }
                          : {
                              ...previous,
                              shopping: previous.shopping.filter(
                                item => item.id !== dialog.item.id
                              ),
                            }
                    );
                    setDialog(null);
                    setMessage('Registro atualizado.');
                  }}
                >
                  Confirmar remoção
                </Action>
                <Action secondary onClick={() => setDialog(null)}>
                  Cancelar
                </Action>
              </div>
            </>
          )}
        </Dialog>
      )}
    </div>
  );
}
