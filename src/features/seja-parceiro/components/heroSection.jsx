import { ArrowUpRight, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Botao, Container } from '../../../shared/index';
import profissionalImg from '../../empresa/assets/ServiceCover.png';

export default function SecaoHeroParceiro() {
  return (
    <section
      aria-labelledby='titulo-parceiro'
      className='bg-(--azul-fundo) py-8 sm:py-13'
    >
      <Container classe='grid items-center gap-6 md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-14'>
        <div data-entrada='' className='grid justify-items-start gap-4'>
          <h1
            id='titulo-parceiro'
            className='max-w-[16ch] text-[clamp(2.45rem,5.2vw,4.85rem)] leading-[1.01] font-extrabold tracking-[-0.045em]'
          >
            Anuncie seu serviço para quem precisa dele
          </h1>
          <p className='max-w-[46ch] text-base leading-relaxed text-(--texto-apoio) sm:text-lg'>
            Mostre seu trabalho, indique onde atende e combine os detalhes
            diretamente com seus clientes no IAgora.
          </p>
          <Botao como={Link} to='/empresa/cadastro'>
            Cadastrar empresa{' '}
            <ArrowUpRight className='ml-2' size={17} aria-hidden='true' />
          </Botao>
        </div>
        <figure
          data-entrada=''
          className='grid min-w-0 overflow-hidden rounded-2xl bg-(--azul-titulo) text-white'
        >
          <img
            src={profissionalImg}
            alt='Profissional de manutenção com ferramentas'
            className='aspect-[16/8] w-full object-cover object-[center_30%]'
          />
          <figcaption className='grid gap-1 p-4 sm:p-5'>
            <p className='text-xs font-bold text-[#ffd7c4]'>
              Exemplo de anúncio
            </p>
            <p className='font-titulo text-xl font-extrabold sm:text-2xl'>
              Manutenção residencial
            </p>
            <p className='flex items-center gap-1.5 text-sm text-white/90'>
              <MapPin size={15} aria-hidden='true' /> Informe sua região de
              atendimento
            </p>
          </figcaption>
        </figure>
      </Container>
    </section>
  );
}
