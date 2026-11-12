import { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ChevronDown } from 'lucide-react';
import { categoriasRotina, diasSemanaRotina } from '../content';
import {
  adicionarDias,
  diasCalendario,
  chaveData,
  formatarData,
  rotuloMes,
  analisarData,
} from '../utils/dates';
import { CabecalhoRotina, PontoCategoriaRotina } from './routineUi';
import classesRotina from '../routineClasses';

export default function VisaoCalendario({
  mes,
  aoMudarMes,
  ocorrencias,
  aoSelecionarDia,
  aoEscolherMes,
  aoVoltar,
  aoAgenda,
  conectada,
}) {
  const hoje = chaveData();
  const [dataFocada, setDataFocada] = useState(hoje);
  const celulas = useRef(new Map());
  const dias = diasCalendario(mes);
  const quantidadeSemanas = dias.length / 7;
  const porDia = Map.groupBy(ocorrencias, tarefa => tarefa.occurrenceDate);
  const diaFoco = dias.includes(dataFocada)
    ? dataFocada
    : dias.find(dia => analisarData(dia).getMonth() === mes.getMonth());

  function moverMes(deslocamento) {
    aoMudarMes(new Date(mes.getFullYear(), mes.getMonth() + deslocamento, 1, 12));
  }

  function navegarDia(evento, dia) {
    const indice = dias.indexOf(dia);
    const deslocamentos = {
      ArrowLeft: -1,
      ArrowRight: 1,
      ArrowUp: -7,
      ArrowDown: 7,
      Home: -(indice % 7),
      End: 6 - (indice % 7),
    };
    if (!(evento.key in deslocamentos)) return;
    evento.preventDefault();
    const destino = adicionarDias(dia, deslocamentos[evento.key]);
    setDataFocada(destino);
    if (!dias.includes(destino)) aoMudarMes(analisarData(destino));
    requestAnimationFrame(() => celulas.current.get(destino)?.focus());
  }

  return (
    <div className={classesRotina.visaoCalendario}>
      <CabecalhoRotina
        compacto
        titulo='Calendário'
        descricao='Visualize suas tarefas por dia.'
        aoVoltar={aoVoltar}
      />
      <div className={classesRotina.barraCalendario}>
        <button
          type='button'
          className={classesRotina.controleCalendario}
          onClick={() => {
            aoMudarMes(new Date());
            setDataFocada(hoje);
          }}
        >
          Hoje
        </button>
        <button
          type='button'
          className={classesRotina.controleCalendario}
          aria-label='Mês anterior'
          onClick={() => moverMes(-1)}
        >
          <ArrowLeft size={18} />
        </button>
        <button
          type='button'
          className={classesRotina.controleCalendario}
          aria-label='Próximo mês'
          onClick={() => moverMes(1)}
        >
          <ArrowRight size={18} />
        </button>
        <button
          type='button'
          className={`${classesRotina.controleCalendario} ${classesRotina.controleMes}`}
          onClick={aoEscolherMes}
          aria-haspopup='dialog'
        >
          <span aria-live='polite'>{rotuloMes(mes)}</span>
          <ChevronDown size={16} aria-hidden='true' />
        </button>
      </div>
      <div
        className={classesRotina.gradeMes}
        role='grid'
        aria-label={rotuloMes(mes)}
        style={{ '--semanas-calendario': quantidadeSemanas }}
      >
        <div className={classesRotina.linhaDiasSemana} role='row'>
          {diasSemanaRotina.map(dia => (
            <span key={dia.id} role='columnheader' aria-label={dia.rotulo}>
              {dia.sigla}
            </span>
          ))}
        </div>
        {Array.from({ length: quantidadeSemanas }, (_, semana) => (
          <div className={classesRotina.semanaCalendario} key={semana} role='row'>
            {dias.slice(semana * 7, semana * 7 + 7).map(dia => {
              const tarefas = porDia.get(dia) ?? [];
              const categoriasDia = categoriasRotina.filter(categoria =>
                tarefas.some(tarefa => tarefa.category === categoria.id)
              );
              const foraMes = analisarData(dia).getMonth() !== mes.getMonth();
              return (
                <button
                  ref={elemento => {
                    if (elemento) celulas.current.set(dia, elemento);
                    else celulas.current.delete(dia);
                  }}
                  type='button'
                  role='gridcell'
                  key={dia}
                  tabIndex={diaFoco === dia ? 0 : -1}
                  aria-current={dia === hoje ? 'date' : undefined}
                  aria-label={`${formatarData(dia, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}, ${tarefas.length} ${tarefas.length === 1 ? 'tarefa' : 'tarefas'}`}
                  className={`${classesRotina.diaCalendario} ${foraMes ? classesRotina.diaForaMes : ''} ${dia === hoje ? classesRotina.hoje : ''}`}
                  onClick={() => {
                    setDataFocada(dia);
                    aoSelecionarDia(dia);
                  }}
                  onFocus={() => setDataFocada(dia)}
                  onKeyDown={evento => navegarDia(evento, dia)}
                >
                  <span className={classesRotina.numeroDia}>
                    {analisarData(dia).getDate()}
                  </span>
                  <span className={classesRotina.marcadoresDia}>
                    {categoriasDia.map(categoria => (
                      <PontoCategoriaRotina
                        key={categoria.id}
                        categoria={categoria.id}
                      />
                    ))}
                  </span>
                </button>
              );
            })}
          </div>
        ))}
      </div>
      <div className={classesRotina.rodapeCalendario}>
        <div
          className={classesRotina.legendaCalendario}
          aria-label='Categorias das tarefas'
        >
          {categoriasRotina.map(categoria => (
            <span key={categoria.id}>
              <PontoCategoriaRotina categoria={categoria.id} />
              {categoria.rotulo}
            </span>
          ))}
        </div>
        <button
          type='button'
          className={classesRotina.acaoTexto}
          onClick={aoAgenda}
        >
          {conectada ? 'Gerenciar agenda' : 'Conectar agenda'}
        </button>
      </div>
    </div>
  );
}
