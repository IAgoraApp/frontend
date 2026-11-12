import { Acordeao, Container, CabecalhoSecao } from '../../../shared/index';
import { duvidasFrequentesParceiro } from '../content';

export default function SecaoPerguntasParceiro() {
  return (
    <section
      id='perguntas-frequentes'
      aria-labelledby='titulo-perguntas'
      className='scroll-mt-6 bg-white'
    >
      <Container classe='py-11 lg:min-h-[302px]'>
        <CabecalhoSecao
          id='titulo-perguntas'
          sobretitulo='DÚVIDAS FREQUENTES'
          classe='lg:h-[60px] lg:justify-center'
        >
          Tudo o que você precisa saber.
        </CabecalhoSecao>
        <div className='mt-4 grid items-start gap-[18px] lg:min-h-[138px] lg:grid-cols-2'>
          <Acordeao itens={duvidasFrequentesParceiro.slice(0, 2)} />
          <Acordeao itens={duvidasFrequentesParceiro.slice(2)} />
        </div>
      </Container>
    </section>
  );
}
