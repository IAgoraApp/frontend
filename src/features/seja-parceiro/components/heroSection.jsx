import { Link } from 'react-router-dom';
import {
  Button,
  Container,
  ResponsiveArtwork,
  Title,
} from '../../../shared/ui';
import Profissional from '../assets/profissional-hero.png';
import Forma from '../assets/forma-pessego.svg';
import Acentos from '../assets/acentos-hero.svg';
import { serviceCategories } from '../content';

export default function HeroSection() {
  return (
    <section aria-labelledby='parceiro-title'>
      <Container className='flex flex-col gap-10 py-10 lg:py-5'>
        <div className='grid items-center gap-8 lg:min-h-[540px] lg:grid-cols-[minmax(0,650fr)_minmax(0,470fr)] lg:gap-[clamp(2rem,12.22vw,11rem)]'>
          <div className='flex min-w-0 flex-col items-start justify-center gap-[15px] lg:min-h-[500px]'>
            <Title
              as='h1'
              id='parceiro-title'
              className='text-[clamp(1.75rem,10vw,4.5rem)] leading-[1.05556] font-extrabold tracking-[-0.035em] text-(--azul-titulo) lg:text-[clamp(2.5rem,5vw,4.5rem)]'
            >
              Seu serviço.
              <br />
              Mais pessoas.
            </Title>
            <div className='flex h-[clamp(5rem,8.51vw,7.6595rem)] w-full max-w-[643.878px] items-center justify-center'>
              <div className='w-[calc(100%-4px)] rotate-[3.29deg] bg-(--laranja-principal) px-[14px] py-[5px]'>
                <p className='font-heading text-[clamp(2rem,4.722vw,4.25rem)] leading-[1.11765] font-extrabold tracking-[-0.035em] text-white'>
                  Mais histórias.
                </p>
              </div>
            </div>
            <p className='max-w-[610px] text-lg leading-[26px] text-(--texto-apoio) lg:text-xl'>
              Divulgue sua empresa no Iagora e conecte-se com pessoas que estão
              construindo sua independência.
            </p>
            <Button
              as={Link}
              to='/cadastro-empresa'
              color='laranja'
              className='min-h-[52px] w-[230px] max-w-full px-4! text-xl font-bold!'
            >
              Quero anunciar
            </Button>
          </div>
          <ResponsiveArtwork
            width={470}
            height={500}
            className='mx-auto max-w-[470px]'
            role='img'
            aria-label='Profissional com ferramentas. Seu trabalho faz diferença em cada começo.'
          >
            <img
              src={Forma}
              alt=''
              className='absolute top-[42px] left-[62px] max-w-none'
            />
            <div className='absolute top-[66px] left-[90px] h-[340px] w-[310px] overflow-hidden rounded-lg'>
              <img
                src={Profissional}
                alt=''
                width='310'
                height='340'
                className='h-full w-full object-cover'
              />
              <span className='pointer-events-none absolute inset-0 rounded-lg border-8 border-white' />
            </div>
            <div className='absolute top-[43.44px] left-[270px] flex h-[124.149px] w-[198.69px] items-center justify-center'>
              <p className='flex h-[108px] w-[190px] -rotate-5 items-center rounded-[3px] bg-(--laranja-principal) px-[14px] py-3 font-heading text-[17px] leading-5 font-extrabold text-white'>
                Seu trabalho faz diferença em cada começo.
              </p>
            </div>
            <img
              src={Acentos}
              alt=''
              className='absolute top-[170px] left-[399px] max-w-none'
            />
          </ResponsiveArtwork>
        </div>
        <nav
          aria-label='Categorias de serviços'
          className='grid grid-cols-2 gap-4 sm:grid-cols-3 lg:min-h-[140px] lg:grid-cols-6 lg:gap-[31.2px]'
        >
          {serviceCategories.map(category => (
            <a
              key={category.id}
              href='#categorias'
              className='flex min-h-[116px] flex-col items-center justify-center gap-2 rounded-xl text-center text-base leading-[21px] font-bold text-(--azul-titulo) hover:bg-(--azul-fundo) focus-visible:outline-2 focus-visible:outline-(--laranja-principal)'
            >
              <span className='grid size-[62px] place-items-center rounded-[18px] bg-[#fdebdd]'>
                <img src={category.icon} alt='' className='max-w-none' />
              </span>
              {category.title}
            </a>
          ))}
        </nav>
      </Container>
    </section>
  );
}
