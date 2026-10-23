import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui';
import {
  Page,
  Panel,
  Field,
  Stat,
  Progress,
  Modal,
  Confirm,
  Empty,
} from '../App/ui';
import { planFields } from '../../data/finance';
import { useAppStore } from '../../store/useAppStore';
import { financialProjection, money } from '../../utils/format';
import styles from '../../styles/app.module.css';

export default function MovingPlan() {
  const { plan, scenarios } = useAppStore(state => state.data);
  const { update, saveItem, removeItem, notify } = useAppStore();
  const [draft, setDraft] = useState(plan);
  const [naming, setNaming] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [tutorial, setTutorial] = useState(false);
  const result = financialProjection(draft);
  const changed = JSON.stringify(draft) !== JSON.stringify(plan);
  const surplus = Math.max(0, result.available);
  const points = [
    0,
    Math.ceil(draft.months / 3),
    Math.ceil((draft.months * 2) / 3),
    draft.months,
  ];
  function save() {
    update({ plan: draft });
    notify('Simulação e meta salvas. Home e Minha jornada foram atualizadas.');
  }
  return (
    <Page
      title='Sua mudança. No seu plano.'
      eyebrow='ANTES DAS CHAVES · SEU PLANO FINANCEIRO'
      description='Descubra quanto precisa para chegar e como manter seu novo canto.'
      action={
        <Button color='azul' onClick={() => setTutorial(true)}>
          Como usar o simulador
        </Button>
      }
    >
      <p className={styles.info}>
        Simulação educativa com valores editáveis. Os resultados usam somente os
        números que você informar, sem consultar bancos ou preços de mercado.
      </p>
      <div className={styles.grid}>
        <Panel title='Vamos colocar no papel.'>
          <form
            className={styles.form}
            onSubmit={event => {
              event.preventDefault();
              save();
            }}
          >
            {planFields.map(group => (
              <fieldset key={group.title} className={styles.stack}>
                <legend className='font-heading font-bold mb-4'>
                  {group.title}
                </legend>
                <div className={styles.formGrid}>
                  {group.fields.map(([key, label]) => (
                    <Field
                      key={key}
                      label={label}
                      type='number'
                      value={draft[key] ?? 0}
                      min={key === 'months' ? 1 : 0}
                      max={
                        ['months', 'reserveMonths'].includes(key)
                          ? 120
                          : key === 'deposit'
                            ? 12
                            : 100000000
                      }
                      step={
                        ['months', 'reserveMonths', 'deposit'].includes(key)
                          ? 1
                          : '0.01'
                      }
                      required
                      onChange={event =>
                        setDraft(current => ({
                          ...current,
                          [key]: Number(event.target.value),
                        }))
                      }
                    />
                  ))}
                </div>
              </fieldset>
            ))}
            <Button color='laranja'>Salvar simulação e meta</Button>
          </form>
        </Panel>
        <div className={styles.stack}>
          <Panel title='O seu plano em números.' className={styles.tinted}>
            <div className={styles.stats}>
              <Stat
                label='Custo inicial'
                value={money(result.initial)}
                detail='Caução + mudança + móveis'
              />
              <Stat label='Despesas mensais' value={money(result.monthly)} />
              <Stat
                label='Meta total'
                value={money(result.target)}
                detail={`Custos iniciais + ${draft.reserveMonths} mês(es) de reserva`}
              />
              <Stat
                label='Guardar por mês'
                value={money(result.monthlySaving)}
                detail={`Para mudar em ${draft.months} mês(es)`}
              />
            </div>
            <Progress
              value={
                result.target ? (draft.savings / result.target) * 100 : 100
              }
              label='Progresso da sua meta'
            />
            <p>
              Faltam <strong>{money(result.missing)}</strong> para o objetivo.
              Sua renda menos as despesas mensais estimadas resulta em{' '}
              <strong>{money(result.available)}</strong>.
            </p>
            {result.available < 0 ? (
              <p className={styles.error} role='status'>
                Neste cenário, as despesas superam sua renda. Ajuste os valores
                e compare alternativas.
              </p>
            ) : result.monthlySaving > result.available ? (
              <p className={styles.info}>
                O valor mensal necessário é maior que a sobra estimada.
                Experimente ampliar o prazo ou reduzir custos.
              </p>
            ) : (
              <p className={styles.muted}>
                O valor mensal necessário cabe na sobra estimada deste cenário.
              </p>
            )}
            {changed && (
              <p role='status' className={styles.muted}>
                Prévia com alterações ainda não salvas.
              </p>
            )}
          </Panel>
          <Panel title='Compare possibilidades.'>
            <p className={styles.muted}>
              Salve cenários com diferentes aluguéis, custos e prazos. Carregar
              um cenário abre uma prévia; salve para usá-lo na sua jornada.
            </p>
            <Button color='azul' onClick={() => setNaming(true)}>
              Salvar cenário com nome
            </Button>
            {scenarios.length ? (
              <ul className={styles.list}>
                {scenarios.map(item => (
                  <li key={item.id}>
                    <div className={styles.row}>
                      <div>
                        <strong>{item.name}</strong>
                        <p>
                          {money(financialProjection(item.plan).monthly)}/mês ·
                          meta {money(financialProjection(item.plan).target)}
                        </p>
                      </div>
                      <div className={styles.actions}>
                        <button
                          className={styles.textButton}
                          onClick={() => {
                            setDraft(item.plan);
                            notify('Cenário carregado para comparação.');
                          }}
                        >
                          Carregar
                        </button>
                        <button
                          className={styles.textButton}
                          onClick={() => setDeleting(item)}
                        >
                          Excluir
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <Empty
                title='Seu primeiro cenário está na tela.'
                description='Salve com um nome para comparar com outras possibilidades.'
              />
            )}
          </Panel>
        </div>
      </div>
      <Panel
        title='Sua economia ao longo do tempo.'
        description='Projeção ilustrativa sem juros, considerando a economia atual e o valor mensal necessário para sua meta.'
      >
        <div className={styles.chart}>
          {points.map((point, index) => {
            const value = draft.savings + result.monthlySaving * point;
            return (
              <div key={index}>
                <div className={styles.row}>
                  <span>Mês {point}</span>
                  <strong>{money(value)}</strong>
                </div>
                <div className={styles.bar}>
                  <span
                    style={{
                      width: `${result.target ? Math.min(100, (value / result.target) * 100) : 100}%`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
        <p className={styles.muted}>
          Se você guardar a sobra estimada de {money(surplus)}/mês, terá{' '}
          {money(draft.savings + surplus * draft.months)} ao fim do prazo, antes
          de eventuais despesas não informadas.
        </p>
        <div className={styles.actions}>
          <Button as={Link} to='/encontrar-casa' color='azul'>
            Encontrar uma casa para este plano ↗
          </Button>
          <Button as={Link} to='/minhajornada' color='laranja'>
            Ver minha jornada ↗
          </Button>
        </div>
      </Panel>
      {naming && (
        <Modal title='Dar nome ao cenário' onClose={() => setNaming(false)}>
          <form
            className={styles.form}
            onSubmit={event => {
              event.preventDefault();
              const name = new FormData(event.currentTarget).get('name').trim();
              if (!name) return;
              saveItem('scenarios', { name, plan: { ...draft } });
              setNaming(false);
              notify('Cenário salvo para comparar.');
            }}
          >
            <Field
              label='Nome'
              name='name'
              placeholder='Ex.: Studio no centro'
              maxLength={80}
              required
              autoFocus
            />
            <Button color='laranja'>Salvar cenário</Button>
          </form>
        </Modal>
      )}
      {deleting && (
        <Confirm
          onClose={() => setDeleting(null)}
          onConfirm={() => {
            removeItem('scenarios', deleting.id);
            notify('Cenário excluído.');
          }}
        />
      )}
      {tutorial && (
        <Modal
          title='Seu plano em três passos.'
          onClose={() => setTutorial(false)}
        >
          <div className={styles.stack}>
            <ol className='list-decimal pl-5 space-y-4'>
              <li>Informe sua renda e o dinheiro já reservado.</li>
              <li>Preencha os custos iniciais e as despesas de cada mês.</li>
              <li>
                Escolha quantos meses de reserva deseja e o prazo para mudar.
                Salve para atualizar sua meta na Home e na jornada.
              </li>
            </ol>
            <p>
              O simulador calcula: caução + mudança + móveis + reserva mensal. O
              valor que falta é dividido pelo prazo escolhido.
            </p>
            <Button onClick={() => setTutorial(false)}>
              Começar meu plano
            </Button>
          </div>
        </Modal>
      )}
    </Page>
  );
}
