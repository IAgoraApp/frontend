import { Link } from 'react-router-dom';
import { Botao, Titulo } from '../../../shared/ui/index';
import { situacoesAnuncio } from '../../../app/estado/estadoEmpresa';
import {
  CartaoEmpresa,
  EtiquetaSituacaoAnuncio,
  ImagemServicoEmpresa,
} from './empresaUi';

export default function PreviaAnuncio({
  anuncio,
  empresa,
  aoPublicarParaAnalise,
}) {
  return (
    <div className='space-y-6'>
      <CartaoEmpresa>
        <div className='grid items-start gap-8 lg:grid-cols-2'>
          <ImagemServicoEmpresa
            anuncio={anuncio}
            classe='aspect-[16/10] rounded-xl'
          />

          <div className='space-y-4'>
            <div className='flex flex-wrap items-center gap-3'>
              <span className='text-xs font-bold tracking-[0.8px] text-(--laranja-principal) uppercase'>
                PRÉVIA DO ANÚNCIO
              </span>
              <EtiquetaSituacaoAnuncio situacao={anuncio.situacao} />
            </div>

            <Titulo
              como='h2'
              classe='text-3xl leading-tight font-extrabold sm:text-4xl'
            >
              {anuncio.titulo || 'Rascunho sem título'}
            </Titulo>

            <p className='text-sm font-semibold text-(--texto-apoio)'>
              {empresa.nome} · {anuncio.regiao}
            </p>

            <div className='rounded-xl bg-[#fce8dc] p-4'>
              <p className='font-titulo text-2xl font-extrabold text-(--azul-titulo)'>
                {anuncio.preco}
              </p>
              <p className='mt-1 text-sm text-(--texto-apoio)'>
                Atendimento {anuncio.atendimento.toLowerCase()} ·{' '}
                {anuncio.disponibilidade}
              </p>
            </div>

            <p className='leading-relaxed whitespace-pre-wrap text-(--azul-titulo)'>
              {anuncio.descricao ||
                'Adicione uma descrição para apresentar seu serviço com mais segurança.'}
            </p>

            <p className='text-sm text-(--texto-apoio)'>
              Canais da empresa: {anuncio.telefone || 'Sem telefone'} ·{' '}
              {anuncio.email || 'Sem e-mail'}
            </p>
          </div>
        </div>
      </CartaoEmpresa>

      <div className='flex flex-wrap items-center justify-between gap-4'>
        <p className='text-xs text-(--texto-apoio)'>
          Status atual: {situacoesAnuncio[anuncio.situacao]}. Ao enviar para
          análise, o anúncio entra na fila local de demonstração.
        </p>
        <div className='flex flex-wrap gap-3'>
          {['rascunho', 'analise'].includes(anuncio.situacao) && (
            <Botao type='button' cor='laranja' onClick={aoPublicarParaAnalise}>
              Enviar para análise
            </Botao>
          )}
          <Botao
            como={Link}
            to={`/empresa/anuncios/${anuncio.id}/editar`}
            variante='secundario'
          >
            Editar informações
          </Botao>
          <Botao
            como={Link}
            to={`/empresa/anuncios/${anuncio.id}`}
            variante='fantasma'
            classe='border border-[#dbe5ed]'
          >
            Voltar ao anúncio
          </Botao>
        </div>
      </div>
    </div>
  );
}
