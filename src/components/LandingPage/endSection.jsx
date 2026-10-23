import { Title, Button } from '../ui';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function EndSection() {
  return (
    <section className='px-30 py-20 bg-(--azul-fundo)'>
      <Title as='h2' variant='pequenoLj'>
        Seu próximo capitulo
      </Title>
      <Title as='h2' variant='normal' className='text-9xl mb-2'>
        O seu agora <br /> começa aqui.
      </Title>
      <p className='mb-5 text-2xl'>
        Independência é uma grande conquista. Você pode aprender um pouco por
        vez.
      </p>
      <Button
        as={Link}
        to='/cadastro'
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
    </section>
  );
}
