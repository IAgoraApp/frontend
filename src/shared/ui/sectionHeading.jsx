import { Title } from './titles';

export function SectionHeading({
  eyebrow,
  children,
  inverse = false,
  id,
  className = '',
  eyebrowClassName = '',
  titleClassName = '',
}) {
  return (
    <header className={`flex min-w-0 flex-col gap-[5px] ${className}`}>
      <Title
        as='p'
        variant={inverse ? 'pequenoBc' : 'pequenoLj'}
        className={`shrink-0 font-body! text-base leading-[21px] font-bold tracking-[1px] ${eyebrowClassName}`}
      >
        {eyebrow}
      </Title>
      <Title
        as='h2'
        id={id}
        variant='normal'
        className={`shrink-0 text-[clamp(1.75rem,2.362vw,2.125rem)]! leading-[40px] font-extrabold! ${inverse ? 'text-white!' : ''} ${titleClassName}`}
      >
        {children}
      </Title>
    </header>
  );
}
