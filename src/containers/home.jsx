import { Link } from 'react-router-dom';
import { Button } from '../components/ui';
import { Sections } from '../components/Home';
import HouseholdLayout from '../components/Household/layout';
import { Panel, Stat, Progress, Empty, Badge } from '../components/App/ui';
import { useAppStore } from '../store/useAppStore';
import { journeyProgress } from '../utils/progress';
import { financialProjection, money, today } from '../utils/format';
import { journeySteps, lessons } from '../data/catalog';
import styles from '../styles/app.module.css';

export default function Home() {
  const data = useAppStore(state => state.data);
  const { update } = useAppStore();
  const {
    profile,
    person,
    tasks,
    completions,
    ads,
    journey,
    journeyGoal,
    plan,
    transactions,
    dismissedNotifications,
  } = data;
  const progress = journeyProgress(journey);
  const financial = financialProjection(plan);
  const nextStep = journeySteps.find(step =>
    step.items.some((_, index) => !journey[`${step.id}-${index}`])
  );
  const nextLesson = lessons.find(lesson => !data.lessons.includes(lesson.id));
  const notifications =
    profile === 'morando'
      ? [
          ...tasks
            .filter(task => !task.done && task.reminder && task.date <= today())
            .map(task => ({
              id: `task-${task.id}-${task.date}`,
              text: `${task.title} · ${task.time}`,
              to: '/rotina',
            })),
          ...transactions
            .filter(
              item =>
                item.type === 'expense' && !item.paid && item.date <= today()
            )
            .map(item => ({
              id: `bill-${item.id}`,
              text: `${item.title}: ${money(item.amount)} pendente`,
              to: '/financas',
            })),
        ]
      : profile === 'planejando'
        ? [
            ...(nextStep
              ? [
                  {
                    id: `journey-${nextStep.id}`,
                    text: `Próxima etapa: ${nextStep.title}`,
                    to: '/minhajornada',
                  },
                ]
              : []),
            {
              id: `goal-${journeyGoal.title}-${journeyGoal.date}`,
              text: `${journeyGoal.title}${journeyGoal.date ? ` · até ${journeyGoal.date.split('-').reverse().join('/')}` : ' · escolha seu prazo'}`,
              to: '/minhajornada',
            },
          ]
        : ads
            .filter(ad => ad.status !== 'Ativo')
            .map(ad => ({
              id: `ad-${ad.id}-${ad.status}`,
              text: `${ad.title} · ${ad.status}`,
              to: '/dashboard',
            }));
  const visibleNotifications = notifications.filter(
    item => !dismissedNotifications.includes(item.id)
  );
  return (
    <HouseholdLayout title='Início' className={styles.app}>
      <Sections.TittleSection />
      <p className={styles.info}>
        Você está na demonstração do Iagora. Seus registros ficam neste
        navegador; contatos, integrações e publicações externas não são
        realizados.
      </p>
      <Sections.NavSection />
      {profile === 'morando' && (
        <>
          <div className={styles.stats}>
            <Stat
              label='Tarefas pendentes'
              value={tasks.filter(task => !task.done).length}
            />
            <Stat label='Atividades concluídas' value={completions.length} />
            <Stat label='Refeições planejadas' value={data.mealPlan.length} />
            <Stat
              label='Manutenções pendentes'
              value={data.maintenance.filter(item => !item.done).length}
            />
          </div>
          <div className={styles.grid}>
            <Sections.RotinaSection />
            <div className={styles.panel}>
              <Sections.CozinhaSection />
            </div>
          </div>
        </>
      )}
      {profile === 'planejando' && (
        <>
          <Panel
            title='Seu primeiro canto está no caminho.'
            className={styles.tinted}
          >
            <Progress
              value={progress.percent}
              label={`${progress.done} de ${progress.total} passos de preparação`}
            />
            <p>
              Próxima etapa:{' '}
              {nextStep?.title || 'Checklist de preparação concluído!'}
            </p>
            <Button as={Link} to='/minhajornada' color='laranja'>
              Retomar minha jornada ↗
            </Button>
          </Panel>
          <div className={styles.stats}>
            <Stat
              label='Reservado para a mudança'
              value={money(plan.savings)}
            />
            <Stat label='Meta da mudança' value={money(financial.target)} />
            <Stat
              label='Guardar por mês'
              value={money(financial.monthlySaving)}
            />
            <Stat
              label='Atividades aprendidas'
              value={`${data.lessons.length}/${lessons.length}`}
            />
          </div>
          <Panel title='Uma habilidade para o próximo passo.'>
            <p>
              {nextLesson?.title ||
                'Você concluiu todos os guias. Continue revisando o que aprendeu.'}
            </p>
            <Button as={Link} to='/aprendendo' color='azul'>
              Aprendendo a morar ↗
            </Button>
          </Panel>
        </>
      )}
      {profile === 'anunciante' && (
        <>
          <div className={styles.stats}>
            <Stat label='Anúncios cadastrados' value={ads.length} />
            <Stat
              label='Anúncios ativos'
              value={ads.filter(ad => ad.status === 'Ativo').length}
            />
            <Stat
              label='Visualizações locais'
              value={ads.reduce((sum, ad) => sum + ad.views, 0)}
              detail='Aberturas feitas nesta demonstração'
            />
            <Stat
              label='Contatos simulados'
              value={
                data.contacts.filter(contact =>
                  ads.some(ad => ad.id === contact.serviceId)
                ).length
              }
            />
          </div>
          <Panel title='Seu trabalho. Faz acontecer.' className={styles.tinted}>
            <p>
              {data.company.name}, mantenha seus serviços e contatos em dia para
              apresentar bem o seu negócio.
            </p>
            <div className={styles.actions}>
              <Button as={Link} to='/meus-servicos' color='laranja'>
                + Anunciar serviço
              </Button>
              <Button as={Link} to='/perfil-empresa' color='azul'>
                Editar perfil comercial
              </Button>
            </div>
            <ul className={styles.list}>
              {ads.slice(0, 4).map(ad => (
                <li key={ad.id} className={styles.row}>
                  <strong>{ad.title}</strong>
                  <Badge>{ad.status}</Badge>
                </li>
              ))}
            </ul>
          </Panel>
        </>
      )}
      {person.notifications && (
        <Panel title='Lembretes e avisos locais'>
          {visibleNotifications.length ? (
            <ul className={styles.list}>
              {visibleNotifications.map(item => (
                <li key={item.id} className={styles.row}>
                  <Link className={styles.textButton} to={item.to}>
                    {item.text}
                  </Link>
                  <button
                    className={styles.textButton}
                    onClick={() =>
                      update({
                        dismissedNotifications: [
                          ...dismissedNotifications,
                          item.id,
                        ],
                      })
                    }
                  >
                    Dispensar
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <Empty
              title='Nenhum aviso por enquanto.'
              description='Seus próximos lembretes aparecerão aqui.'
            />
          )}
        </Panel>
      )}
      {person.suggestions && (
        <Panel title='Uma ideia para o seu agora.' className={styles.dark}>
          <Badge>Sugestão demonstrativa</Badge>
          <p>
            {profile === 'morando'
              ? 'Confira o que tem na geladeira e planeje duas refeições antes de ir ao mercado.'
              : profile === 'planejando'
                ? 'Compare o custo total da moradia com o seu orçamento, incluindo taxas e contas.'
                : 'Uma descrição clara sobre escopo, região e horários ajuda a apresentar seu serviço.'}
          </p>
          <Button
            as={Link}
            to={
              profile === 'morando'
                ? '/cozinha'
                : profile === 'planejando'
                  ? '/encontrar-casa'
                  : '/meus-servicos'
            }
            color='laranja'
          >
            Dar esse próximo passo ↗
          </Button>
        </Panel>
      )}
    </HouseholdLayout>
  );
}
