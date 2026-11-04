import { Container, SectionHeading, Title } from '../../../shared/ui';
import { benefits } from '../content';

export default function BenefitsSection() {
  return (
    <section
      id='vantagens'
      aria-labelledby='vantagens-title'
      className='scroll-mt-6 bg-(--azul-escuro)'
    >
      <Container className='py-[42px] lg:min-h-[405px]'>
        <SectionHeading
          id='vantagens-title'
          eyebrow='PESSOAS REAIS. NECESSIDADES REAIS.'
          inverse
          className='lg:min-h-[72px] lg:justify-center'
          titleClassName='text-[clamp(1.75rem,2.639vw,2.375rem)]! leading-[44px]'
        >
          Por que anunciar no Iagora?
        </SectionHeading>
        <div className='mt-5 grid gap-6 sm:grid-cols-2 xl:grid-cols-4'>
          {benefits.map(benefit => (
            <article
              key={benefit.id}
              className='flex flex-col gap-5 rounded-[10px] bg-white px-[15px] py-5 lg:min-h-[220px]'
            >
              <div className='grid size-10 shrink-0 place-items-center'>
                <img src={benefit.icon} alt='' className='max-w-none' />
              </div>
              <Title
                as='h3'
                className='flex min-h-[42px] max-w-[276px] items-center font-body! text-2xl leading-[21px] font-bold text-(--azul-titulo)'
              >
                {benefit.title}
              </Title>
              <p className='max-w-[276px] text-xl leading-[19px] text-(--texto-apoio)'>
                {benefit.description}
              </p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
