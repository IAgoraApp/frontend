import { Link } from 'react-router-dom';
import { Titulo } from '../../../shared/ui/index';
import ColagemEditorial from '../../../shared/ui/editorialCollage';
import { BotaoCasa, PlantaEditorial } from '../../casa/components/index';
import fotoCozinha from '../assets/EditorialPhotoCooking.png';
import fotoMacarrao from '../../casa/assets/PhotoFood.png';
import vetorFitaFoto from '../../casa/assets/PaperTapePhotoHeldInPlace.svg';
import vetorTracoCanto from '../../casa/assets/DoodleCaminhoAteSeuCanto.svg';

export default function HeroiCozinha({ navegar, marcacoes, aoMarcar }) {
  return (
    <>
      <section className='grid items-center gap-8 py-8 lg:grid-cols-2 lg:gap-16 lg:py-12'>
        <div className='min-w-0 space-y-6'>
          <p className='text-xs font-bold tracking-wider text-(--laranja-principal)'>
            DA PRIMEIRA RECEITA AO SEU PRATO FAVORITO
          </p>
          <Titulo
            como='h1'
            classe='text-[clamp(2.5rem,6.5vw,5.625rem)] leading-[1.06] font-extrabold'
          >
            Hoje tem
            <br />
            <span className='mt-4 inline-block -rotate-2 bg-(--laranja-principal) px-3 pb-2 text-white'>
              eu que fiz.
            </span>
          </Titulo>
          <p className='max-w-xl text-lg leading-relaxed'>
            Receitas possíveis para quem está começando, economizando ou só com
            vontade de comer bem.
          </p>
          <BotaoCasa onClick={() => navegar('compras')}>
            Organizar minhas compras ↗
          </BotaoCasa>
          <div className='pt-8 sm:pt-14'>
            <span className='inline-block rotate-2 bg-(--azul-titulo) px-8 py-3 text-xs text-white'>
              UM PASSO DE CADA VEZ ↗
            </span>
          </div>
        </div>
        <ColagemEditorial largura={547} altura={693}>
          <div
            data-movimento-editorial
            className='absolute top-[94px] left-[161px] h-[375px] w-[300px] rotate-6 border-8 border-white shadow-lg'
          >
            <img src={fotoCozinha} alt='' className='size-full object-cover' />
          </div>
          <div
            data-movimento-editorial
            className='absolute top-[444px] left-[74px] h-[164px] w-[230px] rotate-7 border-8 border-white shadow-lg'
          >
            <img src={fotoMacarrao} alt='' className='size-full object-cover' />
          </div>
          <div data-movimento-editorial className='absolute top-[231px] left-0'>
            <PlantaEditorial />
          </div>
          <span className='absolute top-[544px] left-[275px] -rotate-4 bg-(--laranja-principal) px-5 py-3 text-sm text-white'>
            seu canto ganha vida ↗
          </span>
          <img
            src={vetorTracoCanto}
            alt=''
            className='absolute top-[598px] left-[195px]'
          />
          <img
            src={vetorFitaFoto}
            alt=''
            className='absolute top-[78px] left-[290px] rotate-9'
          />
        </ColagemEditorial>
      </section>

      <section>
        <p className='text-xs font-bold text-(--laranja-principal)'>
          RECEITA PRA HOJE
        </p>
        <Titulo classe='mt-3 text-3xl font-extrabold sm:text-4xl'>
          Poucos ingredientes. Muito sabor.
        </Titulo>
        <div className='mt-6 grid items-center gap-6 rounded-xl bg-(--azul-fundo) p-5 lg:grid-cols-2 lg:gap-10'>
          <img
            src={fotoMacarrao}
            alt='Macarrão com molho de tomate'
            className='aspect-[600/380] w-full rounded-lg object-cover'
          />
          <div className='space-y-4'>
            <p className='text-xs font-bold text-(--laranja-principal)'>
              MACARRÃO COM MOLHO DE TOMATE
            </p>
            <Titulo classe='text-3xl font-extrabold'>
              Uma panela,
              <br />
              um almoço resolvido.
            </Titulo>
            <p className='text-xs font-bold text-(--texto-apoio)'>
              25 MIN · 2 PORÇÕES · NÍVEL: TÔ COMEÇANDO
            </p>
            <p>Você vai usar: macarrão, tomate, alho, azeite, sal e água.</p>
            <ol className='list-inside list-decimal space-y-2 text-sm text-(--texto-apoio)'>
              <li>Refogue o alho e o tomate.</li>
              <li>Junte o macarrão e a água aos poucos.</li>
              <li>Cozinhe até ficar no ponto e finalize.</li>
            </ol>
            <BotaoCasa onClick={() => navegar('receita', 'macarrao')}>
              Ver receita completa →
            </BotaoCasa>
          </div>
        </div>
      </section>

      <section className='mt-10'>
        <p className='text-xs font-bold text-(--laranja-principal)'>
          ANTES DO MERCADO
        </p>
        <Titulo classe='mt-3 text-3xl font-extrabold sm:text-4xl'>
          Abra a geladeira. Depois, a lista.
        </Titulo>
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
          ].map(([titulo, descricao], indice) => {
            const marcado = Boolean(
              marcacoes['dica-' + indice] ?? marcacoes['tip-' + indice]
            );
            return (
              <label
                key={titulo}
                className='flex cursor-pointer items-start gap-4 py-4'
              >
                <input
                  type='checkbox'
                  className='peer sr-only'
                  checked={marcado}
                  onChange={evento =>
                    aoMarcar('dica-' + indice, evento.target.checked)
                  }
                />
                <span
                  aria-hidden='true'
                  className={
                    'mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-(--laranja-principal) ' +
                    (marcado
                      ? 'border-(--laranja-principal) bg-(--laranja-principal) text-white'
                      : 'border-(--azul-titulo) bg-transparent text-transparent')
                  }
                >
                  ✓
                </span>
                <span>
                  <strong className='block font-bold text-(--azul-titulo)'>
                    {titulo}
                  </strong>
                  <span className='mt-1 block text-sm text-(--texto-apoio)'>
                    {descricao}
                  </span>
                </span>
              </label>
            );
          })}
        </div>
        <div className='mt-5 flex flex-wrap gap-3'>
          <BotaoCasa secundario onClick={() => navegar('despensa')}>
            O que tenho em casa
          </BotaoCasa>
          <BotaoCasa secundario onClick={() => navegar('plano')}>
            Planejar refeições
          </BotaoCasa>
          <BotaoCasa
            secundario
            como={Link}
            to='/limpeza?visao=biblioteca&guia=cozinha'
          >
            Cuidar da cozinha ↗
          </BotaoCasa>
        </div>
      </section>
    </>
  );
}
