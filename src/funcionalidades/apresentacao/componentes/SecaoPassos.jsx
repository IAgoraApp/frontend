import { useState } from 'react';
import { passosInicio } from '../conteudo';

export default function SecaoPassos() {
  const [passoAtivo, setPassoAtivo] = useState(0);

  return (
    <section
      id='como-funciona'
      className='w-full bg-(--laranja-principal) px-6 py-10 text-white sm:px-12 lg:h-[300px] lg:px-[72px] lg:py-[18px]'
    >
      <div className='mx-auto flex h-full max-w-[1296px] flex-col justify-center gap-[15px]'>
        <div className='flex flex-col gap-1'>
          <span className='font-corpo text-[14px] font-bold tracking-[1px] sm:text-base'>
            TRÊS PASSOS, UM NOVO COMEÇO.
          </span>
          <h2 className='font-titulo text-[28px] leading-[38px] font-extrabold sm:text-[34px]'>
            Da primeira chave ao seu dia a dia.
          </h2>
        </div>

        <div className='grid w-full grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-[18px] lg:h-[41px]'>
          {passosInicio.map((passo, indice) => {
            const ativo = indice === passoAtivo;
            return (
              <button
                key={passo.numero}
                type='button'
                onClick={() => setPassoAtivo(indice)}
                className={`flex h-[41px] cursor-pointer items-center rounded-2xl px-[14px] font-corpo text-base font-bold transition-colors ${
                  ativo
                    ? 'bg-white text-(--azul-titulo)'
                    : 'bg-(--azul-titulo) text-white hover:bg-[#0c1f32]'
                }`}
              >
                <span>{passo.aba}</span>
              </button>
            );
          })}
        </div>

        <div className='flex flex-col justify-center gap-1 lg:h-[62px]'>
          <h3 className='font-corpo text-lg font-bold'>
            {passosInicio[passoAtivo].titulo}
          </h3>
          <p className='max-w-[1100px] font-corpo text-base leading-normal text-white/90'>
            {passosInicio[passoAtivo].descricao}
          </p>
        </div>
      </div>
    </section>
  );
}
