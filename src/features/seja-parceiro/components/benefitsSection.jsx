import { Container } from '../../../shared/index';
import { beneficiosParceiro } from '../content';

export default function SecaoBeneficios() {
  return (
    <section
      id='vantagens'
      aria-labelledby='titulo-vantagens'
      className='bg-(--azul-titulo) py-8 text-white sm:py-11'
    >
      <Container>
        <h2
          id='titulo-vantagens'
          data-entrada=''
          className='mb-4 text-3xl font-extrabold tracking-tight sm:text-4xl'
        >
          O que seu anúncio pode fazer
        </h2>
        <ul className='grid gap-x-5 gap-y-3 sm:grid-cols-2 xl:grid-cols-4'>
          {beneficiosParceiro.map(({ id, icone, titulo, descricao }) => (
            <li
              key={id}
              data-entrada=''
              className='grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 border-t border-white/25 pt-3'
            >
              <img
                src={icone}
                alt=''
                className='row-span-2 size-8 object-contain'
              />
              <h3 className='text-lg leading-tight font-extrabold'>{titulo}</h3>
              <p className='mt-1 text-sm leading-relaxed text-white/80'>
                {descricao}
              </p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
