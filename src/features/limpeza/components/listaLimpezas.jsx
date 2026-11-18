import { CalendarDays, Check, Pencil } from 'lucide-react';
import { dataCurta } from '../../../app/dados/bancoMvp';
import { situacaoLimpeza } from '../utils/agendaLimpeza';

export default function ListaLimpezas({
  registros,
  comodos,
  hoje,
  aoConcluir,
  aoEditar,
  aoAbrirComodo,
  mostrarComodo = true,
  compacta = false,
}) {
  return (
    <ol
      className={
        compacta
          ? 'limpeza-lista-tarefas limpeza-lista-compacta'
          : 'limpeza-lista-tarefas'
      }
    >
      {registros.map(l => {
        const situacao = situacaoLimpeza(l, hoje);
        return (
          <li
            className={`limpeza-tarefa limpeza-tarefa-${situacao.classe}`}
            key={l.id}
          >
            {aoAbrirComodo && (
              <button
                type='button'
                className='limpeza-abrir-comodo'
                aria-haspopup='dialog'
                aria-label={`Abrir cômodo de ${l.nome}`}
                onClick={() => aoAbrirComodo(l.comodo_id)}
              />
            )}
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
            <div className='limpeza-tarefa-corpo'>
              <h3>{l.nome}</h3>
              {mostrarComodo && (
                <span className='limpeza-tarefa-comodo'>
                  {comodos.find(c => c.id === l.comodo_id)?.nome}
                </span>
              )}
              {l.descricao && <p>{l.descricao}</p>}
              {!compacta && (
                <div className='limpeza-tarefa-datas'>
                  <span>
                    <CalendarDays size={14} aria-hidden='true' />
                    {l.proxima_vez
                      ? `Próxima: ${dataCurta(l.proxima_vez)}`
                      : 'Sem data prevista'}
                  </span>
                  <span>
                    {l.ultima_vez
                      ? `Última: ${dataCurta(l.ultima_vez)}`
                      : 'Ainda não realizada'}
                  </span>
                </div>
              )}
            </div>
            <div className='limpeza-tarefa-lateral'>
              <span
                className={`limpeza-situacao limpeza-situacao-${situacao.classe}`}
              >
                {compacta && situacao.classe === 'agendada'
                  ? dataCurta(l.proxima_vez)
                  : situacao.nome}
              </span>
              <div className='limpeza-tarefa-ferramentas'>
                <button
                  type='button'
                  aria-label={`Editar limpeza: ${l.nome}`}
                  title='Editar limpeza'
                  onClick={() => aoEditar(l)}
                >
                  <Pencil size={16} />
                </button>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
