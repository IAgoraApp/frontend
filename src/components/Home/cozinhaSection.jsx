import Prato from '../../assets/images/prato.png';
import { Title, Button } from '../ui';
import { Link } from 'react-router-dom';

export default function CozinhaSection() {
  return (
    <section className='w-full bg-white'>
      <img
        src={Prato}
        alt='Prato de comida para inspirar sua próxima refeição'
        className='w-full max-h-60 object-cover rounded-lg'
      />
      <Title variant='pequenoLj' as='h3' className='mt-2 mb-3'>
        Para seu dia a dia
      </Title>
      <Title variant='normal' as='h2' className='mb-5'>
        Receitas com o que você tem.
      </Title>
      <p className='text-(--texto-claro)'>
        Ideias simples para as refeições do dia a dia.
      </p>
      <Button
        as={Link}
        to='/cozinha'
        variant='link'
        color='laranja'
        className='mt-2 mb-8'
      >
        Explorar cozinha
      </Button>
    </section>
  );
}
