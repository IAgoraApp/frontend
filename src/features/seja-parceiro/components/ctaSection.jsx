import { Link } from 'react-router-dom';
import { Button, Container, SectionHeading } from '../../../shared/ui';
import Profissional from '../assets/profissional-cta.png';

export default function CtaSection() {
  return (
    <section aria-labelledby='anunciar-title' className='bg-(--azul-escuro)'>
      <Container className='grid items-center gap-8 py-7 md:grid-cols-[minmax(0,350fr)_minmax(0,720fr)] lg:flex lg:min-h-[316px] lg:gap-14'>
        <img
          src={Profissional}
          alt='Profissional de serviços em sua oficina'
          width='350'
          height='260'
          className='aspect-[350/260] w-full max-w-[350px] rounded-lg object-cover lg:h-[260px] lg:shrink-0'
        />
        <div className='flex min-w-0 flex-col items-start gap-[15px] lg:min-h-[250px] lg:max-w-[720px] lg:justify-center'>
          <SectionHeading
            id='anunciar-title'
            eyebrow='FAÇA PARTE DO IAGORA'
            inverse
            className='gap-[15px]'
            eyebrowClassName='text-[#fdebdd]! tracking-[1px]'
            titleClassName='text-[clamp(1.75rem,2.639vw,2.375rem)]! leading-[43px]'
          >
            Seu serviço pode transformar
            <br className='hidden lg:block' /> novos começos.
          </SectionHeading>
          <p className='max-w-[680px] text-base leading-[23px] text-white'>
            Conte com uma plataforma feita para conectar bons profissionais a
            pessoas que estão construindo sua independência.
          </p>
          <Button
            as={Link}
            to='/cadastro-empresa'
            color='laranja'
            className='min-h-12 w-[250px] max-w-full px-4! text-[17px] font-bold!'
          >
            Quero anunciar agora
          </Button>
        </div>
      </Container>
    </section>
  );
}
