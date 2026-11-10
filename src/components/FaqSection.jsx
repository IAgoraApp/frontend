import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    id: 1,
    question: 'Preciso de conta para conhecer o Iagora?',
    answer:
      'Não! Você pode navegar pelos guias essenciais, checklists de introdução e ferramentas básicas livremente. Criar uma conta gratuita é útil para salvar seu progresso, personalizar custos e guardar suas listas favoritas.',
  },
  {
    id: 2,
    question: 'O que encontro na plataforma?',
    answer:
      'Uma central completa para a vida adulta independente: calculadoras de orçamento de aluguel e despesas, checklists de vistoria e mudança, guias práticos de culinária e manutenção doméstica, além de ferramentas de rotina.',
  },
  {
    id: 3,
    question: 'É só para quem vai morar sozinho?',
    answer:
      'Não apenas! O Iagora atende tanto quem está planejando dar o primeiro passo e sair da casa dos pais quanto quem já mora sozinho, divide apartamento com amigos ou simplesmente deseja organizar melhor suas tarefas e contas.',
  },
];

export default function FaqSection() {
  const [openId, setOpenId] = useState(null);

  const toggleAccordion = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="w-full border-b border-[#D6E0E8] bg-[#F4F7F9] px-6 py-10 sm:px-12 lg:h-[296px] lg:px-[72px] lg:py-[22px]">
      <div className="mx-auto flex h-full max-w-[1296px] flex-col justify-center gap-[18px]">
        <div className="flex flex-col gap-1 lg:h-[60px]">
          <span className="font-['DM_Sans'] text-[14px] font-bold tracking-[1px] text-[#E03B00] sm:text-base">
            SEM COMPLICAÇÃO
          </span>
          <h2 className="font-['Bricolage_Grotesque'] text-2xl font-extrabold leading-[35px] text-[#102A43] sm:text-[30px]">
            Antes de começar.
          </h2>
        </div>

        <div className="flex w-full max-w-[1232px] flex-col gap-[6px]">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className="overflow-hidden rounded-[4px] bg-white transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(faq.id)}
                  className="flex h-[34px] w-full items-center justify-between px-3 text-left transition-colors hover:bg-slate-50 sm:px-4"
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
                  <div id={`faq-answer-${faq.id}`} className="border-t border-slate-100 px-4 pb-4 pt-3 font-['DM_Sans'] text-sm leading-relaxed text-[#617385] sm:px-6 sm:text-base">
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
