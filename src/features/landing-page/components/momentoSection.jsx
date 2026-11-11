import { ArrowUpRight } from 'lucide-react';

export default function MomentoSection() {
  return (
    <section
      id='momento'
      className='w-full bg-[#102A43] px-6 py-12 text-white sm:px-12 lg:h-[500px] lg:px-[72px] lg:py-[30px]'
    >
      <div className='mx-auto flex h-full max-w-[1296px] flex-col justify-center gap-[18px]'>
        <div className='flex flex-col justify-center gap-[6px] lg:h-[66px]'>
          <span className="font-['DM_Sans'] text-[14px] font-bold tracking-[1px] sm:text-base">
            CADA CONQUISTA TEM SEU JEITO.
          </span>
          <h2 className="font-['Bricolage_Grotesque'] text-[30px] font-extrabold leading-tight sm:text-[34px] lg:text-[38px] lg:leading-[44px]">
            Em que momento você está?
          </h2>
        </div>

        <div className='grid w-full grid-cols-1 gap-6 lg:h-[300px] lg:grid-cols-2 lg:gap-6'>
          <a
            href='#como-funciona'
            className='group flex min-h-[250px] flex-col justify-center gap-[15px] rounded-[6px] bg-[#E03B00] px-6 py-5 text-white transition-colors hover:bg-[#c93600] lg:h-[300px]'
          >
            <span className="font-['DM_Sans'] text-[14px] font-bold sm:text-base">
              01 / ANTES DAS CHAVES
            </span>
            <h3 className="font-['Bricolage_Grotesque'] text-2xl font-extrabold leading-[28px]">
              Vou morar sozinho
            </h3>
            <p className="max-w-[580px] font-['DM_Sans'] text-base leading-[19px] sm:text-lg">
              Descubra quanto vai gastar e o que precisa fazer antes de pegar as
              chaves.
            </p>
            <span className="font-['DM_Sans'] text-lg font-bold sm:text-[20px]">
              Planejar minha mudança{' '}
              <ArrowUpRight className='ml-1 inline' size={18} />
            </span>
          </a>

          <a
            href='#funcionalidades'
            className='group flex min-h-[250px] flex-col justify-center gap-[15px] rounded-[6px] bg-white px-6 py-5 text-[#102A43] transition-colors hover:bg-[#f8fafc] lg:h-[300px]'
          >
            <span className="font-['DM_Sans'] text-[14px] font-bold sm:text-base">
              02 / JÁ VIVO NO MEU CANTO
            </span>
            <h3 className="font-['Bricolage_Grotesque'] text-2xl font-extrabold leading-[28px]">
              Já tenho meu canto
            </h3>
            <p className="max-w-[580px] font-['DM_Sans'] text-base leading-[19px] text-[#617385] sm:text-lg">
              Organize contas, tarefas e sua rotina para aproveitar tudo do seu
              jeito.
            </p>
            <span className="font-['DM_Sans'] text-lg font-bold sm:text-[20px]">
              Cuidar da minha rotina{' '}
              <ArrowUpRight className='ml-1 inline' size={18} />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
