import { Link } from 'react-router-dom';
import { Container } from '../../../shared/index';
import { categoriasDestaque } from '../content';

export default function SecaoCategorias() {
  return (
    <section
      id='categorias'
      aria-labelledby='titulo-categorias'
      className='scroll-mt-6 bg-white py-8 sm:py-12'
    >
      <Container>
        <h2
          id='titulo-categorias'
          data-entrada=''
          className='mb-5 text-3xl font-extrabold tracking-tight sm:text-4xl'
        >
          Serviços que fazem a casa funcionar
        </h2>
        <ul className='grid gap-3 sm:grid-cols-2 lg:grid-cols-5'>
          {categoriasDestaque.map(({ id, titulo, descricao, imagem }) => (
            <li key={id} data-entrada='' className='min-w-0'>
              <Link
                to='/empresa/cadastro'
                className='block h-full overflow-hidden rounded-xl border border-(--borda-suave) hover:border-(--laranja-principal) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--azul-principal)'
                aria-label={`Cadastrar empresa para anunciar ${titulo}`}
              >
                <img
                  src={imagem}
                  alt=''
                  loading='lazy'
                  className='aspect-[16/8] w-full object-cover'
                />
                <div className='grid gap-1 p-3'>
                  <h3 className='text-xl font-extrabold'>{titulo}</h3>
                  <p className='text-sm text-(--texto-apoio)'>{descricao}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
