import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui';
import {
  Page,
  Panel,
  Stat,
  Field,
  Modal,
  Confirm,
  Empty,
  Progress,
  Badge,
} from '../App/ui';
import TransactionForm from '../App/transactionForm';
import { useAppStore } from '../../store/useAppStore';
import { categories } from '../../data/demo';
import { money, today, dateLabel, normalize } from '../../utils/format';
import styles from '../../styles/app.module.css';

export default function Ledger() {
  const { transactions, budget, savingsGoal } = useAppStore(
    state => state.data
  );
  const { update, saveItem, removeItem, notify } = useAppStore();
  const [month, setMonth] = useState(today().slice(0, 7));
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState('');
  const [editor, setEditor] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [settings, setSettings] = useState(false);
  const [bank, setBank] = useState(false);
  const monthItems = transactions.filter(item => item.date.startsWith(month));
  const income = monthItems
    .filter(item => item.type === 'income')
    .reduce((sum, item) => sum + item.amount, 0);
  const expense = monthItems
    .filter(item => item.type === 'expense')
    .reduce((sum, item) => sum + item.amount, 0);
  const pending = monthItems.filter(
    item => !item.paid && item.type === 'expense'
  );
  const filtered = monthItems
    .filter(
      item =>
        normalize(item.title).includes(normalize(query)) &&
        (!category || item.category === category) &&
        (!type || item.type === type)
    )
    .sort((a, b) => b.date.localeCompare(a.date));
  const months = [...new Set(transactions.map(item => item.date.slice(0, 7)))]
    .sort()
    .reverse();
  const categoryTotals = categories
    .map(name => ({
      name,
      total: monthItems
        .filter(item => item.type === 'expense' && item.category === name)
        .reduce((sum, item) => sum + item.amount, 0),
    }))
    .filter(item => item.total > 0);
  function repeat(item) {
    const date = new Date(`${item.date}T12:00:00`);
    const day = date.getDate();
    date.setDate(1);
    date.setMonth(date.getMonth() + 1);
    const maxDay = new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      0
    ).getDate();
    const nextDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(Math.min(day, maxDay)).padStart(2, '0')}`;
    if (
      transactions.some(
        value =>
          value.title === item.title &&
          value.date === nextDate &&
          value.amount === item.amount
      )
    ) {
      notify('Esse lançamento já existe no próximo mês.');
      return;
    }
    saveItem('transactions', {
      ...item,
      id: undefined,
      date: nextDate,
      paid: false,
    });
    notify(`Conta registrada para ${dateLabel(nextDate)}.`);
  }
  return (
    <Page
      title='Finanças'
      eyebrow='SEU DINHEIRO EM PERSPECTIVA'
      description='Entenda o seu mês e abra espaço para os próximos planos.'
      action={
        <Button color='laranja' onClick={() => setEditor({})}>
          + Novo lançamento
        </Button>
      }
    >
      <div className={styles.row}>
        <Field
          label='Mês de referência'
          type='month'
          value={month}
          onChange={event => {
            if (event.target.value) setMonth(event.target.value);
          }}
        />
        <div className={styles.actions}>
          <Button color='azul' onClick={() => setSettings(true)}>
            Orçamento e meta
          </Button>
          <button className={styles.textButton} onClick={() => setBank(true)}>
            Integração bancária futura
          </button>
        </div>
      </div>
      <div className={styles.stats}>
        <Stat label='Receitas do mês' value={money(income)} />
        <Stat label='Despesas do mês' value={money(expense)} />
        <Stat
          label='Saldo previsto'
          value={money(income - expense)}
          detail='Inclui lançamentos ainda não pagos'
        />
        <Stat
          label='Contas a vencer / pendentes'
          value={pending.length}
          detail={money(pending.reduce((sum, item) => sum + item.amount, 0))}
        />
      </div>
      {expense >= budget && (
        <p className={styles.info} role='status'>
          Alerta demonstrativo: seus gastos{' '}
          {expense > budget ? 'ultrapassaram' : 'atingiram'} o orçamento de{' '}
          {money(budget)} neste mês.
        </p>
      )}
      {pending.length > 0 && (
        <Panel title='Vencimentos para acompanhar'>
          <ul className={styles.list}>
            {pending
              .slice()
              .sort((a, b) => a.date.localeCompare(b.date))
              .map(item => (
                <li key={item.id} className={styles.row}>
                  <div>
                    <strong>{item.title}</strong>
                    <p>
                      {dateLabel(item.date)} ·{' '}
                      {item.date < today()
                        ? 'Vencido'
                        : item.date === today()
                          ? 'Vence hoje'
                          : 'A vencer'}
                    </p>
                  </div>
                  <Button
                    color='azul'
                    onClick={() => {
                      saveItem('transactions', { ...item, paid: true });
                      notify(
                        'Conta marcada como paga localmente. Nenhum pagamento foi realizado.'
                      );
                    }}
                  >
                    Marcar como paga
                  </Button>
                </li>
              ))}
          </ul>
        </Panel>
      )}
      <div className={styles.grid}>
        <Panel title='Gastos por categoria'>
          <Progress
            value={(expense / budget) * 100}
            label={`Orçamento utilizado · ${money(expense)} de ${money(budget)}`}
          />
          {categoryTotals.length ? (
            <div className={styles.chart}>
              {categoryTotals.map(item => (
                <div key={item.name}>
                  <div className={styles.row}>
                    <strong>{item.name}</strong>
                    <span>
                      {money(item.total)} ·{' '}
                      {Math.round((item.total / expense) * 100)}%
                    </span>
                  </div>
                  <div className={styles.bar}>
                    <span
                      style={{ width: `${(item.total / expense) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Empty
              title='Sem gastos neste mês.'
              description='As despesas adicionadas aparecerão no gráfico.'
            />
          )}
        </Panel>
        <Panel title={savingsGoal.title}>
          <Stat
            label='Reservado para sua meta'
            value={money(savingsGoal.saved)}
            detail={`Objetivo: ${money(savingsGoal.target)}`}
          />
          <Progress
            value={(savingsGoal.saved / savingsGoal.target) * 100}
            label='Progresso da economia'
          />
          <p className={styles.muted}>
            Faltam {money(Math.max(0, savingsGoal.target - savingsGoal.saved))}.
            O valor reservado é informado por você e não representa uma conta
            bancária.
          </p>
          <button
            className={styles.textButton}
            onClick={() => setSettings(true)}
          >
            Atualizar minha meta
          </button>
        </Panel>
      </div>
      <Panel title='Lançamentos do mês'>
        <div className={styles.filters}>
          <Field
            label='Pesquisar lançamento'
            type='search'
            value={query}
            onChange={event => setQuery(event.target.value)}
          />
          <Field
            label='Categoria'
            value={category}
            onChange={event => setCategory(event.target.value)}
          >
            <option value=''>Todas</option>
            {categories.map(value => (
              <option key={value}>{value}</option>
            ))}
          </Field>
          <Field
            label='Tipo'
            value={type}
            onChange={event => setType(event.target.value)}
          >
            <option value=''>Todos</option>
            <option value='income'>Receitas</option>
            <option value='expense'>Despesas</option>
          </Field>
        </div>
        {filtered.length ? (
          <ul className={styles.list}>
            {filtered.map(item => (
              <li key={item.id}>
                <div className={styles.row}>
                  <div>
                    <h3>{item.title}</h3>
                    <p className={styles.muted}>
                      {dateLabel(item.date)} · {item.category} ·{' '}
                      {item.paid ? 'Pago / recebido' : 'Pendente'}{' '}
                      {item.house && '· Casa'}
                    </p>
                    <strong>
                      {item.type === 'income' ? '+' : '−'} {money(item.amount)}
                    </strong>
                  </div>
                  <div className={styles.actions}>
                    {item.recurring && (
                      <>
                        <Badge>Mensal</Badge>
                        <button
                          className={styles.textButton}
                          onClick={() => repeat(item)}
                        >
                          Lançar próximo mês
                        </button>
                      </>
                    )}
                    <button
                      className={styles.textButton}
                      onClick={() => setEditor(item)}
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
            title='Nenhum lançamento encontrado.'
            description='Adicione um lançamento ou ajuste seus filtros.'
          />
        )}
      </Panel>
      <Panel title='Seu histórico financeiro'>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <caption className='sr-only'>
              Resumo de todos os meses registrados
            </caption>
            <thead>
              <tr>
                <th>Mês</th>
                <th>Receitas</th>
                <th>Despesas</th>
                <th>Saldo previsto</th>
              </tr>
            </thead>
            <tbody>
              {months.map(value => {
                const records = transactions.filter(item =>
                  item.date.startsWith(value)
                );
                const incoming = records
                  .filter(item => item.type === 'income')
                  .reduce((sum, item) => sum + item.amount, 0);
                const outgoing = records
                  .filter(item => item.type === 'expense')
                  .reduce((sum, item) => sum + item.amount, 0);
                return (
                  <tr key={value}>
                    <td>
                      <button
                        className={styles.textButton}
                        onClick={() => setMonth(value)}
                      >
                        {value.split('-').reverse().join('/')}
                      </button>
                    </td>
                    <td>{money(incoming)}</td>
                    <td>{money(outgoing)}</td>
                    <td>{money(incoming - outgoing)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>
      <p className={styles.muted}>
        Dados iniciais de exemplo, editáveis e salvos localmente.{' '}
        <Link to='/casa' className={styles.textButton}>
          Ver despesas da casa ↗
        </Link>
      </p>
      {editor && (
        <TransactionForm
          transaction={editor.id ? editor : undefined}
          onClose={() => setEditor(null)}
        />
      )}
      {deleting && (
        <Confirm
          onClose={() => setDeleting(null)}
          onConfirm={() => {
            removeItem('transactions', deleting.id);
            notify('Lançamento excluído de Finanças e Casa.');
          }}
        />
      )}
      {settings && (
        <Modal
          title='Planeje com seus números.'
          onClose={() => setSettings(false)}
        >
          <form
            className={styles.form}
            onSubmit={event => {
              event.preventDefault();
              const values = Object.fromEntries(
                new FormData(event.currentTarget)
              );
              if (!values.title.trim()) return;
              update({
                budget: Number(values.budget),
                savingsGoal: {
                  title: values.title.trim(),
                  target: Number(values.target),
                  saved: Number(values.saved),
                },
              });
              setSettings(false);
              notify('Orçamento e meta atualizados.');
            }}
          >
            <Field
              label='Orçamento mensal para despesas (R$)'
              name='budget'
              type='number'
              min='1'
              max='100000000'
              step='0.01'
              defaultValue={budget}
              required
            />
            <Field
              label='Nome da meta'
              name='title'
              defaultValue={savingsGoal.title}
              maxLength={80}
              required
            />
            <div className={styles.formGrid}>
              <Field
                label='Objetivo (R$)'
                name='target'
                type='number'
                min='1'
                max='100000000'
                step='0.01'
                defaultValue={savingsGoal.target}
                required
              />
              <Field
                label='Já reservado (R$)'
                name='saved'
                type='number'
                min='0'
                max='100000000'
                step='0.01'
                defaultValue={savingsGoal.saved}
                required
              />
            </div>
            <Button color='laranja'>Salvar planejamento</Button>
          </form>
        </Modal>
      )}
      {bank && (
        <Modal
          title='Seu banco ainda não está conectado.'
          onClose={() => setBank(false)}
        >
          <div className={styles.stack}>
            <Badge>Integração futura</Badge>
            <p>
              A conexão bancária depende de infraestrutura e autorização
              externas. Nenhuma conta, saldo ou transação é consultada ou
              movimentada.
            </p>
            <p>
              Use os lançamentos locais para experimentar o controle financeiro.
            </p>
            <Button onClick={() => setBank(false)}>
              Continuar com dados locais
            </Button>
          </div>
        </Modal>
      )}
    </Page>
  );
}
