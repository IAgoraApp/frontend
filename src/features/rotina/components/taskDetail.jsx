import {
  categoriasRotina,
  frequenciasRotina,
  opcoesLembrete,
} from '../content';
import { diaRelativo } from '../utils/dates';
import { AvisoRotina, BotaoRotina, CabecalhoModalRotina } from './routineUi';
import classesRotina from '../routineClasses';

export default function DetalheTarefa({
  tarefa,
  aoAcao,
  aoConcluir,
  aoDesfazer,
  idTitulo,
}) {
  const categoria = categoriasRotina.find(
    item => item.id === tarefa.category
  )?.rotulo;
  const frequencia =
    frequenciasRotina.find(item => item.id === tarefa.frequency)?.rotulo ??
    'Sem repetição';
  const lembrete =
    opcoesLembrete.find(item => item.valor === tarefa.reminder)?.rotulo ??
    'Sem lembrete';

  return (
    <div className={classesRotina.conteudoModal}>
      <CabecalhoModalRotina
        arte
        id={idTitulo}
        titulo={tarefa.title}
        descricao={`${categoria} · ${diaRelativo(tarefa.occurrenceDate)} às ${tarefa.time} · ${frequencia}.`}
      />
      <AvisoRotina
        titulo={
          tarefa.completed ? 'Mais uma tarefa feita.' : 'Uma tarefa possível'
        }
      >
        {tarefa.notes ||
          'Um passo de cada vez. Reserve um momento do seu dia para esta tarefa.'}
      </AvisoRotina>
      <div
        className={`${classesRotina.acoes} ${classesRotina.acoesDetalhe}`}
        data-acoes
      >
        {tarefa.completed ? (
          <BotaoRotina className='col-span-full' onClick={() => aoDesfazer(tarefa)}>
            Desfazer conclusão
          </BotaoRotina>
        ) : (
          <>
            <BotaoRotina
              className='col-span-full'
              onClick={() => aoConcluir(tarefa)}
            >
              Marcar como concluída
            </BotaoRotina>
            <BotaoRotina tom='secundario' onClick={() => aoAcao('editar', tarefa)}>
              Editar
            </BotaoRotina>
            <BotaoRotina
              tom='secundario'
              onClick={() => aoAcao('reagendar', tarefa)}
            >
              Reagendar
            </BotaoRotina>
          </>
        )}
      </div>
      {!tarefa.completed && (
        <div
          className={`${classesRotina.acoes} ${classesRotina.acoesDetalhe}`}
          data-acoes
        >
          <BotaoRotina tom='secundario' onClick={() => aoAcao('lembrete', tarefa)}>
            Ajustar lembrete
          </BotaoRotina>
          <BotaoRotina
            tom='secundario'
            onClick={() => aoAcao('repeticao', tarefa)}
          >
            Repetição
          </BotaoRotina>
          <BotaoRotina
            className='col-span-full'
            tom='fantasma'
            onClick={() => aoAcao('excluir', tarefa)}
          >
            Excluir tarefa
          </BotaoRotina>
        </div>
      )}
      {!tarefa.completed && tarefa.reminder !== 'none' && (
        <p className={classesRotina.notaPequena}>
          Lembrete: {lembrete.toLowerCase()}, na plataforma enquanto esta aba
          estiver aberta.
        </p>
      )}
    </div>
  );
}
