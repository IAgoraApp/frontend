import { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Title } from '../../shared/ui';
import Logo from './assets/logo.png';
import Onda from './assets/onda.svg';
import { livingSituations } from './content';

function rememberLivingSituation(situation) {
  try {
    localStorage.setItem('iagora:living-situation', situation);
  } catch {
    // A navegação continua quando o navegador bloqueia o armazenamento.
  }
}

export default function Onboarding() {
  const viewportRef = useRef(null);
  const contentRef = useRef(null);

  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    const content = contentRef.current;

    function fitContent() {
      const scale = Math.min(1, viewport.clientHeight / content.offsetHeight);
      content.style.setProperty('--onboarding-scale', String(scale));
    }

    const observer = new ResizeObserver(fitContent);
    observer.observe(viewport);
    observer.observe(content);
    fitContent();

    return () => observer.disconnect();
  }, []);

  return (
    <main
      className='fixed inset-0 isolate h-dvh w-full overflow-hidden bg-white px-[max(1rem,env(safe-area-inset-left),env(safe-area-inset-right))] pt-[max(clamp(0.75rem,2.57vw,2.3125rem),env(safe-area-inset-top))] pb-[max(clamp(0.75rem,7.43vw,6.6875rem),env(safe-area-inset-bottom))] max-md:py-[max(0.75rem,env(safe-area-inset-top),env(safe-area-inset-bottom))] sm:px-[max(1.5rem,env(safe-area-inset-left),env(safe-area-inset-right))]'
      aria-labelledby='onboarding-title'
    >
      <div
        ref={viewportRef}
        className='relative mx-auto h-full w-full max-w-[65.75rem]'
      >
        <div
          ref={contentRef}
          className='absolute top-1/2 left-1/2 w-full origin-center -translate-1/2 scale-(--onboarding-scale) [--onboarding-scale:1]'
        >
          <header className='flex flex-col items-center text-center'>
            <Link
              to='/'
              aria-label='Página inicial IAgora'
              className='block max-w-full rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--laranja-principal)'
            >
              <img
                src={Logo}
                alt='IAgora'
                width='1914'
                height='705'
                className='h-auto w-[clamp(8rem,27.36vw,24.625rem)] max-w-full'
              />
            </Link>

            <Title
              as='h1'
              id='onboarding-title'
              className='mt-[0.5625rem] -mb-[0.14em] max-w-full font-poppins! text-[clamp(1.5rem,3.473vw,3.125rem)] leading-[1.5] font-semibold text-black wrap-anywhere'
            >
              Que bom te ver aqui!!
            </Title>
            <p className='font-poppins text-[clamp(1rem,1.389vw,1.25rem)] leading-8 font-semibold text-[#404040]'>
              mas antes...
            </p>
          </header>

          <section
            aria-label='Escolha o seu momento de vida'
            className='mt-[clamp(1rem,3.264vw,2.9375rem)] grid min-w-0 grid-cols-1 items-start justify-items-center gap-6 md:grid-cols-2 min-[900px]:gap-[clamp(1.5rem,6.945vw,6.25rem)] [@media(orientation:landscape)_and_(width>=520px)]:grid-cols-2'
          >
            {livingSituations.map(situation => (
              <Link
                key={situation.id}
                to='/home'
                onClick={() => rememberLivingSituation(situation.id)}
                aria-labelledby={`onboarding-${situation.id}-title`}
                aria-describedby={`onboarding-${situation.id}-description`}
                className='w-full max-w-[29.75rem] min-w-0 overflow-hidden rounded-[1.25rem] bg-white text-left shadow-[0_4px_4px_0_#00000040] transition-shadow hover:shadow-[0_6px_12px_0_#00000040] focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-(--laranja-principal) motion-reduce:transition-none'
              >
                <img
                  src={situation.image}
                  width={situation.imageWidth}
                  height={situation.imageHeight}
                  alt=''
                  className='aspect-[476/299] w-full object-cover'
                />
                <div className='px-4 pt-3 pb-6 min-[900px]:px-[1.3125rem] min-[900px]:pt-[0.6875rem] min-[900px]:pb-[2.625rem]'>
                  <Title
                    as='h2'
                    id={`onboarding-${situation.id}-title`}
                    className='font-poppins! text-[clamp(1.375rem,2.084vw,1.875rem)] leading-[1.5] font-semibold text-black wrap-anywhere'
                  >
                    {situation.title}
                  </Title>
                  <p
                    id={`onboarding-${situation.id}-description`}
                    className='max-w-[26.6875rem] font-inter text-[clamp(1rem,1.389vw,1.25rem)] leading-[1.2] font-semibold text-[#595959] wrap-anywhere'
                  >
                    {situation.description}
                  </p>
                </div>
              </Link>
            ))}
          </section>

          <aside className='mt-[clamp(1rem,4.723vw,4.25rem)] w-full max-w-[43.3125rem] bg-[#de5603] px-[1.3125rem] py-[1.3125rem] font-inter text-[clamp(1rem,1.389vw,1.25rem)] leading-[1.2] font-semibold text-white'>
            <ul className='list-disc pl-[1.875rem]'>
              <li className='wrap-anywhere'>
                As opções podem ser alteradas futuramente
              </li>
            </ul>
          </aside>
        </div>
      </div>

      <img
        src={Onda}
        alt=''
        className='pointer-events-none absolute -bottom-[8.333333vw] left-[0.2vw] -z-10 h-auto w-screen rotate-5'
      />
    </main>
  );
}
