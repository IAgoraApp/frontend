import { Sections } from './components';
import Imagem from './assets/Imagem.png';
import Vetor from './assets/Vetor.png';

export default function Auth() {
  return (
    <main className='relative isolate min-h-dvh w-full overflow-x-clip bg-white [@media(width>=1024px)_and_(height>=640px)]:grid [@media(width>=1024px)_and_(height>=640px)]:grid-cols-[minmax(0,1fr)_44%]'>
      <div className='flex min-h-dvh min-w-0 justify-center px-[max(1rem,env(safe-area-inset-left),env(safe-area-inset-right))] pt-[max(1.5rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-[clamp(1.5rem,5vw,6rem)]'>
        <Sections.CampoSection />
      </div>

      <div
        className='relative hidden min-w-0 [@media(width>=1024px)_and_(height>=640px)]:block'
        aria-hidden='true'
      >
        <img
          className='absolute inset-y-[clamp(1rem,2vw,2rem)] right-[clamp(1rem,2vw,2rem)] h-[calc(100%-clamp(2rem,4vw,4rem))] w-[calc(100%-clamp(1rem,2vw,2rem))] rounded-2xl object-cover'
          src={Imagem}
          alt=''
        />
      </div>

      <div
        className='pointer-events-none absolute inset-0 -z-10 overflow-hidden'
        aria-hidden='true'
      >
        <img
          src={Vetor}
          className='absolute right-0 -bottom-10 h-auto w-full'
          alt=''
        />
      </div>
    </main>
  );
}
