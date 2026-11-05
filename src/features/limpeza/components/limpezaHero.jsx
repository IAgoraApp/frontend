import { Title } from '../../../shared/ui';
import EditorialCollage from '../../../shared/ui/editorialCollage';
import { CasaButton as Action } from '../../casa/components/casaUi';
import services from '../assets/EditorialPhotoServices.png';
import essentials from '../assets/EditorialPhotoEssentials.png';
import box from '../assets/Box.svg';
import packing from '../assets/PackingTape.svg';
import handle from '../assets/Handle.svg';
import label from '../assets/FirstHomeLabel.svg';
import lines from '../assets/OpeningLines.svg';
import tape from '../assets/PaperTapePhotoHeldInPlace.svg';
import doodle from '../assets/DoodleCaminhoAteSeuCanto.svg';

export default function LimpezaHero({ onRoutine }) {
  return (
    <section className='grid items-center gap-8 py-8 lg:grid-cols-2 lg:gap-16 lg:py-12'>
      <div className='min-w-0 space-y-6'>
        <p className='text-xs font-bold tracking-wider text-(--laranja-principal)'>
          LIMPEZA SEM VIRAR UM DRAMA
        </p>
        <Title
          as='h1'
          className='text-[clamp(2.5rem,6.5vw,5.625rem)] leading-[1.06] font-extrabold'
        >
          Menos caos.
          <br />
          <span className='mt-4 inline-block rotate-2 bg-(--laranja-principal) px-3 pb-2 text-white'>
            Mais casa.
          </span>
        </Title>
        <p className='max-w-xl text-lg leading-relaxed'>
          Não precisa fazer tudo de uma vez. Monte uma rotina que cabe na sua
          semana.
        </p>
        <Action onClick={onRoutine}>Levar para minha rotina ↗</Action>
        <div className='pt-8 sm:pt-14'>
          <span className='inline-block rotate-2 bg-(--azul-titulo) px-8 py-3 text-xs text-white'>
            INDEPENDÊNCIA NA VIDA REAL ↗
          </span>
        </div>
      </div>
      <EditorialCollage width={491} height={610}>
        <div
          data-editorial-motion
          className='absolute top-3 left-[45px] h-[300px] w-[410px] -rotate-5 border-8 border-white shadow-lg'
        >
          <img src={services} alt='' className='size-full object-cover' />
        </div>
        <div
          data-editorial-motion
          className='absolute top-[365px] left-[183px] h-[180px] w-[245px] rotate-7 border-8 border-white shadow-lg'
        >
          <img src={essentials} alt='' className='size-full object-cover' />
        </div>
        <div className='absolute top-[280px] -left-2 h-[180px] w-[220px]'>
          <img src={box} alt='' className='absolute top-4 left-2.5' />
          <img
            src={packing}
            alt=''
            className='absolute top-[100px] left-[61px]'
          />
          <img
            src={handle}
            alt=''
            className='absolute top-[124px] left-[47px]'
          />
          <img
            src={label}
            alt=''
            className='absolute top-[131px] left-[139px] -rotate-16'
          />
          <img src={lines} alt='' className='absolute top-[11px] left-[91px]' />
        </div>
        <span className='absolute top-[478px] left-[185px] -rotate-4 bg-(--laranja-principal) px-5 py-3 text-sm text-white'>
          seu canto ganha vida ↗
        </span>
        <img
          src={doodle}
          alt=''
          className='absolute top-[532px] left-[105px]'
        />
        <img
          src={tape}
          alt=''
          className='absolute top-6 left-[190px] rotate-9'
        />
      </EditorialCollage>
    </section>
  );
}
