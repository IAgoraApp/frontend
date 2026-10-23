import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, CaixaAnimada } from '../components/ui';
import {
  Page,
  Panel,
  Stat,
  Field,
  Badge,
  Empty,
  Confirm,
} from '../components/App/ui';
import { useAppStore } from '../store/useAppStore';
import { adStatuses } from '../data/demo';
import { normalize, money } from '../utils/format';
import styles from '../styles/app.module.css';

export default function Dashboard() {
  const { ads, company, contacts } = useAppStore(state => state.data);
  const { saveItem, removeItem, notify } = useAppStore();
  const [status, setStatus] = useState('');
  const [query, setQuery] = useState('');
  const [deleting, setDeleting] = useState(null);
  const filtered = ads.filter(
    ad =>
      (!status || ad.status === status) &&
      normalize(ad.title).includes(normalize(query))
  );
  const requests = contacts.filter(contact =>
    ads.some(ad => ad.id === contact.serviceId)
  );
  function changeStatus(ad, value) {
    saveItem('ads', { ...ad, status: value });
    notify(`Anúncio ${value.toLowerCase()} na demonstração local.`);
  }
  return (
    <Page
      title='Seu trabalho. Faz acontecer.'
      eyebrow='PAINEL DA EMPRESA'
      description={`Seu espaço para gerenciar os serviços de ${company.name}.`}
      action={
        <Button as={Link} to='/meus-servicos' color='laranja'>
          + Anunciar serviço
        </Button>
      }
    >
      <section className={styles.hero}>
        <div className={styles.stack}>
          <h2>Seu próximo serviço começa com uma boa apresentação.</h2>
          <p>
            Anúncios ativos aparecem no Marketplace deste navegador. Publicações
            externas e métricas de uma operação real dependem de backend.
          </p>
          <Button as={Link} to='/perfil-empresa' color='azul'>
            Editar meu perfil comercial ↗
          </Button>
        </div>
        <div className='hidden lg:flex justify-center'>
          <CaixaAnimada />
        </div>
      </section>
      <div className={styles.stats}>
        <Stat label='Anúncios cadastrados' value={ads.length} />
        <Stat
          label='Ativos no catálogo local'
          value={ads.filter(ad => ad.status === 'Ativo').length}
        />
        <Stat
          label='Visualizações locais'
          value={ads.reduce((sum, ad) => sum + ad.views, 0)}
          detail='Aberturas do anúncio no Marketplace'
        />
        <Stat
          label='Solicitações demonstrativas'
          value={requests.length}
          detail='Nenhuma mensagem externa enviada'
        />
      </div>
      <Panel title='O que sua empresa oferece.'>
        <div className={styles.filters}>
          <Field
            label='Pesquisar anúncio'
            type='search'
            value={query}
            onChange={event => setQuery(event.target.value)}
          />
          <Field
            label='Status do anúncio'
            value={status}
            onChange={event => setStatus(event.target.value)}
          >
            <option value=''>Todos</option>
            {adStatuses.map(value => (
              <option key={value}>{value}</option>
            ))}
          </Field>
        </div>
        {filtered.length ? (
          <ul className={styles.list}>
            {filtered.map(ad => (
              <li key={ad.id}>
                <div className={styles.stack}>
                  <div className={styles.row}>
                    <div>
                      <h3>{ad.title}</h3>
                      <p className={styles.muted}>
                        {ad.category} · {ad.region} ·{' '}
                        {ad.priceMode === 'Sob orçamento'
                          ? 'Sob orçamento'
                          : money(ad.price)}
                      </p>
                    </div>
                    <Badge>{ad.status}</Badge>
                  </div>
                  <div className={styles.row}>
                    <p>
                      {ad.views} visualização(ões) ·{' '}
                      {requests.filter(item => item.serviceId === ad.id).length}{' '}
                      contato(s) simulado(s)
                    </p>
                    <div className={styles.actions}>
                      <Button
                        as={Link}
                        to={`/meus-servicos?editar=${ad.id}`}
                        color='azul'
                      >
                        Editar anúncio
                      </Button>
                      {ad.status === 'Ativo' ? (
                        <button
                          className={styles.textButton}
                          onClick={() => changeStatus(ad, 'Pausado')}
                        >
                          Pausar
                        </button>
                      ) : (
                        <button
                          className={styles.textButton}
                          onClick={() =>
                            ad.contact
                              ? changeStatus(ad, 'Ativo')
                              : notify(
                                  'Complete o contato na edição antes de ativar o anúncio.'
                                )
                          }
                        >
                          Ativar localmente
                        </button>
                      )}
                      <button
                        className={styles.textButton}
                        onClick={() => setDeleting(ad)}
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                  <details>
                    <summary className={styles.summary}>
                      Experimentar estados do anúncio
                    </summary>
                    <Field
                      label='Status demonstrativo (não há moderação real)'
                      value={ad.status}
                      onChange={event => {
                        const value = event.target.value;
                        if (value === 'Ativo' && !ad.contact) {
                          notify(
                            'Informe o contato do serviço antes de ativar.'
                          );
                          return;
                        }
                        changeStatus(ad, value);
                      }}
                    >
                      {adStatuses.map(value => (
                        <option key={value}>{value}</option>
                      ))}
                    </Field>
                  </details>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <Empty
            title='Nenhum anúncio neste filtro.'
            description='Crie um novo serviço ou ajuste a pesquisa.'
          >
            <Button as={Link} to='/meus-servicos' color='laranja'>
              Criar anúncio
            </Button>
          </Empty>
        )}
      </Panel>
      <Panel title='Solicitações registradas na demonstração'>
        {requests.length ? (
          <ul className={styles.list}>
            {requests
              .slice()
              .reverse()
              .map(item => (
                <li key={item.id}>
                  <h3>{item.title}</h3>
                  <p>{item.message}</p>
                  <small>
                    {new Date(item.date).toLocaleString('pt-BR')} · contato
                    somente local
                  </small>
                </li>
              ))}
          </ul>
        ) : (
          <Empty
            title='Nenhuma solicitação local por enquanto.'
            description='Abra um anúncio ativo no Marketplace e simule um contato para experimentar este indicador.'
          />
        )}
      </Panel>
      {deleting && (
        <Confirm
          title={`Excluir “${deleting.title}”?`}
          description='O anúncio sairá do Dashboard e do Marketplace local. Os registros de contatos no histórico do visitante serão mantidos.'
          onClose={() => setDeleting(null)}
          onConfirm={() => {
            removeItem('ads', deleting.id);
            notify('Anúncio excluído.');
          }}
        />
      )}
    </Page>
  );
}
