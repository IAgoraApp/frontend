import { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { formatarData, rotuloMes } from '../utilitarios/datas';
import { BotaoRotina, CabecalhoModalRotina } from './InterfaceRotina';
import LinhaTarefa from './LinhaTarefa';
import classesRotina from '../classesRotina';

export function DialogoExcluirTarefa({
  tarefa,
  aoExcluir,
  aoCancelar,
  idTitulo,
}) {
  return (
    <div className={classesRotina.conteudoModal}>
      <CabecalhoModalRotina
        editorial
        id={idTitulo}
        titulo={`Excluir ${tarefa.title.charAt(0).toLowerCase() + tarefa.title.slice(1)}?`}
        descricao={
          tarefa.frequency === 'none'
            ? 'Esta tarefa será removida da sua rotina.'
            : 'Escolha se deseja excluir apenas esta ocorrência ou a repetição inteira.'
        }
      />
      <div className={classesRotina.acoes} data-acoes>
        <BotaoRotina onClick={() => aoExcluir('occurrence')}>
          {tarefa.frequency === 'none' ? 'Excluir tarefa' : 'Só esta ocorrência'}
        </BotaoRotina>
        {tarefa.frequency !== 'none' && (
          <BotaoRotina tom='secundario' onClick={() => aoExcluir('series')}>
            Toda a repetição
          </BotaoRotina>
        )}
      </div>
      <BotaoRotina tom='fantasma' onClick={aoCancelar}>
        Cancelar
      </BotaoRotina>
    </div>
  );
}

export function DialogoResultado({
  titulo,
  descricao,
  aoContinuar,
  idTitulo,
}) {
  return (
    <div className={classesRotina.conteudoModal}>
      <CabecalhoModalRotina
        editorial
        id={idTitulo}
        titulo={titulo}
        descricao={descricao}
      />
      <BotaoRotina onClick={aoContinuar}>Continuar</BotaoRotina>
    </div>
  );
}

export function SeletorMes({ mes, aoSelecionar, idTitulo }) {
  const [ano, setAno] = useState(mes.getFullYear());
  return (
    <div className={classesRotina.conteudoModal}>
      <CabecalhoModalRotina
        editorial
        id={idTitulo}
        titulo='Qual mês você quer ver?'
        descricao='Escolha o mês para organizar suas tarefas.'
      />
      <div className={classesRotina.seletorAno}>
        <button
          type='button'
          className={classesRotina.controleCalendario}
          aria-label='Ano anterior'
          disabled={ano <= 1900}
          onClick={() => setAno(valor => valor - 1)}
        >
          <ArrowLeft size={18} />
        </button>
        <span aria-live='polite'>{ano}</span>
        <button
          type='button'
          className={classesRotina.controleCalendario}
          aria-label='Próximo ano'
          disabled={ano >= 2100}
          onClick={() => setAno(valor => valor + 1)}
        >
          <ArrowRight size={18} />
        </button>
      </div>
      <div className={classesRotina.opcoesMes}>
        {Array.from({ length: 12 }, (_, indice) => (
          <BotaoRotina
            key={indice}
            tom={
              indice === mes.getMonth() && ano === mes.getFullYear()
                ? 'primario'
                : 'secundario'
            }
            onClick={() => aoSelecionar(new Date(ano, indice, 1, 12))}
          >
            {rotuloMes(new Date(ano, indice, 1))}
          </BotaoRotina>
        ))}
      </div>
    </div>
  );
}

export function DialogoTarefasDia({
  dia,
  tarefas,
  aoAbrir,
  aoConcluir,
  aoDesfazer,
  aoCriar,
  aoCancelar,
  idTitulo,
}) {
  return (
    <div className={classesRotina.conteudoModal}>
      <CabecalhoModalRotina
        editorial
        id={idTitulo}
        titulo='Tarefas deste dia'
        descricao={formatarData(dia, {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })}
      />
      {tarefas.length ? (
        <div className={classesRotina.listaTarefasDia}>
          {tarefas.map(tarefa => (
            <LinhaTarefa
              key={tarefa.occurrenceId}
              tarefa={tarefa}
              variante='dia'
              rotuloData={tarefa.time}
              aoAbrir={aoAbrir}
              aoConcluir={aoConcluir}
              aoDesfazer={aoDesfazer}
            />
          ))}
        </div>
      ) : (
        <p className={classesRotina.apoio}>
          Seu dia está livre por aqui. Que tal planejar o próximo passo?
        </p>
      )}
      <div className={classesRotina.acoes} data-acoes>
        <BotaoRotina onClick={aoCriar}>Criar tarefa neste dia</BotaoRotina>
        <BotaoRotina tom='secundario' onClick={aoCancelar}>
          Voltar ao calendário
        </BotaoRotina>
      </div>
    </div>
  );
}
