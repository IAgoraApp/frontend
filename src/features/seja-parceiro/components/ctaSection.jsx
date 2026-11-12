import { Link } from 'react-router-dom';
import { Botao, Container, CabecalhoSecao } from '../../../shared/index';
import profissionalCtaImg from '../assets/profissional-cta.png';

export default function SecaoChamada() {
  return (
    <section
      aria-labelledby='titulo-anunciar'
      className='bg-(--azul-titulo)'
    >
      <Container classe='grid items-center gap-8 py-7 md:grid-cols-[minmax(0,350fr)_minmax(0,720fr)] lg:flex lg:min-h-[316px] lg:gap-14'>
        <img
          src={profissionalCtaImg}
          alt='Profissional de serviços em sua oficina'
          width='350'
          height='260'
          className='aspect-[350/260] w-full max-w-[350px] rounded-lg object-cover lg:h-[260px] lg:shrink-0'
        />
        <div className='flex min-w-0 flex-col items-start gap-[15px] lg:min-h-[250px] lg:max-w-[720px] lg:justify-center'>
          <CabecalhoSecao
            id='titulo-anunciar'
            sobretitulo='FAÇA PARTE DO IAGORA'
            inverso
            classe='gap-[15px]'
            classeSobretitulo='text-[#fdebdd]! tracking-[1px]'
            classeTitulo='text-[clamp(1.75rem,2.6vw,2.375rem)]! leading-[43px]'
          >
            Seu serviço pode transformar
            <br className='hidden lg:block' /> novos começos.
          </CabecalhoSecao>
          <p className='max-w-[680px] text-base leading-[23px] text-white'>
            Conte com uma plataforma feita para conectar bons profissionais a
            pessoas que estão construindo sua independência.
          </p>
          <Botao
            como={Link}
            to='/empresa/cadastro'
            cor='laranja'
            classe='min-h-12 w-[250px] max-w-full px-4! text-[17px] font-bold!'
          >
            Quero anunciar agora
          </Botao>
        </div>
      </Container>
    </section>
  );
}
