import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui';
import { Panel, Stat, Field, Modal, Empty, Confirm } from '../App/ui';
import TransactionForm from '../App/transactionForm';
import { useAppStore } from '../../store/useAppStore';
import { money, today, dateLabel } from '../../utils/format';
import styles from '../../styles/app.module.css';

export default function HouseManager() {
  const { house, tasks, completions, maintenance, transactions } = useAppStore(
    state => state.data
  );
  const { update, saveItem, removeItem, notify } = useAppStore();
  const [editing, setEditing] = useState(false);
  const [expense, setExpense] = useState(false);
  const [repair, setRepair] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const expenses = transactions.filter(
    item =>
      item.house &&
      item.type === 'expense' &&
      item.date.startsWith(today().slice(0, 7))
  );
  function saveHouse(event) {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget));
    if (!values.name.trim() || !values.city.trim()) {
      notify('Preencha o nome e a cidade da residência.');
      return;
    }
    update({ house: values });
    setEditing(false);
    notify('Sua residência foi salva.');
  }
  function saveRepair(event) {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget));
    if (!values.title.trim()) return;
    saveItem('maintenance', {
      ...repair,
      ...values,
      done: repair.done || false,
    });
    setRepair(null);
    notify('Manutenção salva.');
  }
  return (
    <div className={`${styles.app} ${styles.stack}`} id='minha-residencia'>
      <Panel
        title={house?.name || 'Sua casa começa aqui.'}
        description={
          house
            ? `${house.type} · ${house.city} · ${house.district || 'Bairro não informado'}`
            : 'Cadastre seu canto para reunir informações, despesas e cuidados.'
        }
      >
        {house && (
          <p>
            {house.area} m² · {house.rooms} quarto(s) · {house.people}{' '}
            morador(es) · {house.tenure}
            <br />
            {house.address}
          </p>
        )}
        <div className={styles.actions}>
          <Button color='laranja' onClick={() => setEditing(true)}>
            {house ? 'Editar residência' : 'Cadastrar residência'}
          </Button>
          <Button color='azul' onClick={() => setExpense(true)}>
            + Despesa da casa
          </Button>
        </div>
        <div className={styles.stats}>
          <Stat label='Tarefas concluídas' value={completions.length} />
          <Stat
            label='Atividades pendentes'
            value={tasks.filter(task => !task.done).length}
          />
          <Stat
            label='Manutenções pendentes'
            value={maintenance.filter(item => !item.done).length}
          />
          <Stat
            label='Despesas deste mês'
            value={money(expenses.reduce((sum, item) => sum + item.amount, 0))}
          />
        </div>
      </Panel>
      <div className={styles.grid}>
        <Panel title='Cuidados que pedem atenção'>
          <Button color='azul' onClick={() => setRepair({})}>
            + Registrar manutenção
          </Button>
          {maintenance.length ? (
            <ul className={styles.list}>
              {maintenance.map(item => (
                <li key={item.id}>
                  <div className={styles.row}>
                    <label className={styles.check}>
                      <input
                        type='checkbox'
                        checked={item.done}
                        onChange={() =>
                          saveItem('maintenance', { ...item, done: !item.done })
                        }
                      />
                      <div>
                        <strong className={item.done ? styles.done : ''}>
                          {item.title}
                        </strong>
                        <p className={styles.muted}>{dateLabel(item.date)}</p>
                      </div>
                    </label>
                    <div className={styles.actions}>
                      <button
                        className={styles.textButton}
                        onClick={() => setRepair(item)}
                      >
                        Editar
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
              title='Tudo em ordem por aqui.'
              description='Registre o próximo cuidado quando precisar.'
            />
          )}
        </Panel>
        <Panel title='Despesas da residência'>
          {expenses.length ? (
            <ul className={styles.list}>
              {expenses.map(item => (
                <li key={item.id} className={styles.row}>
                  <strong>{item.title}</strong>
                  <span>{money(item.amount)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <Empty title='Nenhuma despesa neste mês.' />
          )}
          <Button as={Link} to='/financas' color='azul'>
            Gerenciar em Finanças ↗
          </Button>
          <details>
            <summary className={styles.summary}>
              Consultar tarefas concluídas
            </summary>
            <ul className={styles.list}>
              {completions
                .slice()
                .reverse()
                .map(item => (
                  <li key={item.id}>
                    {item.title} ·{' '}
                    {new Date(item.date).toLocaleDateString('pt-BR')}
                  </li>
                ))}
            </ul>
            {!completions.length && (
              <p className={styles.muted}>
                Conclua uma tarefa na rotina para começar seu histórico.
              </p>
            )}
          </details>
        </Panel>
      </div>
      {editing && (
        <Modal
          title={
            house ? 'Editar minha residência' : 'Cadastrar minha residência'
          }
          onClose={() => setEditing(false)}
        >
          <form className={styles.form} onSubmit={saveHouse}>
            <Field
              label='Nome do seu canto'
              name='name'
              defaultValue={house?.name}
              required
              maxLength={80}
              autoFocus
            />
            <div className={styles.formGrid}>
              <Field
                label='Tipo de imóvel'
                name='type'
                defaultValue={house?.type || 'Apartamento'}
              >
                {['Apartamento', 'Casa', 'Studio', 'Quarto'].map(value => (
                  <option key={value}>{value}</option>
                ))}
              </Field>
              <Field
                label='Condição'
                name='tenure'
                defaultValue={house?.tenure || 'Alugado'}
              >
                {['Alugado', 'Próprio', 'Compartilhado'].map(value => (
                  <option key={value}>{value}</option>
                ))}
              </Field>
            </div>
            <div className={styles.formGrid}>
              <Field
                label='Cidade'
                name='city'
                defaultValue={house?.city}
                required
                maxLength={80}
              />
              <Field
                label='Bairro'
                name='district'
                defaultValue={house?.district}
                maxLength={80}
              />
            </div>
            <Field
              label='Endereço (opcional)'
              name='address'
              defaultValue={house?.address}
              maxLength={150}
            />
            <div className={styles.formGrid}>
              <Field
                label='Área (m²)'
                type='number'
                name='area'
                min='1'
                max='100000'
                defaultValue={house?.area || 40}
                required
              />
              <Field
                label='Quartos'
                type='number'
                name='rooms'
                min='0'
                max='50'
                defaultValue={house?.rooms || 1}
                required
              />
              <Field
                label='Moradores'
                type='number'
                name='people'
                min='1'
                max='100'
                defaultValue={house?.people || 1}
                required
              />
            </div>
            <Button color='laranja'>Salvar residência</Button>
          </form>
        </Modal>
      )}
      {expense && <TransactionForm house onClose={() => setExpense(false)} />}
      {repair && (
        <Modal title='Manutenção da casa' onClose={() => setRepair(null)}>
          <form className={styles.form} onSubmit={saveRepair}>
            <Field
              label='O que precisa de atenção?'
              name='title'
              defaultValue={repair.title}
              maxLength={100}
              required
              autoFocus
            />
            <Field
              label='Data prevista'
              name='date'
              type='date'
              defaultValue={repair.date || today()}
              required
            />
            <Button color='laranja'>Salvar manutenção</Button>
          </form>
        </Modal>
      )}
      {deleting && (
        <Confirm
          onClose={() => setDeleting(null)}
          onConfirm={() => {
            removeItem('maintenance', deleting.id);
            notify('Manutenção excluída.');
          }}
        />
      )}
    </div>
  );
}
