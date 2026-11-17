import { useEffect } from 'react';
import { CheckCircle2, X } from 'lucide-react';

export default function AvisoLimpeza({ aviso, aoFechar }) {
  useEffect(() => {
    const temporizador = window.setTimeout(aoFechar, 4000);
    return () => window.clearTimeout(temporizador);
  }, [aviso, aoFechar]);

  return (
    <div
      className='limpeza-aviso'
      role='status'
      aria-live='polite'
      aria-atomic='true'
    >
      <CheckCircle2 size={21} aria-hidden='true' />
      <span>{aviso.mensagem}</span>
      <button type='button' aria-label='Dispensar aviso' onClick={aoFechar}>
        <X size={18} aria-hidden='true' />
      </button>
    </div>
  );
}
