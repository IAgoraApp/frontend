import { CalendarDays, Check, Pencil, Trash2 } from 'lucide-react';
import { dataCurta } from '../../../app/dados/bancoMvp';
import { situacaoLimpeza } from '../utils/agendaLimpeza';

export default function ListaLimpezas({
  registros,
  comodos,
  hoje,
  aoConcluir,
  aoEditar,
  aoExcluir,
}) {
  return (
    <ol className='limpeza-lista-tarefas'>
      {registros.map(l => {
        const situacao = situacaoLimpeza(l, hoje);
        return (
          <li
            className={`limpeza-tarefa limpeza-tarefa-${situacao.classe}`}
            key={l.id}
          >
            <button
              className='limpeza-concluir'
              type='button'
              disabled={situacao.classe === 'feita'}
              aria-label={
                situacao.classe === 'feita'
                  ? `Limpeza feita hoje: ${l.nome}`
                  : `Concluir limpeza: ${l.nome}`
              }
              onClick={() => aoConcluir(l)}
            >
              <Check size={17} aria-hidden='true' />
            </button>
            <div className='limpeza-tarefa-texto'>
              <strong>{l.nome}</strong>
              <p>
                {comodos.find(c => c.id === l.comodo_id)?.nome}
                {l.descricao ? ` · ${l.descricao}` : ''}
              </p>
              <small>
                Última limpeza:{' '}
                {l.ultima_vez ? dataCurta(l.ultima_vez) : 'Não registrada'}
              </small>
            </div>
            <div className='limpeza-tarefa-data'>
              <span
                className={`limpeza-situacao limpeza-situacao-${situacao.classe}`}
              >
                {situacao.nome}
              </span>
              <span>
                <CalendarDays size={13} aria-hidden='true' />
                {l.proxima_vez ? dataCurta(l.proxima_vez) : 'Definir data'}
              </span>
            </div>
            <div className='limpeza-tarefa-acoes'>
              <button
                type='button'
                aria-label={`Editar limpeza: ${l.nome}`}
                onClick={() => aoEditar(l)}
              >
                <Pencil size={16} />
              </button>
              <button
                type='button'
                aria-label={`Excluir limpeza: ${l.nome}`}
                onClick={() => aoExcluir(l)}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
