import { useEffect, useRef } from 'react';
import { ArrowLeft } from 'lucide-react';
import classesRotina from '../routineClasses';

export default function EspacoTrabalhoRotina({
  registro,
  ativo,
  aoVoltar,
  rotuloVoltar = 'Minha rotina',
  children,
}) {
  const referencia = useRef(null);

  useEffect(() => {
    if (!ativo) return;
    window.scrollTo({ top: 0, behavior: 'instant' });
    referencia.current?.querySelector('h1')?.focus({ preventScroll: true });
  }, [registro.key, ativo]);

  return (
    <section
      ref={referencia}
      className={classesRotina.espacoTrabalho}
      data-tipo-pagina={registro.type}
      aria-labelledby={`modal-rotina-${registro.key}`}
    >
      <button
        type='button'
        className={classesRotina.botaoVoltar}
        onClick={aoVoltar}
      >
        <ArrowLeft size={18} aria-hidden='true' /> {rotuloVoltar}
      </button>
      {children}
    </section>
  );
}
