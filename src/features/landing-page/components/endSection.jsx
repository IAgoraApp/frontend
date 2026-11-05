import { Title, Button, Container } from '../../../shared/ui';
import { ArrowUpRight } from 'lucide-react';

export default function EndSection() {
  return (
    <section className='bg-(--azul-fundo)'>
      <Container className='py-12 sm:py-20'>
        <Title as='h2' variant='pequenoLj'>
          Seu próximo capitulo
        </Title>
        <Title
          as='h2'
          variant='normal'
          className='text-5xl! sm:text-7xl! lg:text-9xl! mb-2'
        >
          O seu agora <br /> começa aqui.
        </Title>
        <p className='mb-5 text-lg sm:text-2xl'>
          Independência é uma grande conquista. Você pode aprender um pouco por
          vez.
        </p>
        <Button
          variant='solido'
          color='azul'
          className='bg-(--azul-escuro)! mb-10'
        >
          {' '}
          Começar agora <ArrowUpRight />
        </Button>
        <p>
          Explore primeiro. Crie sua conta quando quiser organizar sua rotina.
        </p>
      </Container>
    </section>
  );
}
