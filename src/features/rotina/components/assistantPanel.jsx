import { useEffect, useState } from 'react';
import { Title } from '../../../shared/ui';
import Robot from '../assets/robot.png';
import { suggestionExamples, weekdays } from '../content';
import { buildSuggestions } from '../utils/tasks';
import { ModalHeading, Notice, RoutineButton, RoutineIcon } from './routineUi';
import classes from '../routineClasses';

export default function AssistantPanel({
  onAdd,
  onManual,
  titleId,
  presentation = 'modal',
}) {
  const [prompt, setPrompt] = useState('');
  const [request, setRequest] = useState('');
  const [status, setStatus] = useState('idle');
  const [suggestions, setSuggestions] = useState([]);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    document.getElementById(titleId)?.focus({ preventScroll: true });
  }, [status, titleId]);

  useEffect(() => {
    if (status !== 'loading') return;
    const timer = window.setTimeout(() => {
      try {
        const result = buildSuggestions(request);
        setSuggestions(result);
        setSelected(result.map(item => item.id));
        setStatus('ready');
      } catch {
        setStatus('error');
      }
    }, 500);
    return () => window.clearTimeout(timer);
  }, [status, request]);

  function generate(value) {
    if (!value.trim()) return;
    setRequest(value.trim());
    setStatus('loading');
  }

  if (status === 'loading')
    return (
      <div className={classes.modalContent} aria-busy='true'>
        <ModalHeading
          id={titleId}
          as={presentation === 'page' ? 'h1' : 'h2'}
          title='Organizando as informações.'
          description='Aguarde enquanto preparamos suas sugestões.'
          artwork
        />
        <div className={classes.skeletonList} aria-hidden='true'>
          {[0, 1, 2].map(item => (
            <div key={item} />
          ))}
        </div>
        <p role='status' className={classes.smallNote}>
          Preparando sugestões de exemplo…
        </p>
        <RoutineButton tone='secondary' onClick={() => setStatus('idle')}>
          Cancelar
        </RoutineButton>
      </div>
    );

  if (status === 'error')
    return (
      <div className={classes.modalContent}>
        <ModalHeading
          id={titleId}
          as={presentation === 'page' ? 'h1' : 'h2'}
          title='Não foi possível gerar sugestões.'
          description='Tente novamente ou crie sua tarefa manualmente.'
          artwork
        />
        <div className={classes.actions} data-actions>
          <RoutineButton onClick={() => generate(request)}>
            Tentar novamente
          </RoutineButton>
          <RoutineButton tone='secondary' onClick={onManual}>
            Criar tarefa
          </RoutineButton>
        </div>
      </div>
    );

  if (status === 'ready')
    return (
      <div className={classes.modalContent}>
        <ModalHeading
          id={titleId}
          as={presentation === 'page' ? 'h1' : 'h2'}
          title='Uma semana com espaço para respirar.'
          description='Sugestão de organização para revisar antes de adicionar.'
          artwork
        />
        <p className={classes.smallNote}>
          Demonstração com sugestões prontas. Nenhuma IA está conectada.
        </p>
        <div className={classes.suggestionList}>
          {suggestions.map(item => (
            <label key={item.id} className={classes.suggestionItem}>
              <input
                type='checkbox'
                checked={selected.includes(item.id)}
                onChange={event =>
                  setSelected(previous =>
                    event.target.checked
                      ? [...previous, item.id]
                      : previous.filter(id => id !== item.id)
                  )
                }
              />
              <span>
                <strong>
                  {weekdays
                    .find(day => day.id === item.day)
                    ?.label.replace('-feira', '')}{' '}
                  · {item.title} · {item.duration} min
                </strong>
                <span>Selecione o que faz sentido para você.</span>
              </span>
            </label>
          ))}
        </div>
        <div className={classes.actions} data-actions>
          <RoutineButton
            disabled={!selected.length}
            onClick={() =>
              onAdd(suggestions.filter(item => selected.includes(item.id)))
            }
          >
            Adicionar selecionadas
            {selected.length ? ` (${selected.length})` : ''}
          </RoutineButton>
          <RoutineButton tone='secondary' onClick={() => setStatus('idle')}>
            Pedir outra sugestão
          </RoutineButton>
        </div>
      </div>
    );

  return (
    <div className={classes.modalContent}>
      <ModalHeading
        id={titleId}
        as={presentation === 'page' ? 'h1' : 'h2'}
        ribbon={presentation !== 'page'}
        title='Sugestões da IA'
        description='Com base no seu momento, aqui estão algumas ideias para a sua rotina.'
      />
      <section
        className={classes.assistantPrompt}
        aria-labelledby='assistant-prompt-title'
      >
        <img
          src={Robot}
          width='180'
          height='180'
          alt=''
          className={classes.assistantRobot}
          aria-hidden='true'
        />
        <Title as='h3' id='assistant-prompt-title'>
          Em que posso te ajudar hoje?
        </Title>
        <p>
          Peça sugestões de tarefas, monte uma rotina completa ou tire dúvidas
          sobre organização da sua casa.
        </p>
        <form
          className={classes.promptForm}
          onSubmit={event => {
            event.preventDefault();
            generate(prompt);
          }}
        >
          <label className={classes.srOnly} htmlFor={`${titleId}-prompt`}>
            Descreva a rotina que você quer organizar
          </label>
          <input
            id={`${titleId}-prompt`}
            placeholder='Ex: Me ajude a criar uma rotina semanal de limpeza'
            maxLength={500}
            value={prompt}
            onChange={event => setPrompt(event.target.value)}
            required
          />
          <button
            type='submit'
            aria-label='Gerar sugestões'
            disabled={!prompt.trim()}
          >
            ↗
          </button>
        </form>
      </section>
      <p className={classes.exampleLabel}>Ou escolha um exemplo:</p>
      <div className={classes.suggestionExamples}>
        {suggestionExamples.map(example => (
          <button
            key={example.id}
            type='button'
            onClick={() => generate(example.title)}
          >
            <RoutineIcon name={example.icon} />
            <strong>{example.title}</strong>
          </button>
        ))}
      </div>
      <Notice>
        Sugestões de exemplo para adaptar. Nenhuma IA está conectada.
      </Notice>
    </div>
  );
}
