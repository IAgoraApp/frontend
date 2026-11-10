import { useState } from 'react';

const steps = [
  {
    number: '01',
    tab: '01 Conta',
    title: 'Crie sua conta',
    description: 'Salve seus interesses e acompanhe o que já fez.',
  },
  {
    number: '02',
    tab: '02 Seu momento',
    title: 'Escolha o seu momento',
    description: 'Diga se está se preparando para sair de casa ou se já está no seu canto precisando de organização.',
  },
  {
    number: '03',
    tab: '03 Seu dia',
    title: 'Viva seu dia a dia com leveza',
    description: 'Acesse roteiros prontos para cada semana: receitas práticas, listas de compras e controle financeiro.',
  },
];

export default function PassosSection() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section id="como-funciona" className="w-full bg-[#E03B00] px-6 py-10 text-white sm:px-12 lg:h-[300px] lg:px-[72px] lg:py-[18px]">
      <div className="mx-auto flex h-full max-w-[1296px] flex-col justify-center gap-[15px]">
        <div className="flex flex-col gap-1">
          <span className="font-['DM_Sans'] text-[14px] font-bold tracking-[1px] sm:text-base">
            TRÊS PASSOS, UM NOVO COMEÇO.
          </span>
          <h2 className="font-['Bricolage_Grotesque'] text-[28px] font-extrabold leading-[38px] sm:text-[34px]">
            Da primeira chave ao seu dia a dia.
          </h2>
        </div>

        <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-[18px] lg:h-[41px]">
          {steps.map((step, index) => {
            const isActive = index === activeStep;
            return (
              <button
                key={step.number}
                type="button"
                onClick={() => setActiveStep(index)}
                className={`flex h-[41px] items-center rounded-2xl px-[14px] font-['DM_Sans'] text-base font-bold transition-colors ${
                  isActive
                    ? 'bg-white text-[#102A43]'
                    : 'bg-[#102A43] text-white hover:bg-[#0c1f32]'
                }`}
              >
                <span>{step.tab}</span>
              </button>
            );
          })}
        </div>

        <div className="flex flex-col justify-center gap-1 lg:h-[62px]">
          <h3 className="font-['DM_Sans'] text-lg font-bold">
            {steps[activeStep].title}
          </h3>
          <p className="max-w-[1100px] font-['DM_Sans'] text-base leading-normal text-white/90">
            {steps[activeStep].description}
          </p>
        </div>
      </div>
    </section>
  );
}
