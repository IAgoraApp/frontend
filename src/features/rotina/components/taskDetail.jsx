import {
  Bell,
  CalendarDays,
  Check,
  Clock,
  Pencil,
  Repeat,
  Tags,
  Trash2,
  Undo2,
} from 'lucide-react';
import { useCategoriasRotina } from '../hooks/useRotinaBanco';
import { frequenciasRotina, opcoesLembrete } from '../content';
import { chaveData, formatarData } from '../utils/dates';
import { BotaoRotina, IconeRotina } from './routineUi';

const dataLonga = { day: 'numeric', month: 'long', year: 'numeric' };

export default function DetalheTarefa({
  tarefa,
  aoAcao,
  aoConcluir,
  aoDesfazer,
  idTitulo,
}) {
  const categorias = useCategoriasRotina();
  const categoria = categorias.find(item => item.id === tarefa.category);
  const frequencia =
    frequenciasRotina.find(item => item.id === tarefa.frequency)?.rotulo ??
    'Sem repetição';
  const lembrete =
    opcoesLembrete.find(item => item.valor === tarefa.reminder)?.rotulo ??
    'Sem lembrete';
  const atrasada = !tarefa.completed && tarefa.occurrenceDate < chaveData();
  const conclusao = tarefa.completedAt && new Date(tarefa.completedAt);
  const dados = [
    [
      CalendarDays,
      'Data prevista',
      formatarData(tarefa.occurrenceDate, dataLonga),
    ],
    [Clock, 'Horário previsto', tarefa.time],
    [Repeat, 'Repetição', frequencia],
    [Bell, 'Lembrete', lembrete],
  ];
  const acoes = [
    [Pencil, 'editar', 'Editar'],
    [CalendarDays, 'reagendar', 'Reagendar'],
    [Bell, 'lembrete', 'Ajustar lembrete'],
    [Repeat, 'repeticao', 'Repetição'],
  ];

  return (
    <div className='rotina-detalhe-tarefa'>
      <header className='rotina-detalhe-cabecalho'>
        <div className='rotina-detalhe-icone'>
          <IconeRotina nome={tarefa.icon} classe='size-6' />
        </div>
        <div className='min-w-0 flex-1'>
          {categoria && (
            <p className='flex items-center gap-1.5 text-xs font-bold text-(--texto-apoio)'>
              <Tags size={14} aria-hidden='true' /> {categoria.rotulo}
            </p>
          )}
          <h2
            id={idTitulo}
            tabIndex={-1}
            className='font-titulo text-2xl leading-tight font-extrabold wrap-anywhere sm:text-3xl'
          >
            {tarefa.title}
          </h2>
        </div>
        <span
          className='rotina-detalhe-situacao'
          data-estado={
            tarefa.completed ? 'concluida' : atrasada ? 'atrasada' : 'pendente'
          }
        >
          {tarefa.completed ? 'Concluída' : atrasada ? 'Em atraso' : 'Pendente'}
        </span>
      </header>

      {tarefa.completed && conclusao && !Number.isNaN(conclusao.getTime()) && (
        <p className='rotina-detalhe-conclusao'>
          <Check size={17} aria-hidden='true' />
          <span>
            Concluída em{' '}
            <strong>
              {conclusao.toLocaleString('pt-BR', {
                dateStyle: 'short',
                timeStyle: 'short',
              })}
            </strong>
          </span>
        </p>
      )}
      <dl className='rotina-detalhe-dados'>
        {dados.map(([Icone, rotulo, valor]) => (
          <div key={rotulo}>
            <dt>
              <Icone size={16} aria-hidden='true' /> {rotulo}
            </dt>
            <dd>{valor || '—'}</dd>
          </div>
        ))}
      </dl>
      {tarefa.notes && (
        <section className='rotina-detalhe-notas'>
          <h3>Observações</h3>
          <p>{tarefa.notes}</p>
        </section>
      )}

      <div className='rotina-detalhe-acoes'>
        {tarefa.completed ? (
          <BotaoRotina tom='secundario' onClick={() => aoDesfazer(tarefa)}>
            <Undo2 size={17} aria-hidden='true' /> Desfazer conclusão
          </BotaoRotina>
        ) : (
          <>
            <BotaoRotina onClick={() => aoConcluir(tarefa)}>
              <Check size={18} aria-hidden='true' /> Marcar como concluída
            </BotaoRotina>
            <div className='rotina-detalhe-atalhos'>
              {acoes.map(([Icone, tipo, rotulo]) => (
                <button
                  type='button'
                  key={tipo}
                  onClick={() => aoAcao(tipo, tarefa)}
                >
                  <Icone size={17} aria-hidden='true' /> {rotulo}
                </button>
              ))}
            </div>
            <button
              type='button'
              className='rotina-detalhe-excluir'
              onClick={() => aoAcao('excluir', tarefa)}
            >
              <Trash2 size={16} aria-hidden='true' /> Excluir tarefa
            </button>
          </>
        )}
      </div>
    </div>
  );
}
