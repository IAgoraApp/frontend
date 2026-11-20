import vetorCaixa from '../assets/Box.svg';
import vetorAlca from '../assets/Handle.svg';
import vetorEtiquetaCasa from '../assets/FirstHomeLabel.svg';
import vetorFitaEmbalagem from '../assets/PackingTape.svg';
import vetorLinhasAbertura from '../assets/OpeningLines.svg';
import plantaFolhas from '../../casa/assets/Leaves.svg';
import plantaVaso from '../../casa/assets/Pot.svg';
import plantaTerra from '../../casa/assets/Soil.svg';

export function CaixaIlustradaEmpresa({ classe = '' }) {
  return (
    <div
      aria-hidden='true'
      className={`relative h-[200px] w-[240px] shrink-0 select-none ${classe}`}
    >
      <img
        src={vetorCaixa}
        alt=''
        className='absolute top-[22px] left-[14px] h-[164px] w-[206px] object-contain'
      />
      <img
        src={vetorFitaEmbalagem}
        alt=''
        className='absolute top-[112px] left-[72px] w-[96px] object-contain'
      />
      <img
        src={vetorAlca}
        alt=''
        className='absolute top-[142px] left-[58px] w-[118px] object-contain'
      />
      <img
        src={vetorEtiquetaCasa}
        alt=''
        className='absolute top-[148px] left-[162px] w-[36px] -rotate-16 object-contain'
      />
      <img
        src={vetorLinhasAbertura}
        alt=''
        className='absolute top-[10px] left-[102px] w-[34px] object-contain'
      />
    </div>
  );
}

export function PlantaIlustradaEmpresa({ classe = '' }) {
  return (
    <div
      aria-hidden='true'
      className={`relative h-[176px] w-[152px] shrink-0 select-none ${classe}`}
    >
      <img
        src={plantaFolhas}
        alt=''
        className='absolute top-0 left-[22px] w-[108px] object-contain'
      />
      <img
        src={plantaVaso}
        alt=''
        className='absolute top-[98px] left-[28px] w-[96px] object-contain'
      />
      <img
        src={plantaTerra}
        alt=''
        className='absolute top-[96px] left-[44px] w-[64px] object-contain'
      />
    </div>
  );
}
