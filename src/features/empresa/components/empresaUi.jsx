import { Link } from 'react-router-dom';
import { Title } from '../../../shared/ui';
import cover from '../assets/ServiceCover.png';
import box from '../assets/Box.svg';
import packing from '../assets/PackingTape.svg';
import handle from '../assets/Handle.svg';
import label from '../assets/FirstHomeLabel.svg';
import lines from '../assets/OpeningLines.svg';
import { CasaButton, CasaCard } from '../../casa/components/casaUi';
export {
  CasaButton as Action,
  CasaCard as Card,
  CasaDialog as Dialog,
  CasaSelect as Select,
} from '../../casa/components/casaUi';

export const scope =
  'min-w-0 flex-1 bg-white font-body text-(--azul-titulo) leading-normal wrap-anywhere [&_:is(button,summary)]:cursor-pointer [&_:is(a,button,input,select,textarea):focus-visible]:outline-2 [&_:is(a,button,input,select,textarea):focus-visible]:outline-offset-3 [&_:is(a,button,input,select,textarea):focus-visible]:outline-(--laranja-principal)';
export function CompanyHeading({
  title,
  description,
  eyebrow = 'SEU NEGÓCIO NO IAGORA',
  back = '/empresa',
  children,
}) {
  return (
    <header className='py-7 sm:py-9'>
      {back && (
        <Link
          to={back}
          className='mb-4 inline-flex min-h-11 items-center text-sm font-bold text-(--texto-apoio)'
        >
          ← Voltar
        </Link>
      )}
      <p className='text-xs font-bold tracking-wider text-(--laranja-principal)'>
        {eyebrow}
      </p>
      <div className='mt-3 flex flex-wrap items-center justify-between gap-5'>
        <Title
          as='h1'
          className='text-3xl leading-tight font-extrabold sm:text-4xl lg:text-5xl'
        >
          {title}
        </Title>
        {children}
      </div>
      {description && (
        <p className='mt-3 max-w-3xl text-(--texto-apoio)'>{description}</p>
      )}
    </header>
  );
}
export function ServiceImage({ ad, className = '' }) {
  return (
    <img
      src={ad?.photos?.[0] ?? cover}
      alt={ad?.title ?? 'Equipe de serviços'}
      className={'w-full object-cover ' + className}
    />
  );
}
export function Metrics({ items }) {
  return (
    <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
      {items.map(([label, value]) => (
        <CasaCard key={label}>
          <p className='text-sm text-(--texto-apoio)'>{label}</p>
          <p className='mt-3 text-3xl font-extrabold'>{value}</p>
        </CasaCard>
      ))}
    </div>
  );
}
export function Empty({ children, to, action }) {
  return (
    <div className='flex min-h-44 flex-col items-center justify-center gap-5 rounded-xl bg-(--azul-fundo) p-6 text-center'>
      <p className='text-(--texto-apoio)'>{children}</p>
      {to && (
        <CasaButton as={Link} to={to}>
          {action ?? 'Criar anúncio'}
        </CasaButton>
      )}
    </div>
  );
}
export function CompanyBox() {
  return (
    <div aria-hidden='true' className='relative h-[213px] w-[260px] shrink-0'>
      <img src={box} alt='' className='absolute top-[20px] left-[12px]' />
      <img src={packing} alt='' className='absolute top-[118px] left-[72px]' />
      <img src={handle} alt='' className='absolute top-[148px] left-[57px]' />
      <img
        src={label}
        alt=''
        className='absolute top-[154px] left-[164px] -rotate-16'
      />
      <img src={lines} alt='' className='absolute top-[14px] left-[108px]' />
    </div>
  );
}
