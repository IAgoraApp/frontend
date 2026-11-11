import { faqs } from '../content';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function PerguntasSection() {
  const [openId, setOpenId] = useState(null);

  const toggleAccordion = id => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section
      id='perguntas-frequentes'
      className='w-full border-b border-[#D6E0E8] bg-[#F4F7F9] px-6 py-10 sm:px-12 lg:min-h-[296px] lg:px-[72px] lg:py-[22px]'
    >
      <div className='mx-auto flex h-full max-w-[1296px] flex-col justify-center gap-[18px]'>
        <div className='flex flex-col gap-1 lg:h-[60px]'>
          <span className="font-['DM_Sans'] text-[14px] font-bold tracking-[1px] text-[#E03B00] sm:text-base">
            SEM COMPLICAÇÃO
          </span>
          <h2 className="font-['Bricolage_Grotesque'] text-2xl font-extrabold leading-[35px] text-[#102A43] sm:text-[30px]">
            Antes de começar.
          </h2>
        </div>

        <div className='flex w-full max-w-[1232px] flex-col gap-[6px]'>
          {faqs.map(faq => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className='overflow-hidden rounded-[4px] bg-white transition-all'
              >
                <button
                  type='button'
                  onClick={() => toggleAccordion(faq.id)}
                  className='flex min-h-[34px] w-full py-1 items-center justify-between px-3 text-left transition-colors hover:bg-slate-50 sm:px-4'
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${faq.id}`}
                >
                  <span className="font-['DM_Sans'] text-[15px] font-bold text-[#102A43] sm:text-lg">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`text-[#617385] transition-transform duration-200 shrink-0 ml-4 ${
                      isOpen ? 'rotate-180 text-[#E03B00]' : ''
                    }`}
                    size={22}
                  />
                </button>
                {isOpen && (
                  <div
                    id={`faq-answer-${faq.id}`}
                    className="border-t border-slate-100 px-4 pb-4 pt-3 font-['DM_Sans'] text-sm leading-relaxed text-[#617385] sm:px-6 sm:text-base"
                  >
                    {faq.answer}
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
