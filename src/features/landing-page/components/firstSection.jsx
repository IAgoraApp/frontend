import { Title, Button, Container } from '../../../shared/ui';
import { ArrowUpRight } from 'lucide-react';

export default function FirstSection() {
  return (
    <Container
      as='section'
      className='mt-6 mb-16 flex flex-col items-center text-center sm:mt-12 sm:mb-30'
    >
      <Title as='h2' variant='pequenoLj'>
        Independência se aprende vivendo
      </Title>
      <h1 className='max-w-full text-[clamp(2.25rem,8.8vw,8rem)] font-heading text-(--azul-titulo) font-bold'>
        Quero morar sozinho
      </h1>

      <div className='bg-(--laranja-principal) max-w-full w-fit px-6 sm:px-12 lg:px-20 rotate-4 mt-5 mb-5 hover:rotate-0 transition-all duration-300'>
        <p className='text-[clamp(2.25rem,8.8vw,8rem)] font-heading text-white font-bold'>
          I agora?
        </p>
      </div>

      <p className='text-center'>
        Da primeira conta à comida de hoje: um lugar para aprender a <br />{' '}
        cuidar da casa e de você.
      </p>

      <Button
        variant='solido'
        color='laranja'
        className='mt-5 max-w-full font-bold px-8 sm:px-20 text-xl sm:text-2xl'
      >
        Bora lá <ArrowUpRight />
      </Button>
    </Container>
  );
}
