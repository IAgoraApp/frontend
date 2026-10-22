import { useRef } from 'react';
import { X } from 'lucide-react';
import EditorialCard from '../Household/editorialCard';
import Checklist from '../Household/checklist';
import { Button } from '../ui';
import { cleaningCards, cleaningKit } from '../../data/limpeza';
import shared from '../../styles/household.module.css';
import styles from '../../styles/limpeza.module.css';

export default function KitSection() {
  const dialog = useRef(null);
  return (
    <>
      <section
        className={shared.cards}
        aria-label='Ajuda para cuidar da limpeza'
      >
        {cleaningCards.map((card, index) => (
          <EditorialCard
            key={card.eyebrow}
            {...card}
            action={
              index === 0
                ? { ...card.action, onClick: () => dialog.current.showModal() }
                : card.action
            }
          />
        ))}
      </section>
      <dialog
        ref={dialog}
        className={styles.dialog}
        aria-labelledby='kit-titulo'
        onClick={event => {
          if (event.target === dialog.current) dialog.current.close();
        }}
      >
        <div className={styles.dialogHeading}>
          <h2 id='kit-titulo' className='font-heading text-3xl font-extrabold'>
            Seu primeiro kit de limpeza.
          </h2>
          <button
            type='button'
            aria-label='Fechar kit de limpeza'
            onClick={() => dialog.current.close()}
          >
            <X aria-hidden='true' />
          </button>
        </div>
        <Checklist
          items={cleaningKit}
          storageKey='iagora:limpeza:kit'
          label='Itens do kit de limpeza'
        />
        <form method='dialog' className='mt-6 flex justify-end'>
          <Button color='acao'>Concluir</Button>
        </form>
      </dialog>
    </>
  );
}
