import { useEffect, useRef } from 'react';
import essentials from '../assets/EditorialPhotoEssentials.png';
import apartment from '../assets/EditorialPhotoApartment.png';
import leaves from '../assets/Leaves.svg';
import pot from '../assets/Pot.svg';
import soil from '../assets/Soil.svg';
import tape from '../assets/PaperTapePhotoHeldInPlace.svg';
import doodle from '../assets/DoodleCaminhoAteSeuCanto.svg';

export function Plant() {
  return (
    <div aria-hidden='true' className='relative h-[266.5px] w-[205px]'>
      <img src={leaves} alt='' className='absolute top-[9px] left-[41px]' />
      <img src={pot} alt='' className='absolute top-[161px] left-[46px]' />
      <img src={soil} alt='' className='absolute top-[159px] left-[66px]' />
    </div>
  );
}
export default function CasaArtwork() {
  const ref = useRef(null);
  useEffect(() => {
    const element = ref.current;
    const fit = () =>
      element.style.setProperty(
        '--artwork-scale',
        String(element.clientWidth / 539)
      );
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(element);
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      element.querySelectorAll('[data-casa-motion]').forEach((node, i) => {
        node.animate(
          [
            {
              opacity: 0,
              translate: '0 24px',
              rotate: i === 1 ? '-4deg' : '4deg',
              offset: 0,
            },
            { opacity: 0, translate: '0 24px', offset: 0.08 },
            { opacity: 1, translate: '0 0', rotate: '0deg', offset: 0.37 },
            { opacity: 1, translate: '0 0', rotate: '0deg', offset: 1 },
          ],
          {
            duration: 2000,
            delay: i * 120,
            easing: 'ease-out',
            fill: 'backwards',
          }
        );
      });
    }
    return () => observer.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className='relative mx-auto aspect-[539/610] w-full max-w-[539px]'
      aria-label='Fotografias e ilustração do seu canto'
    >
      <div className='absolute top-0 left-0 h-[610px] w-[539px] origin-top-left scale-(--artwork-scale)'>
        <div
          data-casa-motion
          className='absolute top-7 left-[87px] h-[375px] w-[300px] rotate-6 border-8 border-white shadow-lg'
        >
          <img
            src={essentials}
            alt='Utensílios essenciais para a casa'
            className='size-full object-cover'
          />
        </div>
        <div
          data-casa-motion
          className='absolute top-[378px] left-0 h-[164px] w-[230px] rotate-7 border-8 border-white shadow-lg'
        >
          <img
            src={apartment}
            alt='Sala de um apartamento'
            className='size-full object-cover'
          />
        </div>
        <div data-casa-motion className='absolute top-[205px] left-7'>
          <Plant />
        </div>
        <span className='absolute top-[478px] left-[201px] -rotate-4 bg-(--laranja-principal) px-5 py-3 text-sm text-white'>
          seu canto ganha vida ↗
        </span>
        <img
          src={doodle}
          alt=''
          className='absolute top-[532px] left-[121px]'
        />
        <img
          src={tape}
          alt=''
          className='absolute top-3 left-[216px] rotate-9'
        />
      </div>
    </div>
  );
}
