import { useEffect, useRef } from 'react';
import { Button, Title } from '../../../shared/ui';

const assets = import.meta.glob('../assets/*.svg', {
  eager: true,
  query: '?url',
  import: 'default',
});
export function Icon({ name, className = '' }) {
  const src = assets['../assets/img' + name + '.svg'];
  return src ? (
    <span
      aria-hidden='true'
      className={
        'inline-flex shrink-0 items-center justify-center ' + className
      }
    >
      <img src={src} alt='' className='block max-h-full max-w-full' />
    </span>
  ) : null;
}
export function Action({
  children,
  secondary = false,
  navy = false,
  className = '',
  ...props
}) {
  return (
    <Button
      unstyled
      className={
        'min-h-11 gap-2 rounded-full px-6 py-3 text-sm font-bold disabled:opacity-50 ' +
        (secondary
          ? 'border border-[#dbe5ed] bg-(--azul-fundo) text-(--azul-titulo) hover:bg-[#e6edf2] '
          : navy
            ? 'bg-(--azul-titulo) text-white hover:opacity-85 '
            : 'bg-(--laranja-principal) text-white hover:opacity-85 ') +
        className
      }
      {...props}
    >
      {children}
    </Button>
  );
}
export function Panel({
  title,
  children,
  className = '',
  action,
  neutral = false,
}) {
  return (
    <section
      className={
        'min-w-0 rounded-xl border border-[#d9e4ec] p-5 sm:p-6 ' +
        (neutral ? 'bg-(--azul-fundo) ' : 'bg-white ') +
        className
      }
    >
      {title && (
        <div className='mb-5 flex flex-wrap items-center justify-between gap-3'>
          <Title className='text-xl font-extrabold'>{title}</Title>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}
export function Empty({ children = 'Nenhum registro por aqui.', onCreate }) {
  return (
    <div className='flex min-h-40 flex-col items-center justify-center gap-4 p-5 text-center text-(--texto-apoio)'>
      <p>{children}</p>
      {onCreate && <Action onClick={onCreate}>Criar primeiro registro</Action>}
    </div>
  );
}
export function Segments({ options, value, onChange, label }) {
  return (
    <div className='flex flex-wrap gap-2' role='group' aria-label={label}>
      {options.map(([key, text]) => (
        <button
          type='button'
          key={key}
          aria-pressed={value === key}
          onClick={() => onChange(key)}
          className={
            'min-h-11 rounded-full px-5 py-2 text-sm font-bold ' +
            (value === key
              ? 'bg-(--azul-titulo) text-white'
              : 'bg-(--azul-fundo) text-(--texto-apoio) hover:bg-[#e6edf2]')
          }
        >
          {text}
        </button>
      ))}
    </div>
  );
}
export function Progress({ value, label, color = '#d54c15' }) {
  return (
    <div
      role='progressbar'
      aria-label={label}
      aria-valuenow={Math.round(Math.min(100, value))}
      aria-valuemin={0}
      aria-valuemax={100}
      className='h-2 overflow-hidden rounded-full bg-[#e6edf2]'
    >
      <div
        className='h-full rounded-full transition-[width] motion-reduce:transition-none'
        style={{
          width: Math.min(100, Math.max(0, value)) + '%',
          backgroundColor: color,
        }}
      />
    </div>
  );
}
export function Dialog({ title, children, onClose }) {
  const ref = useRef(null);
  const closeRef = useRef(onClose);
  useEffect(() => {
    closeRef.current = onClose;
  }, [onClose]);
  useEffect(() => {
    const dialog = ref.current;
    const previous = document.activeElement;
    dialog.showModal();
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
      onCancel={event => {
        event.preventDefault();
        closeRef.current();
      }}
      onClick={event => {
        if (event.target === event.currentTarget) closeRef.current();
      }}
      aria-labelledby='finance-dialog-title'
      className='fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-xl overflow-y-auto rounded-2xl border border-[#dbe5ed] bg-white p-5 text-(--azul-titulo) shadow-xl backdrop:bg-[#102a43]/40 sm:p-8'
    >
      <div className='mb-6 flex items-start justify-between gap-4'>
        <Title
          as='h2'
          id='finance-dialog-title'
          className='text-2xl font-extrabold'
        >
          {title}
        </Title>
        <button
          type='button'
          aria-label='Fechar'
          onClick={onClose}
          className='-mt-2 -mr-2 flex size-11 shrink-0 items-center justify-center rounded-full text-2xl hover:bg-(--azul-fundo)'
        >
          ×
        </button>
      </div>
      {children}
    </dialog>
  );
}

export function ViewPanel({ active, flush = false, children }) {
  return (
    <div hidden={!active} className={'min-w-0 ' + (flush ? '' : 'pt-6')}>
      {children}
    </div>
  );
}
