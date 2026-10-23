import { useState } from 'react';
import { Button } from '../ui';
import { Field, Modal } from './ui';
import { categories } from '../../data/demo';
import { useAppStore } from '../../store/useAppStore';
import { today } from '../../utils/format';
import styles from '../../styles/app.module.css';

export default function TransactionForm({
  transaction,
  house = false,
  onClose,
}) {
  const [error, setError] = useState('');
  const saveItem = useAppStore(state => state.saveItem);
  const notify = useAppStore(state => state.notify);
  function submit(event) {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget));
    if (!values.title.trim() || Number(values.amount) <= 0) {
      setError('Informe uma descrição e um valor maior que zero.');
      return;
    }
    saveItem('transactions', {
      ...transaction,
      title: values.title.trim(),
      type: values.type,
      category: values.category,
      amount: Number(values.amount),
      date: values.date,
      recurring: values.recurring === 'on',
      paid: values.paid === 'on',
      house: values.house === 'on',
    });
    notify('Lançamento salvo. Casa e Finanças já foram atualizados.');
    onClose();
  }
  return (
    <Modal
      title={
        transaction
          ? 'Editar lançamento'
          : house
            ? 'Despesa da casa'
            : 'Novo lançamento'
      }
      onClose={onClose}
    >
      <form onSubmit={submit} className={styles.form}>
        <Field
          label='Descrição'
          name='title'
          defaultValue={transaction?.title}
          required
          maxLength={100}
          autoFocus
        />
        <div className={styles.formGrid}>
          <Field
            label='Tipo'
            name='type'
            defaultValue={transaction?.type || 'expense'}
          >
            <option value='expense'>Despesa</option>
            <option value='income'>Receita</option>
          </Field>
          <Field
            label='Valor (R$)'
            name='amount'
            type='number'
            min='0.01'
            max='100000000'
            step='0.01'
            defaultValue={transaction?.amount}
            required
          />
        </div>
        <div className={styles.formGrid}>
          <Field
            label='Categoria'
            name='category'
            defaultValue={
              transaction?.category || (house ? 'Moradia' : 'Outros')
            }
          >
            {categories.map(value => (
              <option key={value}>{value}</option>
            ))}
          </Field>
          <Field
            label='Data / vencimento'
            name='date'
            type='date'
            defaultValue={transaction?.date || today()}
            required
          />
        </div>
        <label className={styles.check}>
          <input
            type='checkbox'
            name='recurring'
            defaultChecked={transaction?.recurring}
          />
          Conta recorrente mensal
        </label>
        <label className={styles.check}>
          <input
            type='checkbox'
            name='paid'
            defaultChecked={transaction?.paid ?? false}
          />
          Já foi pago / recebido
        </label>
        <label className={styles.check}>
          <input
            type='checkbox'
            name='house'
            defaultChecked={transaction?.house ?? house}
          />
          Relacionado à residência
        </label>
        <small className={styles.muted}>
          Contas recorrentes ficam identificadas. Você pode lançar o próximo mês
          pelo módulo Finanças; nenhuma cobrança é realizada.
        </small>
        {error && (
          <p role='alert' className={styles.error}>
            {error}
          </p>
        )}
        <Button color='laranja'>Salvar lançamento</Button>
      </form>
    </Modal>
  );
}
