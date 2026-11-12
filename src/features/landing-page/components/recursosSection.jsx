import { useState } from 'react';
import { Link } from 'react-router-dom';
import { categoriasRecursos } from '../content';

export default function SecaoRecursos() {
  const [abaAtiva, setAbaAtiva] = useState(categoriasRecursos[0].id);

  const categoriaAtual =
    categoriasRecursos.find(item => item.id === abaAtiva) ||
    categoriasRecursos[0];

  return (
    <section
      id='funcionalidades'
      className='w-full border-b border-[#D6E0E8] bg-white px-6 py-12 sm:px-12 lg:h-[520px] lg:px-[72px] lg:py-6'
    >
      <div className='mx-auto flex h-full max-w-[1296px] flex-col justify-center gap-5'>
        <div className='flex flex-col gap-1'>
          <span className='font-corpo text-[14px] font-bold tracking-[1px] text-(--laranja-principal) sm:text-base'>
            A VIDA REAL PEDE
          </span>
          <h2 className='font-titulo text-[30px] leading-[1.1] font-extrabold text-(--azul-titulo) sm:text-[34px] lg:text-[38px] lg:leading-[42px]'>
            Sua casa tem muitas partes.
            <br />A ajuda também.
          </h2>
        </div>

        <div
          className='flex items-center gap-[10px] overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'
          role='tablist'
          aria-label='Categorias de conteúdo'
        >
          {categoriasRecursos.map(categoria => {
            const selecionada = categoria.id === abaAtiva;
            return (
              <button
                key={categoria.id}
                type='button'
                onClick={() => setAbaAtiva(categoria.id)}
                role='tab'
                aria-selected={selecionada}
                className={`h-8 w-[170px] shrink-0 cursor-pointer rounded-2xl px-3 font-corpo text-sm font-bold whitespace-nowrap transition-colors sm:text-base ${
                  selecionada
                    ? 'bg-(--azul-titulo) text-white'
                    : 'bg-[#F4F7F9] text-(--azul-titulo) hover:bg-[#e4ebf0]'
                }`}
              >
                {categoria.rotulo}
              </button>
            );
          })}
        </div>

        <div className='flex flex-col items-center gap-8 md:flex-row md:gap-9 lg:h-[270px]'>
          <div className='flex w-full shrink-0 justify-center md:w-[220px]'>
            <img
              src={categoriaAtual.imagem}
              alt={categoriaAtual.rotulo}
              className='h-[220px] w-[180px] object-contain sm:w-[220px] lg:h-[270px]'
            />
          </div>

          <div className='flex max-w-[720px] flex-col items-start gap-[15px]'>
            <span className='font-corpo text-[14px] font-bold tracking-[1px] text-(--laranja-principal) sm:text-base'>
              {categoriaAtual.selo}
            </span>
            <h3 className='font-titulo text-2xl leading-[32px] font-extrabold text-(--azul-titulo) sm:text-[30px]'>
              {categoriaAtual.titulo}
            </h3>
            <p className='font-corpo text-base leading-5 text-(--texto-secundario) sm:text-lg'>
              {categoriaAtual.descricao}
            </p>
            <Link
              to={categoriaAtual.rota}
              className='flex h-[42px] w-[190px] items-center justify-center rounded-[21px] bg-(--laranja-principal) font-corpo text-base font-bold text-white transition-colors hover:bg-[#c43300] sm:text-[18px]'
            >
              {categoriaAtual.chamada}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
