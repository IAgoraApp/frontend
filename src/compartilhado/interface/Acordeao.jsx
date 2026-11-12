import { ChevronDown } from 'lucide-react';

export function Acordeao({ itens, classe = '' }) {
  return (
    <div className={`flex min-w-0 flex-col gap-3 ${classe}`}>
      {itens.map(item => (
        <details
          key={item.id}
          className='group rounded-[6px] border border-[#e6edf2] bg-[#f4f7f9]'
        >
          <summary className='flex min-h-[56px] cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-[17px] leading-[1.35] font-bold text-(--azul-titulo) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--laranja-principal) [&::-webkit-details-marker]:hidden'>
            <span className='min-w-0'>{item.pergunta}</span>
            <ChevronDown
              size={20}
              aria-hidden='true'
              className='shrink-0 text-(--texto-apoio) transition-transform duration-200 group-open:rotate-180 group-open:text-(--laranja-principal)'
            />
          </summary>
          <p className='border-t border-[#e6edf2] bg-white px-5 py-4 text-base leading-relaxed text-(--texto-apoio)'>
            {item.resposta}
          </p>
        </details>
      ))}
    </div>
  );
}
