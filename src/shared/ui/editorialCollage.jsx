import { useEffect, useRef } from 'react';

export default function EditorialCollage({ width, height, children }) {
  const ref = useRef(null);
  useEffect(() => {
    const element = ref.current;
    const fit = () =>
      element.style.setProperty(
        '--collage-scale',
        String(element.clientWidth / width)
      );
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(element);
    const animations = [];
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
      element.querySelectorAll('[data-editorial-motion]').forEach((node, i) =>
        animations.push(
          node.animate(
            [
              { opacity: 0, translate: '0 16px', offset: 0 },
              { opacity: 0, translate: '0 16px', offset: 0.08 },
              { opacity: 1, translate: '0 0', offset: 0.37 },
              { opacity: 1, translate: '0 0', offset: 1 },
            ],
            {
              duration: 2000,
              delay: i * 120,
              easing: 'ease-out',
              fill: 'backwards',
            }
          )
        )
      );
    }
    return () => {
      observer.disconnect();
      animations.forEach(animation => animation.cancel());
    };
  }, [width]);
  return (
    <div
      ref={ref}
      aria-hidden='true'
      className='relative mx-auto w-full'
      style={{ maxWidth: width, aspectRatio: width + '/' + height }}
    >
      <div
        className='absolute top-0 left-0 origin-top-left scale-(--collage-scale)'
        style={{ width, height }}
      >
        {children}
      </div>
    </div>
  );
}
