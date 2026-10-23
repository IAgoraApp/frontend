import { useState } from 'react';
import { Award, BookOpen } from 'lucide-react';
import { Button } from '../components/ui';
import {
  Page,
  Panel,
  Progress,
  Badge,
  Modal,
  Stat,
  Empty,
} from '../components/App/ui';
import { lessons } from '../data/catalog';
import { useAppStore } from '../store/useAppStore';
import styles from '../styles/app.module.css';

export default function Aprendendo() {
  const completed = useAppStore(state => state.data.lessons);
  const answers = useAppStore(state => state.data.quizAnswers);
  const { update, notify } = useAppStore();
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('Todos');
  const filtered = lessons.filter(
    lesson =>
      filter === 'Todos' ||
      (filter === 'Pendentes'
        ? !completed.includes(lesson.id)
        : completed.includes(lesson.id))
  );
  function answer(index) {
    const correct = index === selected.correct;
    update({
      quizAnswers: { ...answers, [selected.id]: index },
      lessons:
        correct && !completed.includes(selected.id)
          ? [...completed, selected.id]
          : completed,
    });
    if (correct)
      notify(
        'Atividade concluída! Seu progresso de aprendizagem foi atualizado.'
      );
  }
  return (
    <Page
      title='Aprendendo a morar'
      eyebrow='AUTONOMIA SE APRENDE'
      description='Guias curtos e pequenas decisões para ganhar confiança.'
    >
      <Panel title='Seu repertório está crescendo.' className={styles.tinted}>
        <div className={styles.stats}>
          <Stat
            label='Pontos conquistados'
            value={completed.length * 25}
            detail='25 pontos por atividade concluída'
          />
          <Stat
            label='Sua conquista'
            value={
              completed.length === lessons.length
                ? 'Chaves na mão'
                : completed.length >= 2
                  ? 'Ganhando prática'
                  : 'Primeiros passos'
            }
          />
        </div>
        <Progress
          value={(completed.length / lessons.length) * 100}
          label={`${completed.length} de ${lessons.length} atividades concluídas`}
        />
      </Panel>
      <div className={styles.tabs}>
        {['Todos', 'Pendentes', 'Concluídos'].map(value => (
          <button
            key={value}
            aria-pressed={filter === value}
            onClick={() => setFilter(value)}
          >
            {value}
          </button>
        ))}
      </div>
      <div className={styles.grid}>
        {filtered.map(lesson => (
          <Panel title={lesson.title} key={lesson.id}>
            <Badge>
              <BookOpen size={14} />
              {lesson.category} · {lesson.minutes} min
            </Badge>
            <p className={styles.muted}>{lesson.content[0]}</p>
            <div className={styles.row}>
              <span>
                {completed.includes(lesson.id)
                  ? '✓ Concluído · 25 pontos'
                  : 'Uma nova habilidade'}
              </span>
              <Button color='laranja' onClick={() => setSelected(lesson)}>
                {completed.includes(lesson.id)
                  ? 'Revisar guia'
                  : 'Começar atividade'}
              </Button>
            </div>
          </Panel>
        ))}
      </div>
      {!filtered.length && (
        <Empty
          title='Nenhuma atividade neste filtro.'
          description='Escolha outro filtro para continuar aprendendo.'
        />
      )}
      {selected && (
        <Modal title={selected.title} onClose={() => setSelected(null)}>
          <div className={styles.stack}>
            <Badge>{selected.category} · guia educativo</Badge>
            {selected.content.map(paragraph => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <h3>Experimente uma decisão</h3>
            <p>{selected.question}</p>
            {selected.options.map((option, index) => (
              <Button
                color={answers[selected.id] === index ? 'laranja' : 'azul'}
                key={option}
                onClick={() => answer(index)}
              >
                {option}
              </Button>
            ))}
            {answers[selected.id] !== undefined && (
              <div
                role='status'
                className={
                  answers[selected.id] === selected.correct
                    ? styles.info
                    : styles.error
                }
              >
                {answers[selected.id] === selected.correct ? (
                  <>
                    <Award className='inline mr-2' size={20} />
                    Boa escolha!{' '}
                  </>
                ) : (
                  'Tente outra alternativa. '
                )}
                {selected.explanation}
              </div>
            )}
            <Button color='preto' onClick={() => setSelected(null)}>
              Voltar aos guias
            </Button>
          </div>
        </Modal>
      )}
    </Page>
  );
}
