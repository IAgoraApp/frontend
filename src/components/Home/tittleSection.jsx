import { ArrowUpRight } from 'lucide-react';
import { Title, Button } from '../ui';

export default function TittleSection() {
  return (
    <section className='flex justify-between py-4 items-center'>
      <Title variant='normal' as='h1'>
        Olá Débora! O que vamos resolver hoje?
      </Title>

      <div className='flex bg-(--azul-fundo) p-2 w-90 justify-between items-center'>
        <div>
          <Title as='h2' variant='pequenoLj'>
            Seu momento
          </Title>
          <p className='font-semibold'>Vou morar sozinho</p>
        </div>
        <Button variant='link' color='laranja'>Alterar</Button>
      </div>
    </section>
  );
}
