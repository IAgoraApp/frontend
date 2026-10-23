import { useState } from 'react';
import { Button } from '../ui';
import { Panel, Field, Empty, Confirm, Modal } from '../App/ui';
import { useAppStore } from '../../store/useAppStore';
import styles from '../../styles/app.module.css';

export default function ShoppingList() {
  const shopping = useAppStore(state => state.data.shopping);
  const { saveItem, removeItem, notify } = useAppStore();
  const [deleting, setDeleting] = useState(null);
  const [editing, setEditing] = useState(null);
  function add(event) {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget));
    if (!values.name.trim()) return;
    saveItem('shopping', {
      name: values.name.trim(),
      done: false,
      description: 'Adicionado por você',
    });
    event.currentTarget.reset();
    notify('Item adicionado à lista.');
  }
  return (
    <div className={styles.app}>
      <Panel
        title='Sua lista de compras'
        description={`${shopping.filter(item => !item.done).length} item(ns) para comprar. As quantidades geradas correspondem a cada refeição planejada.`}
      >
        <form className={styles.actions} onSubmit={add}>
          <div className='flex-1 min-w-40'>
            <Field
              label='Adicionar item'
              name='name'
              placeholder='Ex.: 1 litro de leite'
              maxLength={150}
              required
            />
          </div>
          <Button color='laranja' className='self-end'>
            Adicionar
          </Button>
        </form>
        {shopping.length ? (
          <ul className={styles.list}>
            {shopping.map(item => (
              <li key={item.id}>
                <div className={styles.row}>
                  <label className={styles.check}>
                    <input
                      type='checkbox'
                      checked={item.done}
                      onChange={() =>
                        saveItem('shopping', { ...item, done: !item.done })
                      }
                    />
                    <div>
                      <strong className={item.done ? styles.done : ''}>
                        {item.name}
                      </strong>
                      <p className={styles.muted}>{item.description}</p>
                    </div>
                  </label>
                  <div className={styles.actions}>
                    <button
                      className={styles.textButton}
                      onClick={() => setEditing(item)}
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
            title='Geladeira conferida, lista em aberto.'
            description='Adicione itens ou gere sua lista a partir do planejamento de refeições.'
          />
        )}
        {editing && (
          <Modal title='Editar item de compra' onClose={() => setEditing(null)}>
            <form
              className={styles.form}
              onSubmit={event => {
                event.preventDefault();
                const name = new FormData(event.currentTarget)
                  .get('name')
                  .trim();
                if (!name) return;
                saveItem('shopping', { ...editing, name });
                setEditing(null);
                notify('Item atualizado.');
              }}
            >
              <Field
                label='Item e quantidade'
                name='name'
                defaultValue={editing.name}
                required
                maxLength={150}
              />
              <Button color='laranja'>Salvar item</Button>
            </form>
          </Modal>
        )}
        {deleting && (
          <Confirm
            onClose={() => setDeleting(null)}
            onConfirm={() => {
              removeItem('shopping', deleting.id);
              notify('Item excluído da lista.');
            }}
          />
        )}
      </Panel>
    </div>
  );
}
