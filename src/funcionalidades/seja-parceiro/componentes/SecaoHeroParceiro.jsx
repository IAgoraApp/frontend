import { Link } from 'react-router-dom';
import {
  Botao,
  Container,
  ArteResponsiva,
  Titulo,
} from '../../../compartilhado/indice';
import profissionalImg from '../../../ativos/imagens/fotografias/equipe-servicos.png';
import formaPessego from '../../../ativos/vetores/parceiro/forma-pessego.svg';
import acentosHero from '../../../ativos/vetores/parceiro/acentos-hero.svg';
import { categoriasServicos } from '../conteudo';

export default function SecaoHeroParceiro() {
  return (
    <section aria-labelledby='titulo-parceiro'>
      <Container classe='flex flex-col gap-10 pt-6 pb-10 lg:py-5'>
        <div className='grid items-center gap-8 lg:min-h-[540px] lg:grid-cols-[minmax(0,650fr)_minmax(0,470fr)] lg:gap-[clamp(2rem,8vw,8rem)]'>
          <div className='flex min-w-0 flex-col items-start justify-center gap-[15px] lg:min-h-[500px]'>
            <Titulo
              como='h1'
              id='titulo-parceiro'
              classe='text-[clamp(2rem,7vw,4.5rem)] leading-[1.06] font-extrabold tracking-[-0.035em] text-(--azul-titulo) lg:text-[clamp(2.5rem,5vw,4.5rem)]'
            >
              Seu serviço.
              <br />
              Mais pessoas
            </Titulo>
            <div className='flex h-[clamp(5rem,8.5vw,7.5rem)] w-full max-w-[644px] items-center justify-center'>
              <div className='w-[calc(100%-4px)] rotate-[3.29deg] bg-(--laranja-principal) px-[14px] py-[5px]'>
                <p className='font-titulo text-[clamp(2rem,4.7vw,4.25rem)] leading-[1.12] font-extrabold tracking-[-0.035em] text-white'>
                  Mais histórias
                </p>
              </div>
            </div>
            <p className='max-w-[610px] text-lg leading-[26px] text-(--texto-secundario) lg:text-xl'>
              Divulgue sua empresa no Iagora e conecte-se com pessoas que estão
              construindo sua independência.
            </p>
            <Botao
              como={Link}
              to='/empresa/cadastro'
              cor='laranja'
              classe='min-h-[52px] w-[230px] max-w-full px-4! text-xl font-bold!'
            >
              Quero anunciar
            </Botao>
          </div>

          <ArteResponsiva
            largura={470}
            altura={500}
            classe='mx-auto max-w-[470px]'
            role='img'
            aria-label='Profissional com ferramentas. Seu trabalho faz diferença em cada começo.'
          >
            <img
              src={formaPessego}
              alt=''
              className='absolute top-[42px] left-[62px] max-w-none'
            />
            <div className='absolute top-[66px] left-[90px] h-[340px] w-[310px] overflow-hidden rounded-lg'>
              <img
                src={profissionalImg}
                alt=''
                width='310'
                height='340'
                className='h-full w-full object-cover'
              />
              <span className='pointer-events-none absolute inset-0 rounded-lg border-8 border-white' />
            </div>
            <div className='absolute top-[43px] left-[270px] flex h-[124px] w-[198px] items-center justify-center'>
              <p className='flex h-[108px] w-[190px] -rotate-5 items-center rounded-[3px] bg-(--laranja-principal) px-[14px] py-3 font-titulo text-[17px] leading-5 font-extrabold text-white'>
                Seu trabalho faz diferença em cada começo
              </p>
            </div>
            <img
              src={acentosHero}
              alt=''
              className='absolute top-[170px] left-[399px] max-w-none'
            />
          </ArteResponsiva>
        </div>

        <nav
          aria-label='Categorias de serviços'
          className='grid grid-cols-2 gap-4 sm:grid-cols-3 lg:min-h-[140px] lg:grid-cols-6 lg:gap-7'
        >
          {categoriasServicos.map(categoria => (
            <a
              key={categoria.id}
              href='#categorias'
              className='flex min-h-[116px] flex-col items-center justify-center gap-2 rounded-xl text-center text-base leading-[21px] font-bold text-(--azul-titulo) hover:bg-(--azul-fundo) focus-visible:outline-2 focus-visible:outline-(--laranja-principal)'
            >
              <span className='grid size-[62px] place-items-center rounded-[18px] bg-[#fdebdd]'>
                <img src={categoria.icone} alt='' className='max-w-none' />
              </span>
              {categoria.titulo}
            </a>
          ))}
        </nav>
      </Container>
    </section>
  );
}
