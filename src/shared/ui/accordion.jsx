export function Accordion({ items, className = '' }) {
  return (
    <div className={`flex min-w-0 flex-col gap-3 ${className}`}>
      {items.map(item => (
        <details key={item.id} className='group rounded-[5px] bg-[#f4f7f9]'>
          <summary className='flex min-h-[58px] cursor-pointer list-none items-center justify-between gap-4 px-4 py-4 text-[18px] leading-[19px] font-bold text-(--azul-titulo) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--laranja-principal) [&::-webkit-details-marker]:hidden'>
            <span className='min-w-0'>{item.question}</span>
            <span
              aria-hidden='true'
              className='shrink-0 text-xl leading-[26px] text-(--texto-apoio) group-open:rotate-180'
            >
              ⌄
            </span>
          </summary>
          <p className='px-4 pb-4 text-base leading-relaxed text-(--texto-apoio)'>
            {item.answer}
          </p>
        </details>
      ))}
    </div>
  );
}
