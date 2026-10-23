import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui';
import {
  Page,
  Panel,
  Field,
  Progress,
  Stat,
  Badge,
} from '../components/App/ui';
import { journeySteps } from '../data/catalog';
import { useAppStore } from '../store/useAppStore';
import { journeyProgress } from '../utils/progress';
import { financialProjection, dateLabel, money } from '../utils/format';
import styles from '../styles/app.module.css';

export default function MinhaJornada() {
  const { journey, journeyGoal, journeyCurrent, plan } = useAppStore(
    state => state.data
  );
  const { update, notify } = useAppStore();
  const [filter, setFilter] = useState('Todas');
  const progress = journeyProgress(journey);
  const financial = financialProjection(plan);
  const next = journeySteps.find(step =>
    step.items.some((_, i) => !journey[`${step.id}-${i}`])
  );
  const current = journeyCurrent || next?.id;
  return (
    <Page
      title='Minha jornada'
      eyebrow='ANTES DAS CHAVES'
      description='Cada pequeno passo conta para conquistar seu canto.'
    >
      <Panel title={journeyGoal.title} className={styles.tinted}>
        <Progress
          value={progress.percent}
          label={`${progress.done} de ${progress.total} atividades concluídas`}
        />
        <p>
          {journeyGoal.date
            ? `Sua data desejada: ${dateLabel(journeyGoal.date)}`
            : 'Seu caminho tem o seu tempo. Defina uma data se quiser.'}
        </p>
        {next ? (
          <Button
            color='laranja'
            onClick={() => {
              setFilter('Todas');
              update({ journeyCurrent: next.id });
              requestAnimationFrame(() =>
                document
                  .getElementById(`etapa-${next.id}`)
                  ?.scrollIntoView({ behavior: 'smooth' })
              );
            }}
          >
            Retomar: {next.title} ↗
          </Button>
        ) : (
          <p>
            Você concluiu o checklist de preparação. Pode revisar suas etapas a
            qualquer momento.
          </p>
        )}
      </Panel>
      <div className={styles.grid}>
        <Panel title='Sua meta pessoal'>
          <form
            className={styles.form}
            onSubmit={event => {
              event.preventDefault();
              const values = Object.fromEntries(
                new FormData(event.currentTarget)
              );
              if (!values.title.trim()) return;
              update({
                journeyGoal: { title: values.title.trim(), date: values.date },
              });
              notify('Meta pessoal salva.');
            }}
          >
            <Field
              label='O que você quer conquistar?'
              name='title'
              defaultValue={journeyGoal.title}
              maxLength={100}
              required
            />
            <Field
              label='Data desejada (opcional)'
              name='date'
              type='date'
              defaultValue={journeyGoal.date}
            />
            <Button color='azul'>Salvar meta</Button>
          </form>
        </Panel>
        <Panel title='Sua preparação financeira'>
          <Stat
            label='Reservado'
            value={money(plan.savings)}
            detail={`Meta: ${money(financial.target)}`}
          />
          <Progress
            value={
              financial.target ? (plan.savings / financial.target) * 100 : 100
            }
            label='Meta da mudança'
          />
          <p>
            Faltam {money(financial.missing)} · {money(financial.monthlySaving)}{' '}
            por mês no prazo informado.
          </p>
          <Button as={Link} to='/financas' color='azul'>
            Ajustar meu plano financeiro
          </Button>
        </Panel>
      </div>
      <div className={styles.tabs} aria-label='Filtrar etapas'>
        {['Todas', 'Financeira', 'Documental', 'Prática', 'Pendentes'].map(
          value => (
            <button
              key={value}
              aria-pressed={filter === value}
              onClick={() => setFilter(value)}
            >
              {value}
            </button>
          )
        )}
      </div>
      <div className={styles.stack}>
        {journeySteps
          .filter(
            step =>
              filter === 'Todas' ||
              filter === step.category ||
              (filter === 'Pendentes' &&
                step.items.some((_, i) => !journey[`${step.id}-${i}`]))
          )
          .map(step => {
            const count = step.items.filter(
              (_, i) => journey[`${step.id}-${i}`]
            ).length;
            return (
              <Panel
                key={step.id}
                title={`${journeySteps.findIndex(item => item.id === step.id) + 1}. ${step.title}`}
              >
                <div id={`etapa-${step.id}`} className={styles.row}>
                  <Badge>
                    {step.category} ·{' '}
                    {count === step.items.length
                      ? 'Concluída'
                      : count
                        ? 'Em andamento'
                        : 'A começar'}
                  </Badge>
                  <span>
                    {count}/{step.items.length}
                  </span>
                </div>
                <details
                  open={current === step.id}
                  onToggle={event => {
                    if (event.currentTarget.open && current !== step.id)
                      update({ journeyCurrent: step.id });
                  }}
                >
                  <summary className={styles.summary}>
                    Checklist da etapa
                  </summary>
                  <div className={styles.stack}>
                    {step.items.map((item, i) => (
                      <label className={styles.check} key={item}>
                        <input
                          type='checkbox'
                          checked={Boolean(journey[`${step.id}-${i}`])}
                          onChange={event => {
                            update({
                              journey: {
                                ...journey,
                                [`${step.id}-${i}`]: event.target.checked,
                              },
                              journeyCurrent: step.id,
                            });
                            notify(
                              event.target.checked
                                ? 'Um passo a mais! Progresso atualizado.'
                                : 'Atividade reaberta.'
                            );
                          }}
                        />
                        <span>{item}</span>
                      </label>
                    ))}
                    <Button as={Link} to={step.to} color='azul'>
                      Abrir módulo relacionado ↗
                    </Button>
                  </div>
                </details>
              </Panel>
            );
          })}
      </div>
      <p className={styles.muted}>
        Os checklists são marcados por você. O progresso financeiro usa os
        valores salvos no simulador.
      </p>
    </Page>
  );
}
