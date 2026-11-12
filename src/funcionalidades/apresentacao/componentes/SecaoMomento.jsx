import { ArrowUpRight } from 'lucide-react';

export default function SecaoMomento() {
  return (
    <section
      id='momento'
      className='w-full bg-(--azul-titulo) px-6 py-12 text-white sm:px-12 lg:h-[500px] lg:px-[72px] lg:py-[30px]'
    >
      <div className='mx-auto flex h-full max-w-[1296px] flex-col justify-center gap-[18px]'>
        <div className='flex flex-col justify-center gap-[6px] lg:h-[66px]'>
          <span className='font-corpo text-[14px] font-bold tracking-[1px] sm:text-base'>
            CADA CONQUISTA TEM SEU JEITO.
          </span>
          <h2 className='font-titulo text-[30px] leading-tight font-extrabold sm:text-[34px] lg:text-[38px] lg:leading-[44px]'>
            Em que momento você está?
          </h2>
        </div>

        <div className='grid w-full grid-cols-1 gap-6 lg:h-[300px] lg:grid-cols-2 lg:gap-6'>
          <a
            href='#como-funciona'
            className='group flex min-h-[250px] flex-col justify-center gap-[15px] rounded-[6px] bg-(--laranja-principal) px-6 py-5 text-white transition-colors hover:bg-[#c93600] lg:h-[300px]'
          >
            <span className='font-corpo text-[14px] font-bold sm:text-base'>
              01 / ANTES DAS CHAVES
            </span>
            <h3 className='font-titulo text-2xl leading-[28px] font-extrabold'>
              Vou morar sozinho
            </h3>
            <p className='max-w-[580px] font-corpo text-base leading-[19px] sm:text-lg'>
              Descubra quanto vai gastar e o que precisa fazer antes de pegar as
              chaves.
            </p>
            <span className='font-corpo text-lg font-bold sm:text-[20px]'>
              Planejar minha mudança{' '}
              <ArrowUpRight className='ml-1 inline' size={18} />
            </span>
          </a>

          <a
            href='#funcionalidades'
            className='group flex min-h-[250px] flex-col justify-center gap-[15px] rounded-[6px] bg-white px-6 py-5 text-(--azul-titulo) transition-colors hover:bg-[#f8fafc] lg:h-[300px]'
          >
            <span className='font-corpo text-[14px] font-bold sm:text-base'>
              02 / JÁ VIVO NO MEU CANTO
            </span>
            <h3 className='font-titulo text-2xl leading-[28px] font-extrabold'>
              Já tenho meu canto
            </h3>
            <p className='max-w-[580px] font-corpo text-base leading-[19px] text-(--texto-secundario) sm:text-lg'>
              Organize contas, tarefas e sua rotina para aproveitar tudo do seu
              jeito.
            </p>
            <span className='font-corpo text-lg font-bold sm:text-[20px]'>
              Cuidar da minha rotina{' '}
              <ArrowUpRight className='ml-1 inline' size={18} />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
