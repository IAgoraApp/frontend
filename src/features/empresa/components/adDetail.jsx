import { useState } from 'react';
import { CalendarDays, Eye, Images, Pencil } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  FotoServico,
  NotaServico,
} from '../../marketplace/catalogoMarketplaceA';
import {
  nomeCategoria,
  precoServico,
} from '../../marketplace/marketplaceDados';
import { nomeDiaServico } from './servicoDisponibilidade';
import { situacaoServico } from '../empresaDados';

export default function DetalheAnuncio({
  anuncio,
  empresa,
  publicacoes,
  previa,
  aoEditar,
  aoAcionar,
  podeExcluir,
}) {
  const [fotoSelecionada, setFotoSelecionada] = useState(0);
  const rota = `/empresa/anuncios/${anuncio.id}`;
  const fotos = anuncio.fotos ?? [];
  const dias = anuncio.disponibilidade?.dias ?? [];

  return (
    <section
      id='dados-anuncio'
      tabIndex={-1}
      className='empresa-servico-ficha'
      aria-label='Ficha do serviço'
    >
      <div className='empresa-servico-vitrine'>
        <div className='empresa-servico-galeria'>
          <div className='empresa-servico-foto mercado-a-cartao-foto'>
            <FotoServico
              key={fotoSelecionada}
              servico={{
                ...anuncio,
                fotos: fotos.slice(fotoSelecionada, fotoSelecionada + 1),
              }}
              destaque
            />
          </div>
          {fotos.length > 1 && (
            <div
              className='empresa-servico-miniaturas'
              role='group'
              aria-label='Fotos do serviço'
            >
              {fotos.map((foto, indice) => (
                <button
                  key={indice}
                  type='button'
                  aria-label={'Ver foto ' + (indice + 1)}
                  aria-pressed={indice === fotoSelecionada}
                  onClick={() => setFotoSelecionada(indice)}
                >
                  <FotoServico servico={{ ...anuncio, fotos: [foto] }} />
                </button>
              ))}
            </div>
          )}
        </div>
        <div className='empresa-servico-info'>
          <div className='empresa-servico-meta'>
            <span>{nomeCategoria(anuncio.categoria)}</span>
            {!previa && (
              <span className='empresa-servico-status'>
                {situacaoServico(anuncio, empresa, publicacoes)}
              </span>
            )}
          </div>
          <p>{empresa.nome}</p>
          <strong className='empresa-servico-preco'>
            {precoServico(anuncio)}
          </strong>
          {anuncio.nota != null && <NotaServico nota={anuncio.nota} />}
          <div className='empresa-servico-disponibilidade'>
            <CalendarDays size={19} aria-hidden='true' />
            <div>
              <strong>Disponibilidade</strong>
              <p>
                {dias.length
                  ? dias.map(nomeDiaServico).join(', ')
                  : 'A combinar com o cliente'}
              </p>
            </div>
          </div>
          <div className='empresa-servico-ferramentas'>
            <button
              type='button'
              className='mvp-primario'
              aria-haspopup='dialog'
              onClick={aoEditar}
            >
              <Pencil size={19} aria-hidden='true' /> Editar informações
            </button>
            {!previa && (
              <>
                <Link className='mvp-link' to={rota + '/fotos'}>
                  <Images size={16} aria-hidden='true' /> Gerenciar fotos
                </Link>
                <Link className='mvp-link' to={rota + '/previa'}>
                  <Eye size={16} aria-hidden='true' /> Ver prévia
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
      <div className='empresa-servico-sobre'>
        <h2>Sobre o serviço</h2>
        <p>{anuncio.descricao}</p>
      </div>
      {!previa && (
        <div className='empresa-servico-operacoes'>
          {empresa.validado &&
            !anuncio.validado &&
            anuncio.status_publicacao !== 'pendente' && (
              <button
                type='button'
                className='mvp-primario'
                onClick={() => aoAcionar('validar')}
              >
                Enviar para análise
              </button>
            )}
          <button
            type='button'
            className='mvp-link'
            onClick={() => aoAcionar(anuncio.ativo ? 'desativar' : 'ativar')}
          >
            {anuncio.ativo ? 'Desativar serviço' : 'Ativar serviço'}
          </button>
          {podeExcluir && (
            <button
              type='button'
              className='mvp-link empresa-servico-excluir'
              onClick={() => aoAcionar('excluir')}
            >
              Excluir serviço
            </button>
          )}
        </div>
      )}
    </section>
  );
}
