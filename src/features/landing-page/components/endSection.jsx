import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Container } from '../../../shared/ui';

export default function SecaoEncerramento() {
  return (
    <section
      aria-labelledby='titulo-acessar-plataforma'
      className='bg-(--azul-escuro) py-10 text-white sm:py-16'
    >
      <Container classe='grid items-center gap-6 md:grid-cols-[minmax(0,1fr)_auto]'>
        <div className='grid gap-2' data-entrada=''>
          <h2
            id='titulo-acessar-plataforma'
            className='text-3xl leading-tight font-extrabold tracking-tight sm:text-5xl'
          >
            Seu canto começa aqui
          </h2>
          <p className='max-w-[46ch] text-base text-white/85 sm:text-lg'>
            Da primeira chave às tarefas de todo dia, organize sua casa no seu
            ritmo.
          </p>
        </div>
        <Link
          to='/login'
          className='inline-flex min-h-12 w-fit items-center gap-2 rounded-full bg-(--laranja-principal) px-5 font-bold text-white hover:bg-[#c43300] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white'
        >
          Acessar plataforma <ArrowRight size={18} aria-hidden='true' />
        </Link>
      </Container>
    </section>
  );
}
