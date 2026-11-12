import argolaChaveiro from '../assets/chaveiro-argola.svg';
import brilhoChaveiro from '../assets/chaveiro-brilho.svg';
import casinhaChaveiro from '../assets/chaveiro-casinha.svg';
import chaveChaveiro from '../assets/chaveiro-chave.svg';
import livroOriginal from '../assets/livro-original.svg';
import checklistOriginal from '../assets/checklist-original.svg';
import pranchetaChecklist from '../../features/calculadoras/assets/prancheta-checklist.svg';
import raiosDesenhados from '../../features/rotina/assets/signature-rays.svg';
import vetorCaixa from '../../features/empresa/assets/Box.svg';
import vetorFitaEmbalagem from '../../features/empresa/assets/PackingTape.svg';
import vetorAlca from '../../features/empresa/assets/Handle.svg';
import vetorEtiquetaCasa from '../../features/empresa/assets/FirstHomeLabel.svg';
import vetorLinhasAbertura from '../../features/empresa/assets/OpeningLines.svg';
import plantaFolhas from '../../features/casa/assets/Leaves.svg';
import plantaTerra from '../../features/casa/assets/Soil.svg';
import plantaVaso from '../../features/casa/assets/Pot.svg';

export function AssinaturaEditorial({
  tipo = 'chave',
  etiqueta = 'DO SEU JEITO ↗',
  classe = '',
}) {
  return (
    <div
      aria-hidden='true'
      className={`relative h-[180px] w-[208px] shrink-0 select-none ${classe}`}
    >
      <div className='absolute top-[8px] left-[34px] h-[116px] w-[140px] -rotate-7 rounded-[12px] bg-[#fce8dc]' />

      {tipo === 'chave' && (
        <div className='absolute top-[8px] left-[33px] h-[126px] w-[120px] rotate-5'>
          <img
            src={argolaChaveiro}
            alt=''
            className='absolute top-[6%] left-[30%] w-[38%]'
          />
          <img
            src={brilhoChaveiro}
            alt=''
            className='absolute top-[13%] left-[5%] w-[10%]'
          />
          <img
            src={chaveChaveiro}
            alt=''
            className='absolute top-[30%] left-[4%] w-[44%] rotate-18'
          />
          <img
            src={casinhaChaveiro}
            alt=''
            className='absolute top-[25%] left-[40%] w-[56%] -rotate-12'
          />
        </div>
      )}

      {tipo === 'livro' && (
        <img
          src={livroOriginal}
          alt=''
          className='absolute top-[8px] left-[25px] h-[126px] w-[136px] rotate-5 object-contain'
        />
      )}

      {tipo === 'checklist' && (
        <img
          src={checklistOriginal}
          alt=''
          className='absolute top-[12px] left-[40px] h-[120px] w-[112px] -rotate-5 object-contain'
        />
      )}

      {tipo === 'prancheta' && (
        <img
          src={pranchetaChecklist}
          alt=''
          className='absolute top-[10px] left-[36px] h-[122px] w-[120px] rotate-3 object-contain'
        />
      )}

      {tipo === 'caixa' && (
        <div className='absolute top-[8px] left-[26px] h-[112px] w-[136px] rotate-5'>
          <img
            src={vetorCaixa}
            alt=''
            className='absolute inset-[11%_6%_8%_6%] size-[86%] object-contain'
          />
          <img
            src={vetorFitaEmbalagem}
            alt=''
            className='absolute top-[55%] left-[27%] w-[40%] object-contain'
          />
          <img
            src={vetorAlca}
            alt=''
            className='absolute top-[71%] left-[23%] w-[51%] object-contain'
          />
          <img
            src={vetorEtiquetaCasa}
            alt=''
            className='absolute top-[73%] left-[64%] w-[14%] -rotate-16 object-contain'
          />
          <img
            src={vetorLinhasAbertura}
            alt=''
            className='absolute top-[6%] left-[43%] w-[14%] object-contain'
          />
        </div>
      )}

      {tipo === 'planta' && (
        <div className='absolute top-[4px] left-[38px] h-[132px] w-[116px]'>
          <img
            src={plantaFolhas}
            alt=''
            className='absolute top-0 left-[18%] w-[64%] object-contain'
          />
          <img
            src={plantaVaso}
            alt=''
            className='absolute top-[58%] left-[22%] w-[56%] object-contain'
          />
          <img
            src={plantaTerra}
            alt=''
            className='absolute top-[57%] left-[31%] w-[38%] object-contain'
          />
        </div>
      )}

      <div className='absolute top-[142px] left-[32px] rotate-3 bg-[#102a43] px-[14px] py-[8px]'>
        <p className='text-[10px] font-bold tracking-[0.5px] whitespace-nowrap text-white uppercase'>
          {etiqueta}
        </p>
      </div>

      <img
        src={raiosDesenhados}
        alt=''
        className='absolute top-[12px] left-[160px] h-[42px] w-[46px]'
      />
    </div>
  );
}
