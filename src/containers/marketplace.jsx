import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui';
import { Page, Panel, Field, Modal, Badge, Empty } from '../components/App/ui';
import ServiceCard from '../components/App/serviceCard';
import CompanyPreview from '../components/App/companyPreview';
import { serviceCategories } from '../data/demo';
import { availableServices } from '../utils/services';
import { useAppStore } from '../store/useAppStore';
import { normalize, money } from '../utils/format';
import Illustration from '../assets/images/div-direita.png';
import styles from '../styles/app.module.css';

export default function Marketplace() {
  const data = useAppStore(state => state.data);
  const { update, toggle, saveItem, notify } = useAppStore();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [region, setRegion] = useState('');
  const [price, setPrice] = useState('');
  const [attendance, setAttendance] = useState('');
  const [favorites, setFavorites] = useState(false);
  const [sort, setSort] = useState('name');
  const [selected, setSelected] = useState(null);
  const [contact, setContact] = useState(false);
  const services = availableServices(data);
  const filtered = services
    .filter(
      service =>
        normalize(
          `${service.company} ${service.title} ${service.category}`
        ).includes(normalize(query)) &&
        (!category || service.category === category) &&
        normalize(service.region).includes(normalize(region)) &&
        (!price ||
          (service.priceMode !== 'Sob orçamento' &&
            service.price <= Number(price))) &&
        (!attendance || service.attendance === attendance) &&
        (!favorites || data.serviceFavorites.includes(service.id))
    )
    .sort((a, b) =>
      sort === 'price' ? a.price - b.price : a.title.localeCompare(b.title)
    );
  const activeService =
    selected && services.find(item => item.id === selected.id);
  function open(service) {
    setSelected(service);
    setContact(false);
    const history = {
      id: crypto.randomUUID(),
      serviceId: service.id,
      title: service.title,
      date: new Date().toISOString(),
    };
    update({
      serviceHistory: [...data.serviceHistory, history],
      ads: data.ads.map(ad =>
        ad.id === service.id ? { ...ad, views: ad.views + 1 } : ad
      ),
    });
  }
  function request(event) {
    event.preventDefault();
    const message = new FormData(event.currentTarget).get('message').trim();
    if (!message) return;
    saveItem('contacts', {
      serviceId: selected.id,
      title: selected.title,
      company: selected.company,
      message,
      date: new Date().toISOString(),
    });
    setContact(false);
    notify(
      'Solicitação salva no histórico local. Nenhuma mensagem foi enviada ao profissional.'
    );
  }
  return (
    <Page
      title='Deu ruim? Tem quem faça.'
      eyebrow='EMPRESAS QUE CUIDAM DO SEU CANTO'
      description='Encontre ajuda, compare serviços e experimente uma solicitação de contato.'
    >
      <section className={styles.hero}>
        <div className={styles.stack}>
          <h2>Que cuidado sua casa precisa agora?</h2>
          <p className={styles.muted}>
            Profissionais e serviços para o seu dia a dia. Este catálogo reúne
            exemplos fictícios e anúncios publicados localmente.
          </p>
          <Button as={Link} to='/cadastro-empresa' color='laranja'>
            Quero divulgar meu serviço ↗
          </Button>
        </div>
        <img src={Illustration} alt='Pessoa consultando o celular' />
      </section>
      <Panel title='Encontre quem resolve.'>
        <div className={styles.filters}>
          <Field
            label='Serviço ou profissional'
            type='search'
            value={query}
            onChange={event => setQuery(event.target.value)}
            placeholder='Limpeza, reparos…'
          />
          <Field
            label='Localização'
            value={region}
            onChange={event => setRegion(event.target.value)}
            placeholder='Bairro ou cidade'
          />
          <Field
            label='Categoria'
            value={category}
            onChange={event => setCategory(event.target.value)}
          >
            <option value=''>Todas</option>
            {serviceCategories.map(value => (
              <option key={value}>{value}</option>
            ))}
          </Field>
          <Field
            label='Preço máximo (R$)'
            type='number'
            min='0'
            value={price}
            onChange={event => setPrice(event.target.value)}
          />
          <Field
            label='Tipo de atendimento'
            value={attendance}
            onChange={event => setAttendance(event.target.value)}
          >
            <option value=''>Todos</option>
            <option>Presencial</option>
            <option>Online</option>
          </Field>
          <Field
            label='Ordenar'
            value={sort}
            onChange={event => setSort(event.target.value)}
          >
            <option value='name'>Nome do serviço</option>
            <option value='price'>Menor preço informado</option>
          </Field>
        </div>
        <div className={styles.row}>
          <label className={styles.check}>
            <input
              type='checkbox'
              checked={favorites}
              onChange={event => setFavorites(event.target.checked)}
            />
            Só favoritos
          </label>
          <button
            className={styles.textButton}
            onClick={() => {
              setQuery('');
              setRegion('');
              setCategory('');
              setPrice('');
              setAttendance('');
              setFavorites(false);
            }}
          >
            Limpar filtros
          </button>
        </div>
        <small className={styles.muted}>
          O filtro de preço considera o valor inicial informado e exclui
          serviços sob orçamento.
        </small>
      </Panel>
      <p>{filtered.length} serviço(s) encontrado(s)</p>
      {filtered.length ? (
        <div className={styles.cards}>
          {filtered.map(service => (
            <ServiceCard
              key={service.id}
              service={service}
              favorite={data.serviceFavorites.includes(service.id)}
              onFavorite={() => toggle('serviceFavorites', service.id)}
              onOpen={() => open(service)}
            />
          ))}
        </div>
      ) : (
        <Empty
          title='Nenhum serviço com esses filtros.'
          description='Tente outra categoria, localização ou preço.'
        />
      )}
      <Panel title='Seu histórico de serviços'>
        <details>
          <summary className={styles.summary}>
            Serviços acessados · {data.serviceHistory.length}
          </summary>
          {data.serviceHistory.length ? (
            <ul className={styles.list}>
              {data.serviceHistory
                .slice()
                .reverse()
                .map(item => (
                  <li key={item.id}>
                    <div className={styles.row}>
                      <div>
                        <strong>{item.title}</strong>
                        <p className={styles.muted}>
                          {new Date(item.date).toLocaleString('pt-BR')}
                        </p>
                      </div>
                      {services.some(
                        service => service.id === item.serviceId
                      ) ? (
                        <button
                          className={styles.textButton}
                          onClick={() =>
                            open(
                              services.find(
                                service => service.id === item.serviceId
                              )
                            )
                          }
                        >
                          Reabrir
                        </button>
                      ) : (
                        <Badge>Anúncio indisponível</Badge>
                      )}
                    </div>
                  </li>
                ))}
            </ul>
          ) : (
            <p>Os serviços que você abrir aparecerão aqui.</p>
          )}
        </details>
        <details>
          <summary className={styles.summary}>
            Contatos simulados · {data.contacts.length}
          </summary>
          {data.contacts.length ? (
            <ul className={styles.list}>
              {data.contacts
                .slice()
                .reverse()
                .map(item => (
                  <li key={item.id}>
                    <strong>{item.title}</strong>
                    <p>{item.message}</p>
                    <small>
                      {new Date(item.date).toLocaleString('pt-BR')} · somente
                      local, sem envio
                    </small>
                  </li>
                ))}
            </ul>
          ) : (
            <p>Nenhuma solicitação demonstrativa realizada.</p>
          )}
        </details>
      </Panel>
      {activeService && (
        <Modal title={activeService.title} onClose={() => setSelected(null)}>
          <div className={styles.stack}>
            <img
              src={activeService.image}
              alt={`Imagem ilustrativa de ${activeService.title}`}
              className={styles.photo}
            />
            <Badge>
              {activeService.category} · {activeService.attendance}
            </Badge>
            <h3>{activeService.company}</h3>
            <p>{activeService.description}</p>
            <p>
              <strong>Região:</strong> {activeService.region}
            </p>
            <p>
              <strong>Disponibilidade:</strong> {activeService.availability}
            </p>
            <p>
              <strong>Preço:</strong>{' '}
              {activeService.priceMode === 'Sob orçamento'
                ? 'Sob orçamento'
                : `${activeService.priceMode} · ${money(activeService.price)}${activeService.maxPrice ? ` a ${money(activeService.maxPrice)}` : ''}`}
            </p>
            {activeService.images?.length > 1 && (
              <div className={styles.grid}>
                {activeService.images.slice(1).map((src, index) => (
                  <img
                    key={index}
                    src={src}
                    alt={`Portfólio local ${index + 2}`}
                    className={styles.photo}
                  />
                ))}
              </div>
            )}
            {activeService.companyProfile && (
              <details>
                <summary className={styles.summary}>
                  Conhecer o anunciante
                </summary>
                <CompanyPreview company={activeService.companyProfile} />
              </details>
            )}
            <Panel title='Avaliações demonstrativas'>
              {activeService.reviews.length ? (
                <>
                  <p>★ {activeService.rating} · comentários fictícios</p>
                  {activeService.reviews.map(review => (
                    <p key={review}>“{review}”</p>
                  ))}
                </>
              ) : (
                <p>Este anúncio local ainda não tem avaliações.</p>
              )}
            </Panel>
            <p className={styles.info}>
              Demonstração: {activeService.contact || 'contato não informado'}.
              Nenhuma solicitação é enviada para fora deste navegador.
            </p>
            {contact ? (
              <form className={styles.form} onSubmit={request}>
                <Field
                  label='Sua mensagem de exemplo'
                  name='message'
                  multiline
                  maxLength={1000}
                  required
                  placeholder='Descreva o serviço que você precisa…'
                />
                <Button color='laranja'>Salvar solicitação simulada</Button>
              </form>
            ) : (
              <Button color='laranja' onClick={() => setContact(true)}>
                Simular solicitação de contato
              </Button>
            )}
          </div>
        </Modal>
      )}
    </Page>
  );
}
