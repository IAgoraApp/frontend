import { useEffect, useRef } from 'react';
import cozinha3d from '../../../ativos/imagens/ilustracoes/recurso-cozinha-3d.png';
import checklist3d from '../../../ativos/imagens/ilustracoes/checklist-3d.png';
import guias3d from '../../../ativos/imagens/ilustracoes/recurso-guias-dicas-3d.png';
import folhas from '../../../ativos/vetores/assinaturas/planta-folhas.svg';
import vaso from '../../../ativos/vetores/assinaturas/planta-vaso.svg';
import terra from '../../../ativos/vetores/assinaturas/planta-terra.svg';

export function PlantaEditorial() {
  return (
    <div aria-hidden='true' className='relative h-[266.5px] w-[205px]'>
      <img src={folhas} alt='' className='absolute top-[9px] left-[41px]' />
      <img src={vaso} alt='' className='absolute top-[161px] left-[46px]' />
      <img src={terra} alt='' className='absolute top-[159px] left-[66px]' />
    </div>
  );
}

export default function ArteCasa() {
  const referencia = useRef(null);

  useEffect(() => {
    const elemento = referencia.current;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    elemento.querySelectorAll('[data-movimento-casa]').forEach((item, indice) => {
      item.animate(
        [
          { opacity: 0, translate: '0 20px' },
          { opacity: 1, translate: '0 0' },
        ],
        {
          duration: 700,
          delay: indice * 110,
          easing: 'ease-out',
          fill: 'backwards',
        }
      );
    });
  }, []);

  return (
    <div
      ref={referencia}
      className='relative mx-auto aspect-[640/542] w-full max-w-[640px]'
      aria-label='Ilustrações em três dimensões representando cozinha, planejamento e checklists da casa'
    >
      <img
        data-movimento-casa
        src={cozinha3d}
        alt=''
        className='pointer-events-none absolute top-0 left-[4%] w-[46.5%] select-none'
      />
      <img
        data-movimento-casa
        src={checklist3d}
        alt=''
        className='pointer-events-none absolute top-[2.4%] left-[62%] w-[37%] select-none'
      />
      <img
        data-movimento-casa
        src={guias3d}
        alt=''
        className='pointer-events-none absolute bottom-0 left-[25.5%] w-[50%] select-none'
      />
    </div>
  );
}
