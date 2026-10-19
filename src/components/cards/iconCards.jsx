import { House } from 'lucide-react';

export function IconCard({ icone = <House />, children}) {
  return (
    <div className='flex w-fit items-center gap-3 p-2'>
      <div className='bg-(--laranja-fundo) rounded-2xl p-3 text-(--azul-principal)'>{icone}</div>
      <div className='font-bold text-(--azul-titulo) text-[20px]'>{children ? children : "Card com ícone"}</div>
    </div>
  );
}
