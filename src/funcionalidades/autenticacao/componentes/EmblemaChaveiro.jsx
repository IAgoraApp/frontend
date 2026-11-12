import chaveiroImg from '../../../ativos/imagens/ilustracoes/autenticacao-chaveiro.png';

export function EmblemaChaveiro() {
  return (
    <div
      aria-hidden='true'
      className='relative mx-auto flex size-[320px] items-center justify-center sm:size-[420px] xl:size-[470px]'
    >
      <div className='size-[82%] rounded-full bg-(--laranja-principal) shadow-md' />
      <img
        src={chaveiroImg}
        alt=''
        className='pointer-events-none absolute top-[6%] w-[78%] object-contain drop-shadow-[0_18px_28px_rgba(16,42,67,0.18)]'
      />
      <div className='absolute right-[2%] bottom-[13%] rotate-[2.5deg] rounded-[3px] bg-(--azul-titulo) px-6 py-3 shadow-md'>
        <p className='text-xs font-bold tracking-[0.9px] whitespace-nowrap text-white uppercase sm:text-sm'>
          A SUA JORNADA COMEÇA AQUI
        </p>
      </div>
    </div>
  );
}
