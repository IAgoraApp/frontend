import { Container } from '../../../shared/index';
import { duvidasFrequentesParceiro } from '../content';

export default function SecaoPerguntasParceiro() {
  return (
    <section
      id='perguntas-frequentes'
      aria-labelledby='titulo-perguntas'
      className='scroll-mt-6 bg-(--azul-fundo) py-8 sm:py-12'
    >
      <Container>
        <h2
          id='titulo-perguntas'
          data-entrada=''
          className='mb-4 text-3xl font-extrabold tracking-tight sm:text-4xl'
        >
          Antes de anunciar
        </h2>
        <dl className='grid gap-px overflow-hidden rounded-xl border border-(--borda-suave) bg-(--borda-suave) md:grid-cols-2'>
          {duvidasFrequentesParceiro.map(({ id, pergunta, resposta }) => (
            <div
              key={id}
              data-entrada=''
              className='grid content-start gap-2 bg-white p-4 sm:p-5'
            >
              <dt className='font-titulo text-lg font-extrabold'>{pergunta}</dt>
              <dd className='text-sm leading-relaxed text-(--texto-apoio) sm:text-base'>
                {resposta}
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
