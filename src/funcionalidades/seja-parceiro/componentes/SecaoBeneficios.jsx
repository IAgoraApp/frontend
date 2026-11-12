import { Container, CabecalhoSecao, Titulo } from '../../../compartilhado/indice';
import { beneficiosParceiro } from '../conteudo';

export default function SecaoBeneficios() {
  return (
    <section
      id='vantagens'
      aria-labelledby='titulo-vantagens'
      className='scroll-mt-6 bg-(--azul-titulo)'
    >
      <Container classe='py-[42px] lg:min-h-[405px]'>
        <CabecalhoSecao
          id='titulo-vantagens'
          sobretitulo='PESSOAS REAIS. NECESSIDADES REAIS.'
          inverso
          classe='lg:min-h-[72px] lg:justify-center'
          classeTitulo='text-[clamp(1.75rem,2.6vw,2.375rem)]! leading-[44px]'
        >
          Por que anunciar no Iagora?
        </CabecalhoSecao>
        <div className='mt-5 grid gap-6 sm:grid-cols-2 xl:grid-cols-4'>
          {beneficiosParceiro.map(beneficio => (
            <article
              key={beneficio.id}
              className='flex flex-col gap-5 rounded-[10px] bg-white px-[15px] py-5 lg:min-h-[220px]'
            >
              <div className='grid size-10 shrink-0 place-items-center'>
                <img src={beneficio.icone} alt='' className='max-w-none' />
              </div>
              <Titulo
                como='h3'
                classe='flex min-h-[42px] max-w-[276px] items-center font-corpo! text-2xl leading-[24px] font-bold text-(--azul-titulo)'
              >
                {beneficio.titulo}
              </Titulo>
              <p className='max-w-[276px] text-lg leading-[22px] text-(--texto-secundario)'>
                {beneficio.descricao}
              </p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
