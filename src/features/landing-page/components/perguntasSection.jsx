import { Container } from '../../../shared/ui';
import { perguntasFrequentes } from '../content';

export default function SecaoPerguntas() {
  return (
    <section
      id='perguntas-frequentes'
      aria-labelledby='titulo-perguntas-frequentes'
      className='bg-(--azul-fundo) py-7 lg:py-9'
    >
      <Container classe='grid gap-4 lg:gap-5'>
        <h2
          id='titulo-perguntas-frequentes'
          data-entrada=''
          className='font-titulo text-3xl leading-tight font-extrabold tracking-tight text-(--azul-titulo) lg:text-4xl'
        >
          Antes de começar
        </h2>
        <dl className='grid gap-px overflow-hidden rounded-xl border border-(--borda-suave) bg-(--borda-suave) md:grid-cols-3'>
          {perguntasFrequentes.map(({ id, pergunta, resposta }) => (
            <div
              key={id}
              data-entrada=''
              className='grid content-start gap-1.5 bg-white p-4 lg:p-5'
            >
              <dt className='font-titulo text-lg font-extrabold text-(--azul-titulo)'>
                {pergunta}
              </dt>
              <dd className='max-w-[70ch] text-sm leading-relaxed text-(--texto-apoio) sm:text-base'>
                {resposta}
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
