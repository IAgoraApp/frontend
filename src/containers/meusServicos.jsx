import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui';
import {
  Page,
  Panel,
  Field,
  ImageInput,
  Empty,
  Badge,
} from '../components/App/ui';
import ServiceCard from '../components/App/serviceCard';
import { useAppStore } from '../store/useAppStore';
import { serviceCategories } from '../data/demo';
import fallbackImage from '../assets/images/services.png';
import styles from '../styles/app.module.css';

function AdEditor({ ad }) {
  const company = useAppStore(state => state.data.company);
  const { saveItem, notify } = useAppStore();
  const navigate = useNavigate();
  const [draft, setDraft] = useState(
    ad || {
      title: '',
      category: 'Limpeza',
      description: '',
      region: company.region,
      priceMode: 'A partir de',
      price: '',
      maxPrice: '',
      contact: company.phone || company.email,
      availability: company.hours,
      attendance: 'Presencial',
      images: [],
      status: 'Rascunho',
      views: 0,
    }
  );
  const [error, setError] = useState('');
  function change(key, value) {
    setDraft(current => ({ ...current, [key]: value }));
  }
  function save(status) {
    if (!draft.title.trim()) {
      setError('Informe um título para salvar seu anúncio.');
      return;
    }
    if (
      status !== 'Rascunho' &&
      (!draft.description.trim() ||
        !draft.region.trim() ||
        !draft.contact.trim() ||
        !draft.availability.trim())
    ) {
      setError(
        'Complete descrição, região, contato e disponibilidade para publicar.'
      );
      return;
    }
    if (
      draft.priceMode !== 'Sob orçamento' &&
      status !== 'Rascunho' &&
      Number(draft.price) <= 0
    ) {
      setError('Informe um preço maior que zero ou escolha “Sob orçamento”.');
      return;
    }
    if (
      draft.priceMode === 'Faixa de preço' &&
      Number(draft.maxPrice) < Number(draft.price)
    ) {
      setError('O preço máximo deve ser maior ou igual ao inicial.');
      return;
    }
    saveItem('ads', {
      ...draft,
      title: draft.title.trim(),
      description: draft.description.trim(),
      price: Number(draft.price),
      maxPrice:
        draft.priceMode === 'Faixa de preço' ? Number(draft.maxPrice) : 0,
      status,
    });
    notify(
      status === 'Ativo'
        ? 'Serviço publicado no Marketplace deste navegador.'
        : status === 'Rascunho'
          ? 'Rascunho salvo localmente.'
          : 'Anúncio salvo em análise demonstrativa, sem moderação externa.'
    );
    navigate('/dashboard');
  }
  return (
    <div className={styles.grid}>
      <Panel title='Conte o que você faz bem.'>
        <form
          className={styles.form}
          onSubmit={event => {
            event.preventDefault();
            save('Ativo');
          }}
        >
          <Badge>Status atual: {draft.status}</Badge>
          <Field
            label='Título do anúncio'
            value={draft.title}
            onChange={event => change('title', event.target.value)}
            maxLength={100}
            required
          />
          <Field
            label='Categoria'
            value={draft.category}
            onChange={event => change('category', event.target.value)}
          >
            {serviceCategories.map(value => (
              <option key={value}>{value}</option>
            ))}
          </Field>
          <Field
            label='Descrição detalhada'
            multiline
            value={draft.description}
            onChange={event => change('description', event.target.value)}
            maxLength={1800}
            required
            placeholder='O que está incluído e como funciona o atendimento?'
          />
          <div className={styles.formGrid}>
            <Field
              label='Região atendida'
              value={draft.region}
              onChange={event => change('region', event.target.value)}
              maxLength={120}
              required
            />
            <Field
              label='Atendimento'
              value={draft.attendance}
              onChange={event => change('attendance', event.target.value)}
            >
              <option>Presencial</option>
              <option>Online</option>
            </Field>
          </div>
          <Field
            label='Como informar o valor'
            value={draft.priceMode}
            onChange={event => change('priceMode', event.target.value)}
          >
            {[
              'A partir de',
              'Preço fixo',
              'Faixa de preço',
              'Sob orçamento',
            ].map(value => (
              <option key={value}>{value}</option>
            ))}
          </Field>
          {draft.priceMode !== 'Sob orçamento' && (
            <div className={styles.formGrid}>
              <Field
                label='Preço inicial (R$)'
                type='number'
                value={draft.price}
                onChange={event => change('price', event.target.value)}
                min='0.01'
                max='10000000'
                step='0.01'
                required
              />
              {draft.priceMode === 'Faixa de preço' && (
                <Field
                  label='Preço máximo (R$)'
                  type='number'
                  value={draft.maxPrice}
                  onChange={event => change('maxPrice', event.target.value)}
                  min={draft.price || '0.01'}
                  max='10000000'
                  step='0.01'
                  required
                />
              )}
            </div>
          )}
          <Field
            label='Contato (telefone, e-mail ou canal)'
            value={draft.contact}
            onChange={event => change('contact', event.target.value)}
            maxLength={120}
            required
          />
          <Field
            label='Disponibilidade e horários'
            value={draft.availability}
            onChange={event => change('availability', event.target.value)}
            maxLength={200}
            required
          />
          <details>
            <summary className={styles.summary}>
              Adicionar imagens locais (até 3)
            </summary>
            <div className={styles.stack}>
              {[0, 1, 2].map(index => (
                <ImageInput
                  key={index}
                  label={`Foto ${index + 1}`}
                  value={draft.images[index] || ''}
                  onChange={value => {
                    const next = [...draft.images];
                    next[index] = value;
                    change('images', next.filter(Boolean));
                  }}
                />
              ))}
            </div>
          </details>
          {error && (
            <p role='alert' className={styles.error}>
              {error}
            </p>
          )}
          <div className={styles.actions}>
            <Button color='laranja'>Publicar localmente</Button>
            <Button color='azul' type='button' onClick={() => save('Rascunho')}>
              Salvar rascunho
            </Button>
            <button
              className={styles.textButton}
              type='button'
              onClick={() => save('Em análise')}
            >
              Simular análise
            </button>
          </div>
          <Button as={Link} to='/dashboard' color='preto'>
            Voltar ao Dashboard
          </Button>
        </form>
      </Panel>
      <div className={styles.stack}>
        <Panel
          title='Como seu anúncio aparece.'
          description='Prévia atualizada enquanto você preenche.'
          className={styles.white}
        >
          <ServiceCard
            service={{
              ...draft,
              title: draft.title || 'Título do seu serviço',
              company: company.name,
              description: draft.description || 'Sua descrição aparece aqui.',
              image: draft.images[0] || company.image || fallbackImage,
            }}
          />
        </Panel>
        <p className={styles.info}>
          Publicação demonstrativa: este anúncio ficará visível somente no
          catálogo deste navegador. Nenhum serviço externo, cobrança ou análise
          real é acionado.
        </p>
        <Button as={Link} to='/perfil-empresa' color='azul'>
          Editar dados do anunciante
        </Button>
      </div>
    </div>
  );
}

export default function MeusServicos() {
  const [params] = useSearchParams();
  const ads = useAppStore(state => state.data.ads);
  const id = params.get('editar');
  const ad = ads.find(item => item.id === id);
  return (
    <Page
      title={
        id
          ? 'Ajuste os detalhes. Seu trabalho aparece.'
          : 'Você faz bem. Conta pra geral.'
      }
      eyebrow='ANUNCIAR SERVIÇO'
      description='Uma apresentação clara começa uma boa conversa.'
    >
      {id && !ad ? (
        <Empty
          title='Anúncio não encontrado.'
          description='Ele pode ter sido excluído neste navegador.'
        >
          <Button as={Link} to='/dashboard'>
            Voltar ao Dashboard
          </Button>
        </Empty>
      ) : (
        <AdEditor key={id || 'new'} ad={ad} />
      )}
    </Page>
  );
}
