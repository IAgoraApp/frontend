import { Link } from 'react-router-dom';
import { Title } from '../../../shared/ui';
import EditorialCollage from '../../../shared/ui/editorialCollage';
import { Plant } from '../../casa/components/casaArtwork';
import { CasaButton as Action } from '../../casa/components/casaUi';
import cooking from '../assets/EditorialPhotoCooking.png';
import food from '../assets/EditorialPhotoFood.png';
import tape from '../assets/PaperTapePhotoHeldInPlace.svg';
import doodle from '../assets/DoodleCaminhoAteSeuCanto.svg';

export default function CozinhaHero({ navigate, checks, onCheck }) {
  return (
    <>
      <section className='grid items-center gap-8 py-8 lg:grid-cols-2 lg:gap-16 lg:py-12'>
        <div className='min-w-0 space-y-6'>
          <p className='text-xs font-bold tracking-wider text-(--laranja-principal)'>
            DA PRIMEIRA RECEITA AO SEU PRATO FAVORITO
          </p>
          <Title
            as='h1'
            className='text-[clamp(2.5rem,6.5vw,5.625rem)] leading-[1.06] font-extrabold'
          >
            Hoje tem
            <br />
            <span className='mt-4 inline-block -rotate-2 bg-(--laranja-principal) px-3 pb-2 text-white'>
              eu que fiz.
            </span>
          </Title>
          <p className='max-w-xl text-lg leading-relaxed'>
            Receitas possíveis para quem está começando, economizando ou só com
            vontade de comer bem.
          </p>
          <Action onClick={() => navigate('compras')}>
            Organizar minhas compras ↗
          </Action>
          <div className='pt-8 sm:pt-14'>
            <span className='inline-block rotate-2 bg-(--azul-titulo) px-8 py-3 text-xs text-white'>
              UM PASSO DE CADA VEZ ↗
            </span>
          </div>
        </div>
        <EditorialCollage width={547} height={693}>
          <div
            data-editorial-motion
            className='absolute top-[94px] left-[161px] h-[375px] w-[300px] rotate-6 border-8 border-white shadow-lg'
          >
            <img src={cooking} alt='' className='size-full object-cover' />
          </div>
          <div
            data-editorial-motion
            className='absolute top-[444px] left-[74px] h-[164px] w-[230px] rotate-7 border-8 border-white shadow-lg'
          >
            <img src={food} alt='' className='size-full object-cover' />
          </div>
          <div data-editorial-motion className='absolute top-[231px] left-0'>
            <Plant />
          </div>
          <span className='absolute top-[544px] left-[275px] -rotate-4 bg-(--laranja-principal) px-5 py-3 text-sm text-white'>
            seu canto ganha vida ↗
          </span>
          <img
            src={doodle}
            alt=''
            className='absolute top-[598px] left-[195px]'
          />
          <img
            src={tape}
            alt=''
            className='absolute top-[78px] left-[290px] rotate-9'
          />
        </EditorialCollage>
      </section>
      <section>
        <p className='text-xs font-bold text-(--laranja-principal)'>
          RECEITA PRA HOJE
        </p>
        <Title className='mt-3 text-3xl font-extrabold sm:text-4xl'>
          Poucos ingredientes. Muito sabor.
        </Title>
        <div className='mt-6 grid items-center gap-6 rounded-xl bg-(--azul-fundo) p-5 lg:grid-cols-2 lg:gap-10'>
          <img
            src={food}
            alt='Macarrão com molho de tomate'
            className='aspect-[600/380] w-full rounded-lg object-cover'
          />
          <div className='space-y-4'>
            <p className='text-xs font-bold text-(--laranja-principal)'>
              MACARRÃO COM MOLHO DE TOMATE
            </p>
            <Title className='text-3xl font-extrabold'>
              Uma panela,
              <br />
              um almoço resolvido.
            </Title>
            <p className='text-xs font-bold text-(--texto-apoio)'>
              25 MIN · 2 PORÇÕES · NÍVEL: TÔ COMEÇANDO
            </p>
            <p>Você vai usar: macarrão, tomate, alho, azeite, sal e água.</p>
            <ol className='list-inside list-decimal space-y-2 text-sm text-(--texto-apoio)'>
              <li>Refogue o alho e o tomate.</li>
              <li>Junte o macarrão e a água aos poucos.</li>
              <li>Cozinhe até ficar no ponto e finalize.</li>
            </ol>
            <Action onClick={() => navigate('receita', 'macarrao')}>
              Ver receita completa →
            </Action>
          </div>
        </div>
      </section>
      <section className='mt-10'>
        <p className='text-xs font-bold text-(--laranja-principal)'>
          ANTES DO MERCADO
        </p>
        <Title className='mt-3 text-3xl font-extrabold sm:text-4xl'>
          Abra a geladeira. Depois, a lista.
        </Title>
        <div className='mt-6 rounded-xl bg-(--azul-fundo) p-5'>
          {[
            [
              'Veja o que já está aberto',
              'Comece pelos alimentos que precisam ser usados primeiro.',
            ],
            [
              'Escolha duas ou três refeições da semana',
              'Repetir ingredientes ajuda a economizar e evita sobras.',
            ],
            [
              'Leve a lista com você',
              'Organize o que falta antes de ir ao mercado.',
            ],
          ].map(([title, description], i) => (
            <label key={title} className='flex items-start gap-4 py-4'>
              <input
                type='checkbox'
                className='mt-1 size-5 shrink-0 accent-(--laranja-principal)'
                checked={Boolean(checks['tip-' + i])}
                onChange={event => onCheck('tip-' + i, event.target.checked)}
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
        <div className='mt-5 flex flex-wrap gap-3'>
          <Action secondary onClick={() => navigate('despensa')}>
            O que tenho em casa
          </Action>
          <Action secondary onClick={() => navigate('plano')}>
            Planejar refeições
          </Action>
          <Action
            secondary
            as={Link}
            to='/limpeza?visao=biblioteca&guia=cozinha'
          >
            Cuidar da cozinha ↗
          </Action>
        </div>
      </section>
    </>
  );
}
