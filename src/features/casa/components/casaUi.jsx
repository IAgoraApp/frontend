import { useEffect, useRef } from 'react';
import { Button, Title } from '../../../shared/ui';

export function CasaButton({ secondary = false, className = '', ...props }) {
  return (
    <Button
      unstyled
      className={
        'min-h-12 gap-2 rounded-full px-6 py-3 text-sm font-bold ' +
        (secondary
          ? 'border border-[#dbe5ed] bg-(--azul-fundo) text-(--azul-titulo) hover:bg-[#e6edf2] '
          : 'bg-(--laranja-principal) text-white hover:opacity-85 ') +
        className
      }
      {...props}
    />
  );
}
export function CasaCard({ title, children, className = '', action }) {
  return (
    <section
      className={
        'min-w-0 rounded-xl border border-[#dbe5ed] bg-white p-5 sm:p-6 ' +
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
export function CasaDialog({ title, children, onClose }) {
  const ref = useRef(null);
  useEffect(() => {
    const element = ref.current;
    const previous = document.activeElement;
    element.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      element.close();
      document.body.style.overflow = overflow;
      previous?.focus();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      aria-labelledby='casa-dialog-title'
      onCancel={event => {
        event.preventDefault();
        onClose();
      }}
      onClick={event => {
        if (event.target === event.currentTarget) onClose();
      }}
      className='fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-2xl overflow-y-auto rounded-2xl border border-[#dbe5ed] bg-white p-5 text-(--azul-titulo) shadow-xl backdrop:bg-[#102a43]/40 sm:p-8'
    >
      <div className='mb-6 flex items-start justify-between gap-4'>
        <Title
          as='h2'
          id='casa-dialog-title'
          className='text-2xl font-extrabold'
        >
          {title}
        </Title>
        <button
          type='button'
          onClick={onClose}
          aria-label='Fechar'
          className='-mt-2 -mr-2 flex size-11 shrink-0 items-center justify-center rounded-full text-2xl hover:bg-(--azul-fundo)'
        >
          ×
        </button>
      </div>
      {children}
    </dialog>
  );
}
export function CasaSelect({ label, id, children, ...props }) {
  return (
    <div className='flex min-w-0 flex-col gap-2'>
      <label htmlFor={id} className='text-sm font-bold'>
        {label}
      </label>
      <select
        id={id}
        className='h-13 w-full min-w-0 rounded-lg border border-[#dbe5ed] bg-white px-4'
        {...props}
      >
        {children}
      </select>
    </div>
  );
}
