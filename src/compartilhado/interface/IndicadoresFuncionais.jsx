import { Check, ChevronLeft, ChevronRight, Heart, Star } from 'lucide-react';

export function IconeAnterior() {
  return <ChevronLeft aria-hidden='true' className='size-5' />;
}

export function IconeProximo() {
  return <ChevronRight aria-hidden='true' className='size-5' />;
}

export function IconeFavorito({ ativo = false }) {
  return (
    <Heart
      aria-hidden='true'
      className='inline-block size-4 shrink-0 align-middle'
      fill={ativo ? 'currentColor' : 'none'}
    />
  );
}

export function IconeConcluido() {
  return (
    <Check
      aria-hidden='true'
      className='inline-block size-4 shrink-0 align-middle'
    />
  );
}

export function IconeEstrela() {
  return (
    <Star
      aria-hidden='true'
      className='inline-block size-3.5 shrink-0 align-middle'
      fill='currentColor'
    />
  );
}

export function EstrelasAvaliacao({ nota }) {
  return (
    <span
      role='img'
      aria-label={`${nota} de 5 estrelas`}
      className='inline-flex items-center align-middle'
    >
      {Array.from({ length: nota }, (_, indice) => (
        <IconeEstrela key={indice} />
      ))}
    </span>
  );
}
