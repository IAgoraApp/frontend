import { dataCurta } from '../../app/dados/bancoMvp';
import { VazioMvp } from '../../shared/ui/mvp';

export default function AvaliacoesServico({ avaliacoes }) {
  return (
    <section
      className='mvp-painel mercado-a-avaliacoes'
      id='avaliacoes-servico'
      aria-labelledby='mercado-a-avaliacoes-titulo'
      tabIndex={-1}
    >
      <div className='mvp-painel-topo'>
        <h2 id='mercado-a-avaliacoes-titulo'>Avaliações</h2>
        <span>
          {avaliacoes.length}{' '}
          {avaliacoes.length === 1 ? 'avaliação' : 'avaliações'}
        </span>
      </div>
      {avaliacoes.length ? (
        <ul
          className='mercado-a-avaliacoes-lista'
          tabIndex={0}
          aria-label='Comentários do serviço'
        >
          {avaliacoes.map(a => (
            <li key={a.id}>
              <div>
                <strong>{a.nota} de 5</strong>
                <small>{dataCurta(a.data_avaliacao)}</small>
              </div>
              {a.comentario && <p>{a.comentario}</p>}
            </li>
          ))}
        </ul>
      ) : (
        <VazioMvp>Ainda não há avaliações deste serviço.</VazioMvp>
      )}
    </section>
  );
}
