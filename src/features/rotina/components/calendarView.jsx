import { useRef, useState } from 'react';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ListChecks,
  Plus,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useBancoMvp } from '../../../app/dados/bancoMvp';
import { diasSemanaRotina } from '../content';
import {
  adicionarDias,
  analisarData,
  chaveData,
  diasCalendario,
  formatarData,
  rotuloMes,
} from '../utils/dates';
import { BotaoRotina } from './routineUi';
import { listarCompromissos } from '../utils/compromissos';

const tipos = {
  tarefa: { nome: 'Tarefas' },
  limpeza: { nome: 'Limpeza' },
  conta: { nome: 'Finanças' },
};

export default function VisaoCalendario({
  mes,
  aoMudarMes,
  ocorrencias,
  mostrarTudo,
  aoMostrarTudo,
  aoEscolherMes,
  aoCriar,
  aoAbrir,
  aoConcluir,
  aoDesfazer,
}) {
  const { limpezas, transacoes } = useBancoMvp();
  const hoje = chaveData();
  const [dataSelecionada, setDataSelecionada] = useState(hoje);
  const celulas = useRef(new Map());
  const dias = diasCalendario(mes);
  const mesAtual = chaveData(mes).slice(0, 7);
  const diaAtivo = dataSelecionada.startsWith(mesAtual)
    ? dataSelecionada
    : mesAtual + '-01';
  const eventos = [
    ...ocorrencias.map(t => ({
      id: 'tarefa-' + t.occurrenceId,
      data: t.occurrenceDate,
      tipo: 'tarefa',
      titulo: t.title,
      detalhe: t.completed ? 'Concluída' : t.time,
      tarefa: t,
    })),
    ...(mostrarTudo ? listarCompromissos(limpezas, transacoes) : []),
  ];
  const porDia = Map.groupBy(eventos, evento => evento.data);
  const itens = porDia.get(diaAtivo) ?? [];

  function selecionar(dia) {
    setDataSelecionada(dia);
    if (!dia.startsWith(mesAtual)) aoMudarMes(analisarData(dia));
  }

  function navegarDia(evento, dia) {
    const indice = dias.indexOf(dia);
    const deslocamento = {
      ArrowLeft: -1,
      ArrowRight: 1,
      ArrowUp: -7,
      ArrowDown: 7,
      Home: -(indice % 7),
      End: 6 - (indice % 7),
    }[evento.key];
    if (deslocamento === undefined) return;
    evento.preventDefault();
    const destino = adicionarDias(dia, deslocamento);
    selecionar(destino);
    requestAnimationFrame(() => celulas.current.get(destino)?.focus());
  }

  return (
    <div className='rotina-agenda'>
      <div className='rotina-agenda-paineis'>
        <section
          className='rotina-calendario'
          aria-label='Calendário de compromissos'
        >
          <div className='rotina-mes'>
            <button
              type='button'
              className='rotina-mes-titulo'
              onClick={aoEscolherMes}
              aria-haspopup='dialog'
            >
              {rotuloMes(mes)} <ChevronDown size={16} aria-hidden='true' />
            </button>
            <div className='rotina-mes-acoes'>
              <button type='button' onClick={() => selecionar(hoje)}>
                Hoje
              </button>
              <button
                type='button'
                aria-label='Mês anterior'
                onClick={() =>
                  selecionar(
                    chaveData(
                      new Date(mes.getFullYear(), mes.getMonth() - 1, 1)
                    )
                  )
                }
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type='button'
                aria-label='Próximo mês'
                onClick={() =>
                  selecionar(
                    chaveData(
                      new Date(mes.getFullYear(), mes.getMonth() + 1, 1)
                    )
                  )
                }
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
          <div
            className='rotina-grade-mes'
            role='grid'
            aria-label={rotuloMes(mes)}
            style={{ '--semanas': dias.length / 7 }}
          >
            <div className='rotina-semana rotina-semana-titulos' role='row'>
              {diasSemanaRotina.map(dia => (
                <span key={dia.id} role='columnheader' aria-label={dia.rotulo}>
                  {dia.sigla}
                </span>
              ))}
            </div>
            {Array.from({ length: dias.length / 7 }, (_, semana) => (
              <div className='rotina-semana' role='row' key={semana}>
                {dias.slice(semana * 7, semana * 7 + 7).map(dia => {
                  const marcadores = [
                    ...new Set((porDia.get(dia) ?? []).map(e => e.tipo)),
                  ];
                  return (
                    <button
                      type='button'
                      role='gridcell'
                      key={dia}
                      ref={elemento => {
                        if (elemento) celulas.current.set(dia, elemento);
                        else celulas.current.delete(dia);
                      }}
                      aria-selected={dia === diaAtivo}
                      aria-current={dia === hoje ? 'date' : undefined}
                      aria-label={[
                        formatarData(dia),
                        ...marcadores.map(tipo => tipos[tipo].nome),
                      ].join(', ')}
                      data-fora-mes={!dia.startsWith(mesAtual)}
                      tabIndex={dia === diaAtivo ? 0 : -1}
                      onClick={() => selecionar(dia)}
                      onKeyDown={evento => navegarDia(evento, dia)}
                    >
                      <span>{Number(dia.slice(-2))}</span>
                      <span className='rotina-agenda-pontos' aria-hidden='true'>
                        {marcadores.map(tipo => (
                          <span
                            className='rotina-agenda-ponto'
                            data-tipo={tipo}
                            key={tipo}
                          />
                        ))}
                      </span>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
          <div className='rotina-calendario-rodape'>
            <label className='rotina-mostrar-tudo'>
              <input
                type='checkbox'
                checked={mostrarTudo}
                onChange={e => aoMostrarTudo(e.target.checked)}
              />{' '}
              Mostrar tudo
            </label>
            <ul
              className='rotina-agenda-legenda'
              aria-label='Legenda do calendário'
            >
              {Object.entries(tipos)
                .filter(([tipo]) => mostrarTudo || tipo === 'tarefa')
                .map(([tipo, { nome }]) => (
                  <li key={tipo}>
                    <span
                      className='rotina-agenda-ponto'
                      data-tipo={tipo}
                      aria-hidden='true'
                    />
                    {nome}
                  </li>
                ))}
            </ul>
          </div>
        </section>

        <section
          className='rotina-agenda-dia'
          aria-labelledby='rotina-agenda-dia-titulo'
        >
          <header className='rotina-agenda-dia-topo'>
            <div>
              <h2 id='rotina-agenda-dia-titulo' aria-live='polite'>
                {diaAtivo === hoje ? 'Hoje' : 'Agenda do dia'}
              </h2>
              <p>
                {formatarData(diaAtivo, {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                })}
              </p>
            </div>
            <BotaoRotina
              classe='rotina-agenda-nova'
              onClick={() => aoCriar(diaAtivo)}
            >
              <Plus size={18} aria-hidden='true' /> Nova tarefa
            </BotaoRotina>
          </header>
          <div className='rotina-agenda-itens'>
            {itens.length ? (
              <ul>
                {itens.map(
                  ({ id, tipo, titulo, detalhe, tarefa, rota, subtitulo }) => {
                    return (
                      <li
                        className='rotina-agenda-item'
                        data-concluida={tarefa?.completed}
                        key={id}
                      >
                        {tarefa ? (
                          <input
                            type='checkbox'
                            className='rotina-agenda-checkbox'
                            checked={tarefa.completed}
                            aria-label={
                              tarefa.completed
                                ? 'Reabrir ' + titulo
                                : 'Concluir ' + titulo
                            }
                            onChange={() =>
                              tarefa.completed
                                ? aoDesfazer(tarefa)
                                : aoConcluir(tarefa)
                            }
                          />
                        ) : (
                          <span
                            className='rotina-agenda-ponto'
                            data-tipo={tipo}
                            aria-hidden='true'
                          />
                        )}
                        {tarefa ? (
                          <button
                            type='button'
                            className='rotina-agenda-item-texto'
                            onClick={() => aoAbrir(tarefa)}
                          >
                            <strong>{titulo}</strong>
                            <span>{detalhe}</span>
                          </button>
                        ) : (
                          <Link className='rotina-agenda-item-texto' to={rota}>
                            <span className='rotina-agenda-item-nome'>
                              <strong>{titulo}</strong>
                              <span>
                                {tipo === 'conta' ? subtitulo : detalhe}
                              </span>
                            </span>
                            {tipo === 'conta' && (
                              <span className='rotina-agenda-valor'>
                                {detalhe}
                              </span>
                            )}
                          </Link>
                        )}
                      </li>
                    );
                  }
                )}
              </ul>
            ) : (
              <div className='rotina-agenda-vazio'>
                <ListChecks size={22} aria-hidden='true' />
                <p>
                  {mostrarTudo
                    ? 'Nenhum compromisso neste dia.'
                    : 'Nenhuma tarefa neste dia.'}
                </p>
              </div>
            )}
          </div>
          <Link className='rotina-agenda-link-lista' to='/rotina?visao=lista'>
            Ver agenda em lista
          </Link>
        </section>
      </div>
    </div>
  );
}
