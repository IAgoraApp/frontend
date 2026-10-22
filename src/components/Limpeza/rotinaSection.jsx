import { useRef } from 'react';
import SectionHeading from '../Household/sectionHeading';
import Checklist from '../Household/checklist';
import { cleaningCadences } from '../../data/limpeza';
import styles from '../../styles/limpeza.module.css';

export default function RotinaSection({ cadence, onCadenceChange, status }) {
  const tabs = useRef([]);
  const selected = cleaningCadences.find(item => item.id === cadence);

  function handleKeyDown(event, index) {
    let next;
    if (event.key === 'ArrowRight')
      next = (index + 1) % cleaningCadences.length;
    if (event.key === 'ArrowLeft')
      next = (index + cleaningCadences.length - 1) % cleaningCadences.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = cleaningCadences.length - 1;
    if (next === undefined) return;
    event.preventDefault();
    onCadenceChange(cleaningCadences[next].id);
    tabs.current[next].focus();
  }

  return (
    <section
      id='rotina-limpeza'
      aria-labelledby='rotina-titulo'
      className='flex flex-col gap-10'
    >
      <SectionHeading
        id='rotina-titulo'
        eyebrow='UM POUCO A CADA DIA'
        title='O combinado da semana.'
        description='Comece pelo que faz mais diferença no seu dia a dia.'
      />
      {status && (
        <p role='status' className={styles.status}>
          {status}
        </p>
      )}
      <div
        role='tablist'
        aria-label='Frequência da limpeza'
        className={styles.tabs}
      >
        {cleaningCadences.map((item, index) => (
          <button
            key={item.id}
            type='button'
            role='tab'
            id={`aba-${item.id}`}
            aria-selected={item.id === cadence}
            aria-controls='tarefas-limpeza'
            tabIndex={item.id === cadence ? 0 : -1}
            ref={element => {
              tabs.current[index] = element;
            }}
            onClick={() => onCadenceChange(item.id)}
            onKeyDown={event => handleKeyDown(event, index)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div
        role='tabpanel'
        id='tarefas-limpeza'
        aria-labelledby={`aba-${cadence}`}
        tabIndex={0}
      >
        <Checklist
          key={cadence}
          items={selected.items}
          label={`Tarefas: ${selected.label}`}
          storageKey={`iagora:limpeza:${cadence}`}
          initialChecked={selected.initialChecked}
        />
      </div>
    </section>
  );
}
