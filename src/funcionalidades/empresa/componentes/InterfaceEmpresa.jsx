import { Link } from 'react-router-dom';
import {
  Botao,
  Titulo,
} from '../../../compartilhado/interface/indice';
import {
  situacoesAnuncio,
  situacoesContato,
} from '../../../aplicacao/estado/estadoEmpresa';
import vetorCaixa from '../../../ativos/vetores/caixa/caixa.svg';
import vetorAlca from '../../../ativos/vetores/caixa/alca.svg';
import vetorEtiquetaCasa from '../../../ativos/vetores/caixa/etiqueta-casa.svg';
import vetorFitaEmbalagem from '../../../ativos/vetores/caixa/fita-embalagem.svg';
import vetorLinhasAbertura from '../../../ativos/vetores/caixa/linhas-abertura.svg';
import plantaFolhas from '../../../ativos/vetores/assinaturas/planta-folhas.svg';
import plantaVaso from '../../../ativos/vetores/assinaturas/planta-vaso.svg';
import plantaTerra from '../../../ativos/vetores/assinaturas/planta-terra.svg';
import {
  estiloSituacaoAnuncio,
  estiloSituacaoContato,
  obterImagemAnuncio,
} from '../conteudo';

export function CartaoEmpresa({
  titulo = '',
  subtitulo = '',
  acao = null,
  classe = '',
  children,
}) {
  return (
    <section
      className={`min-w-0 rounded-2xl border border-[#dbe5ed] bg-white p-5 sm:p-7 ${classe}`}
    >
      {(titulo || acao) && (
        <div className='mb-5 flex flex-wrap items-start justify-between gap-3'>
          <div>
            {titulo && (
              <Titulo
                como='h2'
                classe='text-xl font-extrabold text-(--azul-titulo) sm:text-2xl'
              >
                {titulo}
              </Titulo>
            )}
            {subtitulo && (
              <p className='mt-1 text-sm text-(--texto-apoio)'>{subtitulo}</p>
            )}
          </div>
          {acao}
        </div>
      )}
      {children}
    </section>
  );
}

export function SelecaoEmpresa({
  id,
  rotulo,
  erro = '',
  classe = '',
  children,
  ...propriedades
}) {
  return (
    <div className={`flex min-w-0 flex-col gap-2 ${classe}`}>
      <label
        htmlFor={id}
        className='text-sm leading-5 font-bold text-(--azul-titulo)'
      >
        {rotulo}
      </label>
      <select
        id={id}
        className={`h-[52px] w-full min-w-0 rounded-lg border bg-white px-4 text-base text-(--azul-titulo) focus-visible:outline-2 focus-visible:outline-offset-2 ${
          erro
            ? 'border-[#b42318] focus-visible:outline-[#b42318]'
            : 'border-[#dbe5ed] focus-visible:outline-(--laranja-principal)'
        }`}
        {...propriedades}
      >
        {children}
      </select>
      {erro && <p className='text-sm font-semibold text-[#b42318]'>{erro}</p>}
    </div>
  );
}

export function EtiquetaSituacaoAnuncio({ situacao }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${estiloSituacaoAnuncio(situacao)}`}
    >
      {situacoesAnuncio[situacao] || 'Rascunho'}
    </span>
  );
}

export function EtiquetaSituacaoContato({ situacao }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${estiloSituacaoContato(situacao)}`}
    >
      {situacoesContato[situacao] || 'Não respondido'}
    </span>
  );
}

export function ImagemServicoEmpresa({ anuncio, classe = '' }) {
  return (
    <img
      src={obterImagemAnuncio(anuncio)}
      alt={anuncio?.titulo || 'Serviço cadastrado pela empresa'}
      className={`w-full object-cover ${classe}`}
    />
  );
}

export function GradeMetricasEmpresa({ itens, colunas = 3 }) {
  const gradeClasse =
    colunas === 4
      ? 'grid gap-4 sm:grid-cols-2 xl:grid-cols-4'
      : 'grid gap-5 md:grid-cols-3';

  return (
    <div className={gradeClasse}>
      {itens.map(item => (
        <article
          key={item.rotulo}
          className={`flex min-w-0 flex-col justify-between rounded-2xl border p-6 ${
            item.destaque
              ? 'border-[#f8ccb4] bg-[#fce8dc]'
              : 'border-[#dbe5ed] bg-[#f4f7fa]'
          }`}
        >
          <p className='text-xs font-bold tracking-[0.7px] text-(--texto-apoio) uppercase'>
            {item.rotulo}
          </p>
          <p className='font-titulo mt-4 text-4xl font-extrabold text-(--azul-titulo) sm:text-[42px]'>
            {item.valor}
          </p>
          {item.apoio && (
            <p className='mt-2 text-sm text-(--texto-apoio)'>{item.apoio}</p>
          )}
        </article>
      ))}
    </div>
  );
}

export function CaixaIlustradaEmpresa({ classe = '' }) {
  return (
    <div
      aria-hidden='true'
      className={`relative h-[200px] w-[240px] shrink-0 select-none ${classe}`}
    >
      <img
        src={vetorCaixa}
        alt=''
        className='absolute top-[22px] left-[14px] h-[164px] w-[206px] object-contain'
      />
      <img
        src={vetorFitaEmbalagem}
        alt=''
        className='absolute top-[112px] left-[72px] w-[96px] object-contain'
      />
      <img
        src={vetorAlca}
        alt=''
        className='absolute top-[142px] left-[58px] w-[118px] object-contain'
      />
      <img
        src={vetorEtiquetaCasa}
        alt=''
        className='absolute top-[148px] left-[162px] w-[36px] -rotate-16 object-contain'
      />
      <img
        src={vetorLinhasAbertura}
        alt=''
        className='absolute top-[10px] left-[102px] w-[34px] object-contain'
      />
    </div>
  );
}

export function PlantaIlustradaEmpresa({ classe = '' }) {
  return (
    <div
      aria-hidden='true'
      className={`relative h-[176px] w-[152px] shrink-0 select-none ${classe}`}
    >
      <img
        src={plantaFolhas}
        alt=''
        className='absolute top-0 left-[22px] w-[108px] object-contain'
      />
      <img
        src={plantaVaso}
        alt=''
        className='absolute top-[98px] left-[28px] w-[96px] object-contain'
      />
      <img
        src={plantaTerra}
        alt=''
        className='absolute top-[96px] left-[44px] w-[64px] object-contain'
      />
    </div>
  );
}

export function FaixaAvisoEmpresa({
  exemplo,
  erroArmazenamento,
  falha,
  aviso,
  aoFecharAviso,
}) {
  return (
    <div className='space-y-3'>
      <div className='flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#dbe5ed] bg-[#f4f7fa] px-4 py-3 text-xs leading-relaxed text-(--texto-apoio)'>
        <p>
          Demonstração local{exemplo ? ' com dados de exemplo' : ''}. Anúncios,
          imagens e conversas ficam salvos neste navegador.
        </p>
        <Link
          to='/empresa/empresas/casa-em-dia'
          className='font-bold text-(--laranja-principal) hover:underline'
        >
          Ver vitrine pública
        </Link>
      </div>

      {erroArmazenamento && (
        <p
          role='alert'
          className='rounded-xl border border-[#f8ccb4] bg-[#fff7ed] p-4 text-sm text-[#9a3412]'
        >
          Não foi possível ler os dados salvos anteriormente. Uma prévia de
          exemplo foi carregada sem apagar seus registros.
        </p>
      )}

      {falha && (
        <p
          role='alert'
          className='rounded-xl border border-[#f4c7c3] bg-[#fef3f2] p-4 text-sm font-semibold text-[#b42318]'
        >
          {falha}
        </p>
      )}

      {aviso && (
        <div
          role='status'
          className='flex items-center justify-between gap-4 rounded-xl border border-[#abefc6] bg-[#ecfdf3] px-4 py-3 text-sm font-semibold text-[#18794e]'
        >
          <span>{aviso}</span>
          <Botao
            type='button'
            variante='fantasma'
            aria-label='Fechar aviso'
            onClick={aoFecharAviso}
            classe='min-h-[36px]! px-3! py-1! text-base!'
          >
            ×
          </Botao>
        </div>
      )}
    </div>
  );
}
