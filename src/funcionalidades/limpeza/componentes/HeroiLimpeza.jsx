import { Titulo } from '../../../compartilhado/interface/indice';
import ColagemEditorial from '../../../compartilhado/interface/ColagemEditorial';
import { BotaoCasa } from '../../casa/componentes/indice';
import fotoServicos from '../../../ativos/imagens/fotografias/editorial-servicos.png';
import fotoEssenciais from '../../../ativos/imagens/fotografias/editorial-essenciais.png';
import vetorCaixa from '../../../ativos/vetores/caixa/caixa.svg';
import vetorFitaEmbalagem from '../../../ativos/vetores/caixa/fita-embalagem.svg';
import vetorAlca from '../../../ativos/vetores/caixa/alca.svg';
import vetorEtiquetaCasa from '../../../ativos/vetores/caixa/etiqueta-casa.svg';
import vetorLinhasAbertura from '../../../ativos/vetores/caixa/linhas-abertura.svg';
import vetorFitaFoto from '../../../ativos/vetores/assinaturas/fita-foto.svg';
import vetorTracoCanto from '../../../ativos/vetores/assinaturas/traco-caminho-canto.svg';

export default function HeroiLimpeza({ aoRotina }) {
  return (
    <section className='grid items-center gap-8 py-8 lg:grid-cols-2 lg:gap-16 lg:py-12'>
      <div className='min-w-0 space-y-6'>
        <p className='text-xs font-bold tracking-wider text-(--laranja-principal)'>
          LIMPEZA SEM VIRAR UM DRAMA
        </p>
        <Titulo
          como='h1'
          classe='text-[clamp(2.5rem,6.5vw,5.625rem)] leading-[1.06] font-extrabold'
        >
          Menos caos.
          <br />
          <span className='mt-4 inline-block rotate-2 bg-(--laranja-principal) px-3 pb-2 text-white'>
            Mais casa
          </span>
        </Titulo>
        <p className='max-w-xl text-lg leading-relaxed'>
          Não precisa fazer tudo de uma vez. Monte uma rotina que cabe na sua
          semana.
        </p>
        <BotaoCasa onClick={aoRotina}>Levar para minha rotina</BotaoCasa>
        <div className='pt-8 sm:pt-14'>
          <span className='inline-block rotate-2 bg-(--azul-titulo) px-8 py-3 text-xs text-white'>
            INDEPENDÊNCIA NA VIDA REAL
          </span>
        </div>
      </div>
      <ColagemEditorial largura={491} altura={610}>
        <div
          data-movimento-editorial
          className='absolute top-3 left-[45px] h-[300px] w-[410px] -rotate-5 border-8 border-white shadow-lg'
        >
          <img src={fotoServicos} alt='' className='size-full object-cover' />
        </div>
        <div
          data-movimento-editorial
          className='absolute top-[365px] left-[183px] h-[180px] w-[245px] rotate-7 border-8 border-white shadow-lg'
        >
          <img src={fotoEssenciais} alt='' className='size-full object-cover' />
        </div>
        <div className='absolute top-[280px] -left-2 h-[180px] w-[220px]'>
          <img src={vetorCaixa} alt='' className='absolute top-4 left-2.5' />
          <img
            src={vetorFitaEmbalagem}
            alt=''
            className='absolute top-[100px] left-[61px]'
          />
          <img
            src={vetorAlca}
            alt=''
            className='absolute top-[124px] left-[47px]'
          />
          <img
            src={vetorEtiquetaCasa}
            alt=''
            className='absolute top-[131px] left-[139px] -rotate-16'
          />
          <img
            src={vetorLinhasAbertura}
            alt=''
            className='absolute top-[11px] left-[91px]'
          />
        </div>
        <span className='absolute top-[478px] left-[185px] -rotate-4 bg-(--laranja-principal) px-5 py-3 text-sm text-white'>
          seu canto ganha vida
        </span>
        <img
          src={vetorTracoCanto}
          alt=''
          className='absolute top-[532px] left-[105px]'
        />
        <img
          src={vetorFitaFoto}
          alt=''
          className='absolute top-6 left-[190px] rotate-9'
        />
      </ColagemEditorial>
    </section>
  );
}
