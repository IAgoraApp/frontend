import { Title } from '../../../shared/ui';
import { quickActions } from '../content';
import Robot from '../assets/robot.png';
import {
  ChecklistArtwork,
  Ribbon,
  RoutineButton,
  RoutineIcon,
} from './routineUi';
import TaskRow from './taskRow';
import { useUpcomingCapacity } from '../hooks/useUpcomingCapacity';
import classes from '../routineClasses';

export default function RoutineOverview({
  upcoming,
  onAction,
  onOpen,
  onComplete,
}) {
  const { ref, capacity } = useUpcomingCapacity(upcoming.length);
  return (
    <div className={classes.overview}>
      <div className={classes.intro}>
        <div className={classes.headingCopy}>
          <Ribbon />
          <Title as='h1' className={classes.welcomeTitle}>
            Oi! Vamos organizar o seu dia?
          </Title>
          <p className={classes.introDescription}>
            Crie tarefas, receba sugestões da IA e mantenha sua rotina em dia.
          </p>
        </div>
        <ChecklistArtwork />
      </div>
      <nav className={classes.quickActions} aria-label='Ações da minha rotina'>
        {quickActions.map(action => (
          <button
            key={action.id}
            type='button'
            className={classes.quickAction}
            onClick={() => onAction(action.id)}
          >
            <RoutineIcon name={action.icon} />
            <span>{action.label}</span>
          </button>
        ))}
      </nav>
      <div className={classes.overviewCards}>
        <section
          className={classes.upcoming}
          aria-labelledby='upcoming-heading'
        >
          <div className={classes.cardHeading}>
            <Title as='h2' id='upcoming-heading' className={classes.cardTitle}>
              Próximas tarefas
            </Title>
            <button
              type='button'
              className={classes.textAction}
              onClick={() => onAction('list')}
            >
              Ver todas <span aria-hidden='true'>→</span>
            </button>
          </div>
          {upcoming.length ? (
            <div
              ref={ref}
              className={classes.upcomingRows}
              data-upcoming-preview
            >
              {upcoming.slice(0, capacity).map(task => (
                <TaskRow
                  key={task.occurrenceId}
                  task={task}
                  variant='upcoming'
                  onOpen={onOpen}
                  onComplete={onComplete}
                />
              ))}
            </div>
          ) : (
            <div className={classes.upcomingEmpty}>
              <p className={classes.smallNote}>Nenhuma tarefa por enquanto.</p>
              <button
                type='button'
                className={classes.textAction}
                onClick={() => onAction('create')}
              >
                Criar primeira tarefa <span aria-hidden='true'>+</span>
              </button>
            </div>
          )}
        </section>
        <section className={classes.aiCard} aria-labelledby='ai-card-heading'>
          <div className={classes.aiCardCopy}>
            <Ribbon>COM A AJUDA DA IA</Ribbon>
            <Title as='h2' id='ai-card-heading' className={classes.aiCardTitle}>
              Crie sua rotina <br />
              em minutos.
            </Title>
            <p>
              Receba sugestões personalizadas de tarefas com base no seu momento
              e estilo de vida.
            </p>
            <RoutineButton onClick={() => onAction('assistant')}>
              Quero ajuda da IA <span aria-hidden='true'>→</span>
            </RoutineButton>
          </div>
          <img
            src={Robot}
            width='180'
            height='180'
            className={classes.robot}
            alt=''
            aria-hidden='true'
          />
        </section>
      </div>
    </div>
  );
}
