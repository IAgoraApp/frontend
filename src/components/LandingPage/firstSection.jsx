import { Title, Button } from '../ui';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FirstSection() {
  return (
    <section className='flex flex-col items-center my-30'>
      <Title as='h2' variant='pequenoLj'>
        Independência se aprende vivendo
      </Title>
      <h1 className='text-9xl font-heading text-(--azul-titulo) font-bold'>
        Quero morar sozinho
      </h1>

      <div className='bg-(--laranja-principal) w-fit px-20 rotate-4 mt-5 mb-5 hover:rotate-0 transition-all duration-300'>
        <p className='text-9xl font-heading text-white font-bold'>I agora?</p>
      </div>

      <p className='text-center'>
        Da primeira conta à comida de hoje: um lugar para aprender a <br />{' '}
        cuidar da casa e de você.
      </p>

      <Button
        as={Link}
        to='/cadastro'
        variant='solido'
        color='laranja'
        className='mt-5 font-bold px-20 text-2xl'
      >
        Bora lá <ArrowUpRight />
      </Button>
    </section>
  );
}
