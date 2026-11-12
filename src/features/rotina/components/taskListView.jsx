import { useState } from 'react';
import { categoriasRotina } from '../content';
import { chaveData, formatarData, diaRelativo } from '../utils/dates';
import {
  EstadoVazioRotina,
  BotaoRotina,
  CabecalhoRotina,
} from './routineUi';
import LinhaTarefa from './taskRow';
import classesRotina from '../routineClasses';

export default function VisaoListaTarefas({
  tarefas,
  aoVoltar,
  aoCriar,
  aoAssistente,
  aoAbrir,
  aoConcluir,
  aoAcao,
}) {
  const [categoria, setCategoria] = useState('todas');
  const [diasVisiveis, setDiasVisiveis] = useState(2);
  const filtradas = tarefas.filter(
    tarefa => categoria === 'todas' || tarefa.category === categoria
  );
  const grupos = [...Map.groupBy(filtradas, tarefa => tarefa.occurrenceDate)];

  return (
    <div>
      <CabecalhoRotina
        titulo='Lista de tarefas'
        descricao='Veja todas as suas tarefas e gerencie sua rotina.'
        aoVoltar={aoVoltar}
      >
        <BotaoRotina classe={classesRotina.botaoPequeno} onClick={aoCriar}>
          Criar tarefa <span aria-hidden='true'>+</span>
        </BotaoRotina>
      </CabecalhoRotina>
      <div
        className={classesRotina.filtrosCategoria}
        role='group'
        aria-label='Filtrar tarefas por categoria'
      >
        {[{ id: 'todas', rotulo: 'Todas' }, ...categoriasRotina].map(item => (
          <button
            key={item.id}
            type='button'
            aria-pressed={categoria === item.id}
            className={categoria === item.id ? classesRotina.filtroAtivo : ''}
            onClick={() => {
              setCategoria(item.id);
              setDiasVisiveis(2);
            }}
          >
            {item.rotulo}
          </button>
        ))}
      </div>
      {gruposOuVazio(grupos, diasVisiveis, aoAbrir, aoConcluir, aoAcao, () => setDiasVisiveis(contador => contador + 7), categoria, aoCriar, aoAssistente)}
    </div>
  );
}

function gruposOuVazio(
  grupos,
  diasVisiveis,
  aoAbrir,
  aoConcluir,
  aoAcao,
  aoCarregarMais,
  categoria,
  aoCriar,
  aoAssistente
) {
  if (!grupos.length) {
    return (
      <EstadoVazioRotina
        titulo={
          categoria === 'todas' ? undefined : 'Tudo em dia nesta categoria.'
        }
        descricao={
          categoria === 'todas'
            ? undefined
            : 'Nenhuma tarefa pendente para os próximos 30 dias.'
        }
        aoCriar={aoCriar}
        aoAssistente={aoAssistente}
      />
    );
  }
  return (
    <>
      <div className={classesRotina.gruposTarefas}>
        {grupos.slice(0, diasVisiveis).map(([dia, tarefasDia]) => (
          <section key={dia} aria-label={`Tarefas de ${formatarData(dia)}`}>
            <h2 className={classesRotina.cabecalhoGrupoData}>
              {dia < chaveData() ? 'Pendente' : diaRelativo(dia)} ·{' '}
              {formatarData(dia)}
            </h2>
            <div>
              {tarefasDia.map(tarefa => (
                <LinhaTarefa
                  key={tarefa.occurrenceId}
                  tarefa={tarefa}
                  aoAbrir={aoAbrir}
                  aoConcluir={aoConcluir}
                  aoAcao={aoAcao}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
      {grupos.length > diasVisiveis && (
        <BotaoRotina
          tom='secundario'
          classe={classesRotina.carregarMais}
          onClick={aoCarregarMais}
        >
          Ver próximos dias
        </BotaoRotina>
      )}
    </>
  );
}
