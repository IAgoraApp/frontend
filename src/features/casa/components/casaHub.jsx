import { Link } from 'react-router-dom';
import { Container, Title } from '../../../shared/ui';
import { careTips } from '../content';
import { CasaButton } from './casaUi';
import CasaArtwork from './casaArtwork';
import cleaning from '../assets/PhotoServices.png';
import food from '../assets/PhotoFood.png';

export default function CasaHub({ onNavigate, checks, onCheck }) {
  return (
    <>
      <Container>
        <section className='grid items-center gap-8 py-8 lg:grid-cols-2 lg:gap-16 lg:py-12'>
          <CasaArtwork />
          <div className='min-w-0 space-y-6'>
            <p className='text-xs font-bold tracking-wider text-(--laranja-principal)'>
              SEU CANTO. SEU JEITO DE CUIDAR.
            </p>
            <Title
              as='h1'
              className='text-[clamp(2.5rem,6.5vw,5.625rem)] leading-[1.06] font-extrabold'
            >
              Casa com
              <br />
              <span className='mt-4 inline-block -rotate-2 bg-(--laranja-principal) px-3 pb-2 text-white'>
                a sua cara.
              </span>
            </Title>
            <p className='max-w-xl text-lg leading-relaxed'>
              Organize a limpeza, descubra o que cozinhar e encontre ajuda
              quando precisar.
            </p>
            <CasaButton as={Link} to='/rotina'>
              Organizar minha rotina ↗
            </CasaButton>
            <div className='pt-8 sm:pt-14'>
              <span className='inline-block rotate-2 bg-(--azul-titulo) px-8 py-3 text-xs text-white'>
                UM PASSO DE CADA VEZ ↗
              </span>
            </div>
          </div>
        </section>
        <div className='grid gap-6 md:grid-cols-2'>
          {[
            {
              image: cleaning,
              alt: 'Equipe de profissionais de limpeza',
              eyebrow: '01 / LIMPEZA',
              title: 'Casa limpa, sem complicação.',
              description:
                'Uma rotina possível, os produtos certos e um cômodo de cada vez.',
              action: 'Cuidar da limpeza',
              view: 'limpeza',
            },
            {
              image: food,
              alt: 'Prato de macarrão com molho de tomate',
              eyebrow: '02 / COZINHA',
              title: 'Comida boa no seu ritmo.',
              description:
                'Receitas simples e ideias para aproveitar o que já tem em casa.',
              action: 'Explorar a cozinha',
              view: 'cozinha',
            },
          ].map((item, i) => (
            <section
              key={item.view}
              className={i === 0 ? 'bg-(--laranja-fundo)' : 'bg-white'}
            >
              <img
                src={item.image}
                alt={item.alt}
                className='aspect-[636/430] w-full object-cover'
              />
              <div className='space-y-3 p-5 sm:p-6'>
                <p className='text-xs font-bold text-(--laranja-principal)'>
                  {item.eyebrow}
                </p>
                <Title className='text-3xl leading-tight font-extrabold lg:text-4xl'>
                  {item.title}
                </Title>
                <p className='text-sm leading-relaxed text-(--texto-apoio)'>
                  {item.description}
                </p>
                <CasaButton as={Link} to={'/' + item.view} className='w-full'>
                  {item.action} ↗
                </CasaButton>
              </div>
            </section>
          ))}
        </div>
        <section className='mt-10'>
          <p className='text-xs font-bold text-(--laranja-principal)'>
            PEQUENOS CUIDADOS
          </p>
          <Title className='mt-3 text-3xl font-extrabold sm:text-4xl'>
            O básico que faz diferença.
          </Title>
          <div className='mt-6 rounded-lg bg-(--azul-fundo) p-5 sm:p-7'>
            {careTips.map(([title, description], index) => (
              <label key={title} className='flex items-start gap-4 py-4'>
                <input
                  type='checkbox'
                  className='mt-1 size-5 shrink-0 accent-(--laranja-principal)'
                  checked={Boolean(checks['care-' + index])}
                  onChange={event =>
                    onCheck('care-' + index, event.target.checked)
                  }
                />
                <span>
                  <strong className='block'>{title}</strong>
                  <span className='mt-1 block text-sm text-(--texto-apoio)'>
                    {description}
                  </span>
                </span>
              </label>
            ))}
          </div>
        </section>
      </Container>
      <section className='mt-12 bg-(--azul-titulo) py-8 text-white'>
        <Container className='flex flex-wrap items-center justify-between gap-6'>
          <div>
            <Title className='text-3xl font-extrabold'>
              Tem coisa que pede uma mão extra.
            </Title>
            <p className='mt-2 text-sm'>
              Encontre ajuda para limpeza, manutenção e mudança.
            </p>
          </div>
          <CasaButton onClick={() => onNavigate('servicos')}>
            Encontrar empresas ↗
          </CasaButton>
        </Container>
      </section>
    </>
  );
}
