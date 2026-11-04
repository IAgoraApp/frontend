import { Link } from 'react-router-dom';
import { Container, SectionHeading, Title } from '../../../shared/ui';
import { steps } from '../content';

export default function StepsSection() {
  return (
    <section
      id='como-funciona'
      aria-labelledby='como-funciona-title'
      className='scroll-mt-6 bg-(--laranja-principal)'
    >
      <Container className='py-[45px] lg:min-h-[288px]'>
        <SectionHeading
          id='como-funciona-title'
          eyebrow='COMO FUNCIONA'
          inverse
          className='gap-1 lg:h-16 lg:justify-center'
        >
          Anunciar é simples.
        </SectionHeading>
        <div className='mt-[18px] grid gap-[17px] lg:grid-cols-3'>
          {steps.map((step, index) => (
            <article
              key={step.id}
              className='flex min-w-0 items-center gap-[14px] rounded-lg bg-white px-[18px] py-4 lg:min-h-[116px]'
            >
              <div className='grid size-[42px] shrink-0 place-items-center'>
                <img src={step.icon} alt='' className='max-w-none' />
              </div>
              <div className='flex min-w-0 flex-col gap-[15px]'>
                <Title
                  as='h3'
                  className='font-body! text-xl leading-[22px] font-bold whitespace-pre-wrap text-(--azul-titulo)'
                >
                  {index === 0 ? (
                    <Link to='/cadastro-empresa' className='hover:underline'>
                      {step.title}
                    </Link>
                  ) : (
                    step.title
                  )}
                </Title>
                <p className='text-[18px] leading-[18px] text-(--texto-apoio) lg:min-h-9'>
                  {step.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
