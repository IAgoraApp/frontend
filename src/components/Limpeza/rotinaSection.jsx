import { useRef, useState } from 'react';
import SectionHeading from '../Household/sectionHeading';
import Checklist from '../Household/checklist';
import { Button } from '../ui';
import { Field, Modal, Confirm } from '../App/ui';
import { cleaningCadences } from '../../data/limpeza';
import { cleaningGuides } from '../../data/cleaningGuides';
import { useAppStore } from '../../store/useAppStore';
import styles from '../../styles/limpeza.module.css';
import app from '../../styles/app.module.css';

export default function RotinaSection({ cadence, onCadenceChange, status }) {
  const tabs = useRef([]);
  const selected = cleaningCadences.find(item => item.id === cadence);
  const { cleaningCustom, cleaningChecks } = useAppStore(state => state.data);
  const { toggle, saveItem, removeItem, completeTask, notify } = useAppStore();
  const [editor, setEditor] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const items = [
    ...selected.items,
    ...cleaningCustom.filter(item => item.cadence === cadence),
  ];
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
  function check(id) {
    const task = useAppStore
      .getState()
      .data.tasks.find(item => item.cleaningId === id && !item.done);
    if (!cleaningChecks.includes(id) && task) completeTask(task.id);
    else toggle('cleaningChecks', id);
  }
  function save(event) {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget));
    if (!values.title.trim()) return;
    saveItem('cleaningCustom', { ...editor, ...values, cadence });
    setEditor(null);
    notify('Seu checklist foi personalizado.');
  }
  return (
    <section
      id='rotina-limpeza'
      aria-labelledby='rotina-titulo'
      className={`flex flex-col gap-8 ${app.app}`}
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
          items={items}
          label={`Tarefas: ${selected.label}`}
          storageKey={`iagora:limpeza:${cadence}`}
          checkedIds={cleaningChecks}
          onToggle={check}
        />
      </div>
      <Button color='azul' onClick={() => setEditor({})}>
        + Personalizar checklist
      </Button>
      <div className={app.grid}>
        {items.map(item => {
          const guide = cleaningGuides[item.id] || {
            materials:
              item.materials || 'Materiais definidos no seu checklist.',
            steps: (item.steps || item.description).split('\n').filter(Boolean),
          };
          return (
            <div className={app.panel} key={item.id}>
              <h3>{item.title}</h3>
              <p className={app.muted}>
                Frequência recomendada: {selected.label.toLowerCase()}. Ajuste à
                sua casa.
              </p>
              <details>
                <summary className={app.summary}>
                  Materiais e passo a passo
                </summary>
                <div className={app.stack}>
                  <p>
                    <strong>Materiais:</strong> {guide.materials}
                  </p>
                  <ol className='list-decimal pl-5'>
                    {guide.steps.map((step, i) => (
                      <li key={i} className='mb-2'>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              </details>
              {item.cadence && (
                <div className={app.actions}>
                  <button
                    className={app.textButton}
                    onClick={() => setEditor(item)}
                  >
                    Editar
                  </button>
                  <button
                    className={app.textButton}
                    onClick={() => setDeleting(item)}
                  >
                    Excluir
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <p className={app.info}>
        Siga os rótulos e as instruções dos fabricantes. Não misture produtos.
        Personalizar o checklist não altera uma tarefa já adicionada à rotina;
        você pode editá-la em Minha rotina.
      </p>
      {editor && (
        <Modal title='Personalizar sua limpeza' onClose={() => setEditor(null)}>
          <form onSubmit={save} className={app.form}>
            <Field
              label='Atividade'
              name='title'
              defaultValue={editor.title}
              required
              maxLength={100}
              autoFocus
            />
            <Field
              label='Descrição curta'
              name='description'
              defaultValue={editor.description}
              required
              maxLength={200}
            />
            <Field
              label='Materiais necessários'
              name='materials'
              defaultValue={editor.materials}
              maxLength={300}
              required
            />
            <Field
              label='Passo a passo (uma etapa por linha)'
              name='steps'
              multiline
              defaultValue={editor.steps}
              maxLength={1500}
              required
            />
            <Button color='laranja'>Salvar no checklist</Button>
          </form>
        </Modal>
      )}
      {deleting && (
        <Confirm
          onClose={() => setDeleting(null)}
          onConfirm={() => {
            removeItem('cleaningCustom', deleting.id);
            notify('Atividade removida do checklist.');
          }}
        />
      )}
    </section>
  );
}
