import { Title } from '../ui';

export default function SectionHeading({
  eyebrow,
  title,
  description,
  id,
  as = 'h2',
}) {
  return (
    <div className='flex flex-col items-start gap-2'>
      <p className='text-xs leading-[18px] font-bold uppercase text-(--laranja-principal)'>
        {eyebrow}
      </p>
      <Title as={as} variant='casa' id={id}>
        {title}
      </Title>
      {description && (
        <p className='text-[17px] leading-[25px] text-(--texto-apoio)'>
          {description}
        </p>
      )}
    </div>
  );
}
