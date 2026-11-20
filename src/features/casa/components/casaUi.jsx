import { useEffect, useId, useRef } from 'react';
import { Botao, Titulo } from '../../../shared/ui/index';

let dialogosAbertos = 0;
let overflowAnterior = '';

export function BotaoCasa({
  secundario = false,
  classe = '',
  ...propriedades
}) {
  return (
    <Botao
      semEstilo
      classe={
        'min-h-12 gap-2 rounded-full px-6 py-3 text-sm font-bold ' +
        (secundario
          ? 'border border-[#dbe5ed] bg-(--azul-fundo) text-(--azul-titulo) hover:bg-[#e6edf2] '
          : 'bg-(--laranja-principal) text-white hover:bg-[#c43300] ') +
        classe
      }
      {...propriedades}
    />
  );
}

export function CartaoCasa({ titulo, children, classe = '', acao }) {
  return (
    <section
      className={
        'min-w-0 rounded-xl border border-[#dbe5ed] bg-white p-5 sm:p-6 ' +
        classe
      }
    >
      {titulo && (
        <div className='mb-5 flex flex-wrap items-center justify-between gap-3'>
          <Titulo classe='text-xl font-extrabold'>{titulo}</Titulo>
          {acao}
        </div>
      )}
      {children}
    </section>
  );
}

export function DialogoCasa({ titulo, children, aoFechar, classe = '' }) {
  const referencia = useRef(null);
  const idTitulo = useId();

  useEffect(() => {
    const elemento = referencia.current;
    const anterior = document.activeElement;
    elemento.showModal();
    if (dialogosAbertos === 0) overflowAnterior = document.body.style.overflow;
    dialogosAbertos += 1;
    document.body.style.overflow = 'hidden';
    return () => {
      elemento.close();
      dialogosAbertos -= 1;
      if (dialogosAbertos === 0)
        document.body.style.overflow = overflowAnterior;
      anterior?.focus();
    };
  }, []);

  return (
    <dialog
      ref={referencia}
      aria-labelledby={idTitulo}
      onCancel={evento => {
        evento.preventDefault();
        aoFechar();
      }}
      onClick={evento => {
        if (evento.target === evento.currentTarget) aoFechar();
      }}
      className={`fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-2xl overflow-y-auto rounded-2xl border border-[#dbe5ed] bg-white p-5 text-(--azul-titulo) shadow-xl backdrop:bg-[#102a43]/40 sm:p-8 ${classe}`}
    >
      <div className='mb-6 flex items-start justify-between gap-4'>
        <Titulo como='h2' id={idTitulo} classe='text-2xl font-extrabold'>
          {titulo}
        </Titulo>
        <button
          type='button'
          onClick={aoFechar}
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

export function SelecaoCasa({ rotulo, id, children, ...propriedades }) {
  return (
    <div className='flex min-w-0 flex-col gap-2'>
      <label htmlFor={id} className='text-sm font-bold'>
        {rotulo}
      </label>
      <select
        id={id}
        className='h-13 w-full min-w-0 rounded-lg border border-[#dbe5ed] bg-white px-4 text-(--azul-titulo)'
        {...propriedades}
      >
        {children}
      </select>
    </div>
  );
}
