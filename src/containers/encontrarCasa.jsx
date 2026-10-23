import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, Home } from 'lucide-react';
import { Button } from '../components/ui';
import { Page, Panel, Field, Empty, Modal, Badge } from '../components/App/ui';
import { properties } from '../data/catalog';
import { useAppStore } from '../store/useAppStore';
import { money, normalize, financialProjection } from '../utils/format';
import styles from '../styles/app.module.css';

const total = property => property.rent + property.fees + property.tax;

export default function EncontrarCasa() {
  const {
    propertyPreferences: preferences,
    propertyFavorites,
    propertyCompare,
    plan,
  } = useAppStore(state => state.data);
  const { update, toggle, notify } = useAppStore();
  const [selected, setSelected] = useState(null);
  const [photo, setPhoto] = useState(0);
  const [sort, setSort] = useState('price');
  const [contact, setContact] = useState(false);
  const financial = financialProjection(plan);
  const filtered = properties
    .filter(
      item =>
        normalize(
          `${item.city} ${item.district} ${item.region} ${item.title}`
        ).includes(normalize(preferences.query)) &&
        (!preferences.maxPrice ||
          total(item) <= Number(preferences.maxPrice)) &&
        (!preferences.type || item.type === preferences.type) &&
        (!preferences.rooms || item.rooms >= Number(preferences.rooms)) &&
        (!preferences.favorites || propertyFavorites.includes(item.id))
    )
    .sort((a, b) =>
      sort === 'price' ? total(a) - total(b) : b.rooms - a.rooms
    );
  function setPreference(key, value) {
    update({ propertyPreferences: { ...preferences, [key]: value } });
  }
  function compare(id) {
    if (!propertyCompare.includes(id) && propertyCompare.length >= 3) {
      notify('Compare até 3 imóveis por vez. Remova um para incluir outro.');
      return;
    }
    toggle('propertyCompare', id);
  }
  function applyProperty(property) {
    update({
      plan: {
        ...plan,
        rent: property.rent,
        housingFees: property.fees + property.tax,
      },
    });
    notify(
      'Aluguel e taxas adicionados ao seu plano financeiro. Revise as outras despesas e a caução no simulador.'
    );
  }
  return (
    <Page
      title='Encontrar casa'
      eyebrow='UM ENDEREÇO PARA SEUS PLANOS'
      description='Compare possibilidades e descubra o que cabe no seu agora.'
    >
      <p className={styles.info}>
        Catálogo fictício para demonstração. Fotos ilustrativas, valores,
        condições e contatos simulados. Não há imóveis reais disponíveis para
        contratação.
      </p>
      <Panel title='Como é o canto que você procura?'>
        <div className={styles.filters}>
          <Field
            label='Cidade, bairro ou região'
            type='search'
            value={preferences.query}
            onChange={event => setPreference('query', event.target.value)}
            placeholder='Ex.: Vila Mariana'
          />
          <Field
            label='Custo mensal máximo (R$)'
            type='number'
            min='0'
            value={preferences.maxPrice}
            onChange={event => setPreference('maxPrice', event.target.value)}
          />
          <Field
            label='Tipo de imóvel'
            value={preferences.type}
            onChange={event => setPreference('type', event.target.value)}
          >
            <option value=''>Todos</option>
            {['Apartamento', 'Casa', 'Studio'].map(value => (
              <option key={value}>{value}</option>
            ))}
          </Field>
          <Field
            label='Quartos (mínimo)'
            value={preferences.rooms}
            onChange={event => setPreference('rooms', event.target.value)}
          >
            <option value=''>Qualquer</option>
            <option value='1'>1 quarto</option>
            <option value='2'>2 quartos</option>
          </Field>
          <Field
            label='Ordenar'
            value={sort}
            onChange={event => setSort(event.target.value)}
          >
            <option value='price'>Menor custo mensal</option>
            <option value='rooms'>Mais quartos</option>
          </Field>
        </div>
        <div className={styles.row}>
          <label className={styles.check}>
            <input
              type='checkbox'
              checked={preferences.favorites}
              onChange={event =>
                setPreference('favorites', event.target.checked)
              }
            />
            Só imóveis favoritos
          </label>
          <button
            className={styles.textButton}
            onClick={() =>
              update({
                propertyPreferences: {
                  query: '',
                  maxPrice: '',
                  type: '',
                  rooms: '',
                  favorites: false,
                },
              })
            }
          >
            Limpar filtros
          </button>
        </div>
        <small className={styles.muted}>
          Suas preferências ficam salvas automaticamente. O filtro considera
          aluguel + condomínio + IPTU.
        </small>
      </Panel>
      <p>{filtered.length} opção(ões) encontrada(s)</p>
      {filtered.length ? (
        <div className={styles.cards}>
          {filtered.map(property => (
            <article key={property.id} className={styles.card}>
              <img
                src={property.image}
                alt={`Foto ilustrativa: ${property.type}`}
                loading='lazy'
              />
              <div className={styles.cardBody}>
                <div className={styles.row}>
                  <Badge>
                    {property.type} · {property.rooms} quarto(s)
                  </Badge>
                  <button
                    className={styles.iconButton}
                    aria-label={`Favoritar ${property.title}`}
                    aria-pressed={propertyFavorites.includes(property.id)}
                    onClick={() => toggle('propertyFavorites', property.id)}
                  >
                    <Heart
                      size={20}
                      fill={
                        propertyFavorites.includes(property.id)
                          ? 'currentColor'
                          : 'none'
                      }
                    />
                  </button>
                </div>
                <h3>{property.title}</h3>
                <p className={styles.muted}>
                  <MapPin size={16} className='inline' /> {property.district},{' '}
                  {property.city} · {property.area} m²
                </p>
                <strong className='text-xl'>
                  {money(total(property))}/mês
                </strong>
                <p className={styles.muted}>
                  Aluguel {money(property.rent)} + taxas{' '}
                  {money(property.fees + property.tax)}
                </p>
                <label className={styles.check}>
                  <input
                    type='checkbox'
                    checked={propertyCompare.includes(property.id)}
                    onChange={() => compare(property.id)}
                  />
                  Comparar imóvel
                </label>
                <Button
                  color='laranja'
                  onClick={() => {
                    setSelected(property);
                    setPhoto(0);
                    setContact(false);
                  }}
                >
                  Ver detalhes
                </Button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <Empty
          title='Nenhum canto com esses filtros.'
          description='Ajuste a região ou o custo máximo para explorar outras opções.'
        />
      )}
      {propertyCompare.length > 0 && (
        <Panel title={`Compare seus favoritos · ${propertyCompare.length}/3`}>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <caption className='sr-only'>
                Comparação dos imóveis selecionados
              </caption>
              <thead>
                <tr>
                  <th>Imóvel</th>
                  <th>Região</th>
                  <th>Quartos</th>
                  <th>Aluguel</th>
                  <th>Taxas</th>
                  <th>Total mensal</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {properties
                  .filter(item => propertyCompare.includes(item.id))
                  .map(property => (
                    <tr key={property.id}>
                      <td>{property.title}</td>
                      <td>{property.district}</td>
                      <td>{property.rooms}</td>
                      <td>{money(property.rent)}</td>
                      <td>{money(property.fees + property.tax)}</td>
                      <td>{money(total(property))}</td>
                      <td>
                        <button
                          className={styles.textButton}
                          onClick={() => compare(property.id)}
                        >
                          Remover da comparação
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </Panel>
      )}
      <Panel
        title='A casa também precisa caber no plano.'
        className={styles.tinted}
      >
        <p>
          Seu orçamento salvo considera{' '}
          {money(plan.rent + (plan.housingFees || 0))} para aluguel e taxas, e{' '}
          {money(financial.monthly)} para o custo mensal total.
        </p>
        <Button as={Link} to='/financas' color='azul'>
          Revisar meu orçamento ↗
        </Button>
      </Panel>
      {selected && (
        <Modal title={selected.title} onClose={() => setSelected(null)}>
          <div className={styles.stack}>
            <img
              src={selected.photos[photo]}
              alt={`Foto ilustrativa ${photo + 1} do imóvel de exemplo`}
              className={styles.photo}
            />
            <div className={styles.tabs}>
              {selected.photos.map((_, index) => (
                <button
                  key={index}
                  aria-pressed={photo === index}
                  onClick={() => setPhoto(index)}
                >
                  Foto {index + 1}
                </button>
              ))}
            </div>
            <Badge>
              <Home size={14} />
              {selected.type} · {selected.rooms} quarto(s) · {selected.area} m²
            </Badge>
            <p>{selected.description}</p>
            <p>
              {selected.district} · {selected.city} · {selected.region}
            </p>
            <ul className={styles.list}>
              <li>Aluguel: {money(selected.rent)}</li>
              <li>Condomínio: {money(selected.fees)}</li>
              <li>IPTU mensal: {money(selected.tax)}</li>
              <li>
                <strong>Total: {money(total(selected))}/mês</strong>
              </li>
            </ul>
            <h3>Condições de exemplo</h3>
            <p>{selected.conditions}</p>
            <h3>Sobre a região</h3>
            <p>{selected.neighborhood}</p>
            <div className={styles.info}>
              Com as suas outras despesas estimadas, este imóvel resultaria em{' '}
              {money(total(selected) + plan.bills + plan.food + plan.transport)}
              /mês. Sua renda informada é {money(plan.income)}.
            </div>
            <Button color='laranja' onClick={() => applyProperty(selected)}>
              Usar aluguel e taxas no meu orçamento
            </Button>
            <button
              className={styles.textButton}
              onClick={() => setContact(value => !value)}
            >
              Ver contato demonstrativo
            </button>
            {contact && (
              <p role='status'>
                {selected.contact}. Nenhum contato será realizado.
              </p>
            )}
            <Button as={Link} to='/financas' color='azul'>
              Abrir simulador financeiro
            </Button>
          </div>
        </Modal>
      )}
    </Page>
  );
}
