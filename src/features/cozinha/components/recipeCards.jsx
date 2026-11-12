import { Titulo } from '../../../shared/ui/index';
import { possuiIngrediente } from '../content';
import imgBolo1 from '../assets/ImageCake1.png';
import imgBolo2 from '../assets/ImageCake2.png';
import imgBolo3 from '../assets/ImageCake3.png';
import imgBoloDetalhe from '../assets/ImageCakeDetail.png';
import imgMacarrao from '../../casa/assets/PhotoFood.png';
import imgPrato1 from '../assets/ImageDish1.png';
import imgPrato2 from '../assets/ImageDish2.png';
import imgPrato3 from '../assets/ImageDish3.png';
import imgPrato4 from '../assets/ImageDish4.png';

const mapaImagensReceitas = {
  'receita-bolo-1': imgBolo1,
  'receita-bolo-2': imgBolo2,
  'receita-bolo-3': imgBolo3,
  'receita-bolo-detalhe': imgBoloDetalhe,
  'cozinha-macarrao': imgMacarrao,
  'receita-prato-1': imgPrato1,
  'receita-prato-2': imgPrato2,
  'receita-prato-3': imgPrato3,
  'receita-prato-4': imgPrato4,
};

export function ImagemReceita({ receita, detalhe = false, classe = '' }) {
  const chave =
    detalhe && receita.detailImage ? receita.detailImage : receita.image;
  return (
    <img
      src={mapaImagensReceitas[chave] ?? imgMacarrao}
      alt={receita.title}
      className={'w-full object-cover ' + classe}
    />
  );
}

export default function CartoesReceita({
  receitas,
  aoAbrir,
  despensa,
  aoFavoritar,
  favoritas,
}) {
  return receitas.length ? (
    <div className='grid gap-6 sm:grid-cols-2 xl:grid-cols-3'>
      {receitas.map(receita => (
        <article
          key={receita.id}
          className='relative min-w-0 overflow-hidden rounded-xl border border-[#dbe5ed] bg-white'
        >
          <button
            type='button'
            onClick={() => aoAbrir(receita.id)}
            className='block w-full text-left hover:bg-(--azul-fundo)'
          >
            <ImagemReceita receita={receita} classe='aspect-[1.6]' />
            <div className='space-y-3 p-5'>
              <Titulo classe='pr-9 text-2xl font-extrabold'>
                {receita.title}
              </Titulo>
              <p className='text-sm text-(--texto-apoio)'>
                {receita.minutes} min · {receita.portions}{' '}
                {receita.portions === 1 ? 'porção' : 'porções'}
              </p>
              <div className='flex flex-wrap gap-2'>
                {receita.tags.map(etiqueta => (
                  <span
                    key={etiqueta}
                    className='rounded-full bg-(--azul-fundo) px-3 py-1 text-xs'
                  >
                    {etiqueta}
                  </span>
                ))}
              </div>
              {despensa && (
                <p className='text-xs text-(--texto-apoio)'>
                  {
                    receita.ingredients.filter(item =>
                      possuiIngrediente(despensa, item.name)
                    ).length
                  }{' '}
                  de {receita.ingredients.length} ingredientes disponíveis
                </p>
              )}
              <span className='inline-block text-sm font-bold text-(--laranja-principal)'>
                Ver receita →
              </span>
            </div>
          </button>
          <button
            type='button'
            aria-label={
              (favoritas.includes(receita.id)
                ? 'Remover dos favoritos: '
                : 'Salvar receita: ') + receita.title
            }
            aria-pressed={favoritas.includes(receita.id)}
            onClick={() => aoFavoritar(receita.id)}
            className='absolute right-3 bottom-3 flex size-11 items-center justify-center rounded-full border border-[#dbe5ed] bg-white text-xl text-(--laranja-principal)'
          >
            {favoritas.includes(receita.id) ? '♥' : '♡'}
          </button>
        </article>
      ))}
    </div>
  ) : (
    <p
      role='status'
      className='rounded-xl bg-(--azul-fundo) p-10 text-center text-(--texto-apoio)'
    >
      Nenhuma receita encontrada. Tente outro termo ou explore o catálogo.
    </p>
  );
}
