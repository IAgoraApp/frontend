import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Botao } from '../../../shared/ui/index';
import { formatarData } from '../../../app/estado/estadoEmpresa';
import {
  CartaoEmpresa,
  EtiquetaSituacaoAnuncio,
  GradeMetricasEmpresa,
  ImagemServicoEmpresa,
} from './empresaUi';

export default function DetalheAnuncio({ anuncio, aoAcionar }) {
  const [aba, setAba] = useState('visaoGeral');

  return (
    <div className='space-y-6'>
      <div className='flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-[#f4f7fa] p-5'>
        <div className='flex flex-wrap items-center gap-3'>
          <EtiquetaSituacaoAnuncio situacao={anuncio.situacao} />
          <span className='text-sm text-(--texto-apoio)'>
            Atualizado em {formatarData(anuncio.atualizadoEm)}
          </span>
        </div>

        <div className='flex flex-wrap items-center gap-2.5'>
          <Botao
            como={Link}
            to={`/empresa/anuncios/${anuncio.id}/editar`}
            cor='laranja'
            classe='min-h-[44px]!'
          >
            Editar anúncio
          </Botao>

          {anuncio.situacao === 'ativo' ? (
            <Botao
              type='button'
              variante='secundario'
              classe='min-h-[44px]!'
              onClick={() => aoAcionar('pausar')}
            >
              Pausar anúncio
            </Botao>
          ) : anuncio.situacao === 'pausado' ? (
            <Botao
              type='button'
              variante='secundario'
              classe='min-h-[44px]!'
              onClick={() => aoAcionar('reativar')}
            >
              Reativar anúncio
            </Botao>
          ) : anuncio.situacao === 'expirado' ? (
            <Botao
              type='button'
              variante='secundario'
              classe='min-h-[44px]!'
              onClick={() => aoAcionar('renovar')}
            >
              Renovar anúncio
            </Botao>
          ) : (
            <Botao
              como={Link}
              to={`/empresa/anuncios/${anuncio.id}/previa`}
              variante='secundario'
              classe='min-h-[44px]!'
            >
              Revisar publicação
            </Botao>
          )}

          <Botao
            como={Link}
            to={`/empresa/anuncios/${anuncio.id}/previa`}
            variante='fantasma'
            classe='min-h-[44px]! border border-[#dbe5ed]'
          >
            Ver prévia pública
          </Botao>

          <button
            type='button'
            onClick={() => aoAcionar('excluir')}
            className='min-h-[44px] cursor-pointer px-3 text-sm font-bold text-[#b42318] hover:underline'
          >
            Excluir anúncio
          </button>
        </div>
      </div>

      <div
        role='group'
        aria-label='Seções do anúncio'
        className='flex flex-wrap gap-2'
      >
        {[
          ['visaoGeral', 'Visão geral'],
          ['desempenho', 'Desempenho'],
          ['fotos', `Fotos (${anuncio.fotos.length})`],
        ].map(([id, rotulo]) => (
          <button
            key={id}
            type='button'
            aria-pressed={aba === id}
            onClick={() => setAba(id)}
            className={`min-h-11 cursor-pointer rounded-full px-5 text-sm font-bold transition-colors ${
              aba === id
                ? 'bg-(--azul-titulo) text-white'
                : 'border border-[#dbe5ed] bg-[#f4f7fa] text-(--azul-titulo) hover:bg-[#e6edf2]'
            }`}
          >
            {rotulo}
          </button>
        ))}
      </div>

      {aba === 'visaoGeral' && (
        <div className='grid gap-6 lg:grid-cols-2'>
          <div className='overflow-hidden rounded-2xl border border-[#dbe5ed] bg-white'>
            <ImagemServicoEmpresa
              anuncio={anuncio}
              classe='aspect-[16/10] w-full'
            />
          </div>

          <CartaoEmpresa titulo='Informações do serviço'>
            <dl className='grid grid-cols-[auto_minmax(0,1fr)] gap-x-6 gap-y-3.5 text-sm'>
              {[
                ['Categoria', anuncio.categoria],
                ['Atendimento', anuncio.atendimento],
                ['Preço', anuncio.preco],
                ['Região', anuncio.regiao],
                ['Disponibilidade', anuncio.disponibilidade],
                ['Telefone', anuncio.telefone],
                ['E-mail', anuncio.email],
              ].map(([rotulo, valor]) => (
                <div key={rotulo} className='contents'>
                  <dt className='font-bold text-(--texto-apoio)'>{rotulo}</dt>
                  <dd className='text-(--azul-titulo)'>
                    {valor || 'Não informado'}
                  </dd>
                </div>
              ))}
            </dl>
          </CartaoEmpresa>

          <CartaoEmpresa titulo='Descrição completa' classe='lg:col-span-2'>
            <p className='leading-relaxed whitespace-pre-wrap text-(--azul-titulo)'>
              {anuncio.descricao ||
                'Adicione uma descrição para apresentar seu serviço com mais clareza.'}
            </p>
          </CartaoEmpresa>
        </div>
      )}

      {aba === 'desempenho' && (
        <GradeMetricasEmpresa
          colunas={3}
          itens={[
            {
              rotulo: 'Visualizações (exemplo)',
              valor: anuncio.visualizacoes,
              apoio: 'Acessos registrados neste serviço',
            },
            {
              rotulo: 'Contatos recebidos',
              valor: anuncio.contatosRecebidos,
              apoio: 'Solicitações diretas dos moradores',
              destaque: true,
            },
            {
              rotulo: 'Conversão em contato',
              valor: anuncio.visualizacoes
                ? `${((anuncio.contatosRecebidos / anuncio.visualizacoes) * 100).toLocaleString('pt-BR', { maximumFractionDigits: 1 })}%`
                : '0%',
              apoio: 'Proporção de visitantes que enviaram pedido',
            },
          ]}
        />
      )}

      {aba === 'fotos' && (
        <CartaoEmpresa
          titulo='Fotos do anúncio'
          acao={
            <Botao
              como={Link}
              to={`/empresa/anuncios/${anuncio.id}/fotos`}
              cor='laranja'
              classe='min-h-[42px]!'
            >
              Editar fotos
            </Botao>
          }
        >
          {anuncio.fotos.length ? (
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
              {anuncio.fotos.map((foto, indice) => (
                <img
                  key={`${foto}-${indice}`}
                  src={foto}
                  alt={`Foto do serviço ${indice + 1}`}
                  className='aspect-[1.5] w-full rounded-xl border border-[#dbe5ed] object-cover'
                />
              ))}
            </div>
          ) : (
            <p className='text-sm text-(--texto-apoio)'>
              Nenhuma foto personalizada enviada ainda. A capa ilustrativa do
              serviço está sendo exibida.
            </p>
          )}
        </CartaoEmpresa>
      )}
    </div>
  );
}
