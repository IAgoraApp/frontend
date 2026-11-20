import { useState } from 'react';
import { ChevronRight, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { VazioMvp } from '../../../shared/ui/mvp';
import {
  FotoServico,
  NotaServico,
} from '../../marketplace/catalogoMarketplaceA';
import {
  nomeCategoria,
  normalizarBusca,
  precoServico,
} from '../../marketplace/marketplaceDados';
import { situacaoServico } from '../empresaDados';

export default function ListaAnuncios({ servicos, empresa, publicacoes }) {
  const [busca, setBusca] = useState('');
  const consulta = normalizarBusca(busca);
  const resultados = servicos.filter(s =>
    normalizarBusca(s.titulo + ' ' + nomeCategoria(s.categoria)).includes(
      consulta
    )
  );

  if (!servicos.length)
    return (
      <VazioMvp>
        Cadastre seu primeiro serviço para montar o catálogo da empresa.
      </VazioMvp>
    );

  return (
    <section aria-label='Catálogo da empresa'>
      <div className='empresa-servicos-barra'>
        <label>
          <Search size={18} aria-hidden='true' />
          <input
            type='search'
            placeholder='Buscar serviço'
            aria-label='Buscar serviço'
            value={busca}
            onChange={e => setBusca(e.target.value)}
          />
        </label>
        <span role='status'>
          {resultados.length} {resultados.length === 1 ? 'serviço' : 'serviços'}
        </span>
      </div>
      {resultados.length ? (
        <ul className='empresa-servicos-grade'>
          {resultados.map(s => (
            <li key={s.id}>
              <Link
                className='empresa-servico-card'
                to={`/empresa/anuncios/${s.id}`}
              >
                <div className='mercado-a-cartao-foto'>
                  <FotoServico key={s.fotos?.[0]} servico={s} />
                </div>
                <div className='empresa-servico-card-dados'>
                  <div className='empresa-servico-meta'>
                    <span>{nomeCategoria(s.categoria)}</span>
                    <span className='empresa-servico-status'>
                      {situacaoServico(s, empresa, publicacoes)}
                    </span>
                  </div>
                  <h2>{s.titulo}</h2>
                  <div className='empresa-servico-card-valor'>
                    <strong>{precoServico(s)}</strong>
                    {s.nota != null && <NotaServico nota={s.nota} />}
                  </div>
                  <span className='empresa-servico-card-link'>
                    Ver serviço <ChevronRight size={17} aria-hidden='true' />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <VazioMvp>
          Nenhum serviço encontrado. Tente outro nome ou categoria.
        </VazioMvp>
      )}
    </section>
  );
}
