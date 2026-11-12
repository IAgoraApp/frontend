import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { perguntasFrequentes } from '../content';

export default function SecaoPerguntas() {
  const [idAberto, setIdAberto] = useState(null);

  const alternarAcordeao = id => {
    setIdAberto(idAberto === id ? null : id);
  };

  return (
    <section
      id='perguntas-frequentes'
      className='w-full border-b border-[#D6E0E8] bg-[#F4F7F9] px-6 py-10 sm:px-12 lg:min-h-[296px] lg:px-[72px] lg:py-[22px]'
    >
      <div className='mx-auto flex h-full max-w-[1296px] flex-col justify-center gap-[18px]'>
        <div className='flex flex-col gap-1 lg:h-[60px]'>
          <span className='font-corpo text-[14px] font-bold tracking-[1px] text-(--laranja-principal) sm:text-base'>
            SEM COMPLICAÇÃO
          </span>
          <h2 className='font-titulo text-2xl leading-[35px] font-extrabold text-(--azul-titulo) sm:text-[30px]'>
            Antes de começar.
          </h2>
        </div>

        <div className='flex w-full max-w-[1232px] flex-col gap-[6px]'>
          {perguntasFrequentes.map(pergunta => {
            const aberto = idAberto === pergunta.id;
            return (
              <div
                key={pergunta.id}
                className='overflow-hidden rounded-[4px] bg-white transition-all'
              >
                <button
                  type='button'
                  onClick={() => alternarAcordeao(pergunta.id)}
                  className='flex min-h-[40px] w-full cursor-pointer items-center justify-between px-3 py-2 text-left transition-colors hover:bg-slate-50 sm:px-4'
                  aria-expanded={aberto}
                  aria-controls={`resposta-pergunta-${pergunta.id}`}
                >
                  <span className='font-corpo text-[15px] font-bold text-(--azul-titulo) sm:text-lg'>
                    {pergunta.pergunta}
                  </span>
                  <ChevronDown
                    className={`ml-4 shrink-0 text-(--texto-secundario) transition-transform duration-200 ${
                      aberto ? 'rotate-180 text-(--laranja-principal)' : ''
                    }`}
                    size={22}
                  />
                </button>
                {aberto && (
                  <div
                    id={`resposta-pergunta-${pergunta.id}`}
                    className='border-t border-slate-100 px-4 pt-3 pb-4 font-corpo text-sm leading-relaxed text-(--texto-secundario) sm:px-6 sm:text-base'
                  >
                    {pergunta.resposta}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
