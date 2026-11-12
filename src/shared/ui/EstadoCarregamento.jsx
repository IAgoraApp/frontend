import fechoCarteira from '../../features/calculadoras/assets/fecho-carteira.svg';
import moedaGrande from '../../features/calculadoras/assets/moeda-grande.svg';
import moedaMedia from '../../features/calculadoras/assets/moeda-media.svg';
import moedaPequena from '../../features/calculadoras/assets/moeda-pequena.svg';

export function EstadoCarregamento({
  titulo = 'Organizando tudo para você',
  descricao = 'Carregando os dados e orientações desta área.',
}) {
  return (
    <div
      role='status'
      aria-live='polite'
      className='flex min-h-[320px] flex-col items-center justify-center gap-5 rounded-2xl border border-[#dbe5ed] bg-[#f4f7fa] px-6 py-12 text-center'
    >
      <div className='relative flex h-24 w-28 items-center justify-center'>
        <div className='relative flex h-14 w-20 items-center justify-center rounded-xl bg-[#102a43] shadow-sm'>
          <img src={fechoCarteira} alt='' className='h-5 w-6' />
        </div>
        <img
          src={moedaGrande}
          alt=''
          className='animar-moeda absolute -top-2 left-2 h-8 w-8'
        />
        <img
          src={moedaMedia}
          alt=''
          className='animar-moeda absolute -top-3 right-3 h-7 w-7 [animation-delay:0.25s]'
        />
        <img
          src={moedaPequena}
          alt=''
          className='animar-moeda absolute top-1 right-10 h-5 w-5 [animation-delay:0.5s]'
        />
      </div>
      <div className='space-y-1.5'>
        <h2 className='font-titulo text-2xl font-extrabold text-(--azul-titulo)'>
          {titulo}
        </h2>
        <p className='max-w-md text-base text-(--texto-apoio)'>{descricao}</p>
      </div>
      <div className='w-full max-w-md space-y-2.5 pt-2'>
        <div className='animar-pulsar h-3.5 w-full rounded-full bg-[#dbe5ed]' />
        <div className='animar-pulsar h-3.5 w-4/5 rounded-full bg-[#dbe5ed] [animation-delay:0.2s]' />
        <div className='animar-pulsar mx-auto h-3.5 w-3/5 rounded-full bg-[#dbe5ed] [animation-delay:0.4s]' />
      </div>
    </div>
  );
}
