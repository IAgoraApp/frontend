import { useEffect, useId, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { X, ArrowUpRight, Check } from 'lucide-react';
import { Button } from '../ui';
import HouseholdLayout from '../Household/layout';
import SectionHeading from '../Household/sectionHeading';
import { useAppStore } from '../../store/useAppStore';
import styles from '../../styles/app.module.css';

export function Page({ title, eyebrow, description, action, children }) {
  return (
    <HouseholdLayout title={title} className={styles.app}>
      <div className={styles.pageHeading}>
        <SectionHeading
          as='h1'
          eyebrow={eyebrow || 'INDEPENDÊNCIA NA VIDA REAL'}
          title={title}
          description={description}
        />
        {action}
      </div>
      {children}
    </HouseholdLayout>
  );
}

export function Panel({ title, description, children, className = '' }) {
  return (
    <section className={`${styles.panel} ${className}`}>
      {title && <h2>{title}</h2>}
      {description && <p className={styles.muted}>{description}</p>}
      {children}
    </section>
  );
}

export function Field({ label, children, multiline = false, ...props }) {
  const id = useId();
  return (
    <label className={styles.field} htmlFor={id}>
      <span>{label}</span>
      {children ? (
        <select id={id} {...props}>
          {children}
        </select>
      ) : multiline ? (
        <textarea id={id} {...props} />
      ) : (
        <input id={id} {...props} />
      )}
    </label>
  );
}

export function Modal({ title, onClose, children }) {
  const ref = useRef(null);
  const titleId = useId();
  useEffect(() => {
    const dialog = ref.current;
    const previous = document.activeElement;
    dialog.showModal();
    const initialFocus =
      dialog.querySelector('form input, form textarea, form select') ||
      dialog.querySelector('button');
    initialFocus?.focus();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      dialog.close();
      document.body.style.overflow = overflow;
      previous?.focus();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className={`${styles.modal} ${styles.app}`}
      aria-labelledby={titleId}
      onCancel={onClose}
      onClick={event => {
        if (event.target !== ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        if (
          event.clientX < rect.left ||
          event.clientX > rect.right ||
          event.clientY < rect.top ||
          event.clientY > rect.bottom
        )
          onClose();
      }}
    >
      <div className={styles.modalHeading}>
        <h2 id={titleId}>{title}</h2>
        <button
          type='button'
          className={styles.iconButton}
          aria-label='Fechar janela'
          onClick={onClose}
        >
          <X size={20} />
        </button>
      </div>
      {children}
    </dialog>
  );
}

export function Confirm({
  title = 'Excluir este item?',
  description = 'Esta ação remove o item salvo neste navegador.',
  onConfirm,
  onClose,
}) {
  return (
    <Modal title={title} onClose={onClose}>
      <p>{description}</p>
      <div className={styles.actions}>
        <Button color='preto' onClick={onClose}>
          Cancelar
        </Button>
        <Button
          color='acao'
          onClick={() => {
            onConfirm();
            onClose();
          }}
        >
          Confirmar exclusão
        </Button>
      </div>
    </Modal>
  );
}

export function Empty({
  title = 'Nada por aqui ainda.',
  description = 'Adicione um item para começar.',
  children,
}) {
  return (
    <div className={styles.empty}>
      <h3>{title}</h3>
      <p>{description}</p>
      {children}
    </div>
  );
}

export function Stat({ label, value, detail }) {
  return (
    <div className={styles.stat}>
      <span>{label}</span>
      <strong>{value}</strong>
      {detail && <small>{detail}</small>}
    </div>
  );
}

export function Progress({ value, label }) {
  const percent = Math.min(100, Math.max(0, Math.round(value || 0)));
  return (
    <div className={styles.progress}>
      <div>
        <span>{label}</span>
        <strong>{percent}%</strong>
      </div>
      <progress max='100' value={percent} aria-label={label} />
    </div>
  );
}

export function Shortcut({ to, title, description, icon: Icon }) {
  return (
    <Link to={to} className={styles.shortcut}>
      {Icon && <Icon size={26} aria-hidden='true' />}
      <div>
        <h3>{title}</h3>
        {description && <p>{description}</p>}
      </div>
      <ArrowUpRight size={20} aria-hidden='true' />
    </Link>
  );
}

export function Badge({ children }) {
  return <span className={styles.badge}>{children}</span>;
}

export function ImageInput({ label, value, onChange }) {
  const [error, setError] = useState('');
  async function select(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (
      !['image/jpeg', 'image/png', 'image/webp'].includes(file.type) ||
      file.size > 600000
    ) {
      setError('Escolha uma imagem JPG, PNG ou WebP de até 600 KB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      onChange(reader.result);
      setError('');
    };
    reader.onerror = () =>
      setError('Não foi possível ler a imagem. Tente outro arquivo.');
    reader.readAsDataURL(file);
  }
  return (
    <div className={styles.stack}>
      <Field
        label={label}
        type='file'
        accept='image/jpeg,image/png,image/webp'
        onChange={select}
      />
      <small className={styles.muted}>
        Arquivo local de até 600 KB. Nenhuma imagem será enviada.
      </small>
      {error && (
        <p role='alert' className={styles.error}>
          {error}
        </p>
      )}
      {value && (
        <>
          <img
            src={value}
            alt='Imagem escolhida para a prévia'
            className={styles.uploadPreview}
          />
          <button
            type='button'
            className={styles.textButton}
            onClick={() => onChange('')}
          >
            Remover imagem
          </button>
        </>
      )}
    </div>
  );
}

export function AppFeedback() {
  const notice = useAppStore(state => state.notice);
  const notify = useAppStore(state => state.notify);
  const [storageError, setStorageError] = useState(false);
  useEffect(() => {
    const onError = () => setStorageError(true);
    window.addEventListener('iagora-storage-error', onError);
    return () => window.removeEventListener('iagora-storage-error', onError);
  }, []);
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => notify(''), 6500);
    return () => clearTimeout(timer);
  }, [notice, notify]);
  return (
    <>
      {storageError && (
        <div role='alert' className={styles.storageError}>
          O navegador não conseguiu salvar os dados. As alterações permanecem
          nesta sessão. Libere espaço ou permita o armazenamento local.
          <button
            aria-label='Fechar aviso de armazenamento'
            onClick={() => setStorageError(false)}
          >
            <X size={18} />
          </button>
        </div>
      )}
      <div role='status' aria-live='polite' aria-atomic='true'>
        {notice && (
          <div className={styles.toast}>
            <Check size={20} aria-hidden='true' />
            <span>{notice}</span>
            <button aria-label='Fechar mensagem' onClick={() => notify('')}>
              <X size={18} />
            </button>
          </div>
        )}
      </div>
    </>
  );
}
