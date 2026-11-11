import { categories } from '../content';
import { useState } from 'react';

export default function RecursosSection() {
  const [activeTab, setActiveTab] = useState(categories[0].id);

  const currentCategory =
    categories.find(c => c.id === activeTab) || categories[0];

  return (
    <section
      id='funcionalidades'
      className='w-full border-b border-[#D6E0E8] bg-white px-6 py-12 sm:px-12 lg:h-[520px] lg:px-[72px] lg:py-6'
    >
      <div className='mx-auto flex h-full max-w-[1296px] flex-col justify-center gap-5'>
        <div className='flex flex-col gap-1'>
          <span className="font-['DM_Sans'] text-[14px] font-bold tracking-[1px] text-[#E03B00] sm:text-base">
            A VIDA REAL PEDE
          </span>
          <h2 className="font-['Bricolage_Grotesque'] text-[30px] font-extrabold leading-[1.1] text-[#102A43] sm:text-[34px] lg:text-[38px] lg:leading-[42px]">
            Sua casa tem muitas partes.
            <br />A ajuda também.
          </h2>
        </div>

        <div
          className='[scrollbar-width:none] [&::-webkit-scrollbar]:hidden flex items-center gap-[10px] overflow-x-auto pb-1'
          role='tablist'
          aria-label='Categorias de conteúdo'
        >
          {categories.map(cat => {
            const isActive = cat.id === activeTab;
            return (
              <button
                key={cat.id}
                type='button'
                onClick={() => setActiveTab(cat.id)}
                role='tab'
                aria-selected={isActive}
                className={`h-8 w-[170px] shrink-0 rounded-2xl px-3 font-['DM_Sans'] text-sm font-bold whitespace-nowrap transition-colors sm:text-base ${
                  isActive
                    ? 'bg-[#102A43] text-white'
                    : 'bg-[#F4F7F9] text-[#102A43] hover:bg-[#e4ebf0]'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        <div className='flex flex-col items-center gap-8 md:flex-row md:gap-9 lg:h-[270px]'>
          <div className='flex w-full shrink-0 justify-center md:w-[220px]'>
            <img
              src={currentCategory.image}
              alt={currentCategory.label}
              className='h-[220px] w-[180px] object-contain sm:w-[220px] lg:h-[270px]'
            />
          </div>

          <div className='flex max-w-[720px] flex-col items-start gap-[15px]'>
            <span className="font-['DM_Sans'] text-[14px] font-bold tracking-[1px] text-[#E03B00] sm:text-base">
              {currentCategory.badge}
            </span>
            <h3 className="font-['Bricolage_Grotesque'] text-2xl font-extrabold leading-[32px] text-[#102A43] sm:text-[30px]">
              {currentCategory.title}
            </h3>
            <p className="font-['DM_Sans'] text-base leading-5 text-[#617385] sm:text-lg">
              {currentCategory.description}
            </p>
            <a
              href='#como-funciona'
              className="flex h-[42px] w-[190px] items-center justify-center rounded-[21px] bg-[#E03B00] font-['DM_Sans'] text-base font-bold text-white transition-colors hover:bg-[#c43300] sm:text-[20px]"
            >
              {currentCategory.cta}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
