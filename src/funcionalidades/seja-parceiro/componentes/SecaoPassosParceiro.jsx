import { Link } from 'react-router-dom';
import { Container, CabecalhoSecao, Titulo } from '../../../compartilhado/indice';
import { passosParceiro } from '../conteudo';

export default function SecaoPassosParceiro() {
  return (
    <section
      id='como-funciona'
      aria-labelledby='titulo-como-funciona'
      className='scroll-mt-6 bg-(--laranja-principal)'
    >
      <Container classe='py-[45px] lg:min-h-[288px]'>
        <CabecalhoSecao
          id='titulo-como-funciona'
          sobretitulo='COMO FUNCIONA'
          inverso
          classe='gap-1 lg:h-16 lg:justify-center'
        >
          Anunciar é simples.
        </CabecalhoSecao>
        <div className='mt-[18px] grid gap-[17px] lg:grid-cols-3'>
          {passosParceiro.map((passo, indice) => (
            <article
              key={passo.id}
              className='flex min-w-0 items-center gap-[14px] rounded-lg bg-white px-[18px] py-4 lg:min-h-[116px]'
            >
              <div className='grid size-[42px] shrink-0 place-items-center'>
                <img src={passo.icone} alt='' className='max-w-none' />
              </div>
              <div className='flex min-w-0 flex-col gap-2'>
                <Titulo
                  como='h3'
                  classe='font-corpo! text-xl leading-[22px] font-bold whitespace-pre-wrap text-(--azul-titulo)'
                >
                  {indice === 0 ? (
                    <Link to='/empresa/cadastro' className='hover:underline'>
                      {passo.titulo}
                    </Link>
                  ) : (
                    passo.titulo
                  )}
                </Titulo>
                <p className='text-[17px] leading-[21px] text-(--texto-secundario)'>
                  {passo.descricao}
                </p>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
