import { useState } from 'react';
import { Heart, Clock, Search } from 'lucide-react';
import { Button } from '../ui';
import { Panel, Field, Modal, Empty, Badge, Confirm } from '../App/ui';
import { recipes } from '../../data/catalog';
import { useAppStore } from '../../store/useAppStore';
import { normalize, today, dateLabel } from '../../utils/format';
import styles from '../../styles/app.module.css';

export default function RecipeExplorer() {
  const { pantry, recipeFavorites, mealPlan } = useAppStore(
    state => state.data
  );
  const { update, toggle, saveItem, removeItem, notify } = useAppStore();
  const [query, setQuery] = useState('');
  const [favorites, setFavorites] = useState(false);
  const [suggesting, setSuggesting] = useState(false);
  const [selected, setSelected] = useState(null);
  const [planning, setPlanning] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const ingredients = pantry.split(',').map(normalize).filter(Boolean);
  const matchCount = recipe =>
    recipe.ingredients.filter(item =>
      ingredients.some(
        ingredient =>
          normalize(item).includes(ingredient) ||
          ingredient.includes(normalize(item))
      )
    ).length;
  const filtered = recipes
    .filter(
      recipe =>
        normalize(`${recipe.name} ${recipe.ingredients.join(' ')}`).includes(
          normalize(query)
        ) &&
        (!favorites || recipeFavorites.includes(recipe.id)) &&
        (!suggesting || matchCount(recipe) > 0)
    )
    .sort((a, b) =>
      suggesting ? matchCount(b) - matchCount(a) : a.name.localeCompare(b.name)
    );
  function generateShopping() {
    const { data } = useAppStore.getState();
    const items = [];
    for (const meal of data.mealPlan) {
      const recipe = recipes.find(item => item.id === meal.recipeId);
      recipe.ingredients.forEach((name, index) => {
        const source = `${meal.id}:${name}`;
        if (!data.shopping.some(item => item.source === source))
          items.push({
            id: crypto.randomUUID(),
            name: recipe.quantities[index],
            description: `${recipe.name} · ${dateLabel(meal.date)}`,
            source,
            done: false,
          });
      });
    }
    update({ shopping: [...data.shopping, ...items] });
    notify(
      items.length
        ? `${items.length} item(ns) adicionado(s) à lista de compras.`
        : 'A lista já contém os ingredientes desse planejamento.'
    );
    document
      .getElementById('lista-compras')
      ?.scrollIntoView({ behavior: 'smooth' });
  }
  return (
    <div className={`${styles.app} ${styles.stack}`} id='explorar-receitas'>
      <Panel
        title='O que vamos cozinhar?'
        description='Receitas simples para ganhar confiança, uma refeição por vez.'
      >
        <div className={styles.filters}>
          <Field
            label='Pesquisar nome ou ingrediente'
            type='search'
            value={query}
            onChange={event => setQuery(event.target.value)}
            placeholder='Tomate, arroz, macarrão…'
          />
          <label className={styles.check}>
            <input
              type='checkbox'
              checked={favorites}
              onChange={event => setFavorites(event.target.checked)}
            />
            Só favoritas
          </label>
        </div>
        <Field
          label='Ingredientes que você tem (separados por vírgula)'
          value={pantry}
          onChange={event => {
            update({ pantry: event.target.value });
            setSuggesting(false);
          }}
          placeholder='ovo, tomate, arroz'
          maxLength={500}
        />
        <div className={styles.actions}>
          <Button
            color='azul'
            disabled={!ingredients.length}
            onClick={() => setSuggesting(true)}
          >
            <Search size={16} className='mr-2' />
            Sugerir com meus ingredientes
          </Button>
          {suggesting && (
            <button
              className={styles.textButton}
              onClick={() => setSuggesting(false)}
            >
              Mostrar todas
            </button>
          )}
        </div>
        <small className={styles.muted}>
          Sugestões por correspondência de ingredientes, calculadas neste
          navegador. Sem IA ou consulta externa.
        </small>
      </Panel>
      {filtered.length ? (
        <div className={styles.cards}>
          {filtered.map(recipe => (
            <article className={styles.card} key={recipe.id}>
              <img src={recipe.image} alt={recipe.name} loading='lazy' />
              <div className={styles.cardBody}>
                <div className={styles.row}>
                  <Badge>
                    <Clock size={14} />
                    {recipe.time} min · {recipe.portions} porção(ões)
                  </Badge>
                  <button
                    className={styles.iconButton}
                    aria-label={`Favoritar ${recipe.name}`}
                    aria-pressed={recipeFavorites.includes(recipe.id)}
                    onClick={() => toggle('recipeFavorites', recipe.id)}
                  >
                    <Heart
                      size={20}
                      fill={
                        recipeFavorites.includes(recipe.id)
                          ? 'currentColor'
                          : 'none'
                      }
                    />
                  </button>
                </div>
                <h3>{recipe.name}</h3>
                <p className={styles.muted}>{recipe.ingredients.join(', ')}</p>
                {suggesting && (
                  <p>
                    {matchCount(recipe)} de {recipe.ingredients.length}{' '}
                    ingredientes encontrados. Confira o que falta.
                  </p>
                )}
                <div className={styles.actions}>
                  <Button color='azul' onClick={() => setSelected(recipe)}>
                    Ver receita
                  </Button>
                  <button
                    className={styles.textButton}
                    onClick={() => setPlanning(recipe)}
                  >
                    Planejar refeição
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <Empty
          title='Nenhuma receita encontrada.'
          description='Experimente outros ingredientes ou retire o filtro de favoritas.'
        />
      )}
      <Panel title='Sua semana à mesa.'>
        {mealPlan.length ? (
          <>
            <ul className={styles.list}>
              {mealPlan
                .slice()
                .sort((a, b) => a.date.localeCompare(b.date))
                .map(meal => (
                  <li key={meal.id}>
                    <div className={styles.row}>
                      <div>
                        <strong>
                          {
                            recipes.find(recipe => recipe.id === meal.recipeId)
                              ?.name
                          }
                        </strong>
                        <p className={styles.muted}>
                          {dateLabel(meal.date)} · {meal.meal}
                        </p>
                      </div>
                      <div className={styles.actions}>
                        <button
                          className={styles.textButton}
                          onClick={() =>
                            setPlanning({
                              ...recipes.find(
                                recipe => recipe.id === meal.recipeId
                              ),
                              plan: meal,
                            })
                          }
                        >
                          Editar
                        </button>
                        <button
                          className={styles.textButton}
                          onClick={() => setDeleting(meal)}
                        >
                          Remover
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
            </ul>
            <Button color='laranja' onClick={generateShopping}>
              Gerar lista de compras do planejamento
            </Button>
          </>
        ) : (
          <Empty
            title='Seu cardápio está em aberto.'
            description='Escolha uma receita e use “Planejar refeição”.'
          />
        )}
      </Panel>
      {selected && (
        <Modal title={selected.name} onClose={() => setSelected(null)}>
          <div className={styles.stack}>
            <img
              className={styles.photo}
              src={selected.image}
              alt={selected.name}
            />
            <p>
              {selected.time} minutos · {selected.portions} porção(ões)
            </p>
            <h3>Ingredientes</h3>
            <ul className='list-disc pl-5'>
              {selected.quantities.map(item => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <h3>Passo a passo</h3>
            <ol className='list-decimal pl-5'>
              {selected.steps.map(step => (
                <li key={step} className='mb-3'>
                  {step}
                </li>
              ))}
            </ol>
            <Button
              color='laranja'
              onClick={() => {
                setPlanning(selected);
                setSelected(null);
              }}
            >
              Planejar esta refeição
            </Button>
          </div>
        </Modal>
      )}
      {planning && (
        <Modal title='Planejar refeição' onClose={() => setPlanning(null)}>
          <form
            className={styles.form}
            onSubmit={event => {
              event.preventDefault();
              const values = Object.fromEntries(
                new FormData(event.currentTarget)
              );
              saveItem('mealPlan', {
                ...planning.plan,
                recipeId: planning.id,
                date: values.date,
                meal: values.meal,
              });
              setPlanning(null);
              notify('Refeição salva no planejamento.');
            }}
          >
            <h3>{planning.name}</h3>
            <Field
              label='Dia'
              name='date'
              type='date'
              defaultValue={planning.plan?.date || today()}
              required
            />
            <Field
              label='Refeição'
              name='meal'
              defaultValue={planning.plan?.meal || 'Almoço'}
            >
              {['Café da manhã', 'Almoço', 'Jantar'].map(value => (
                <option key={value}>{value}</option>
              ))}
            </Field>
            <Button color='laranja'>Salvar refeição</Button>
          </form>
        </Modal>
      )}
      {deleting && (
        <Confirm
          title='Remover refeição do planejamento?'
          description='Os ingredientes já gerados permanecem na lista de compras e podem ser removidos por lá.'
          onClose={() => setDeleting(null)}
          onConfirm={() => {
            removeItem('mealPlan', deleting.id);
            notify('Refeição removida.');
          }}
        />
      )}
    </div>
  );
}
