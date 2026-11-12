import { Check, MoreVertical } from 'lucide-react';
import { IconeRotina, SeloCategoriaRotina } from './InterfaceRotina';
import { diaRelativo } from '../utilitarios/datas';
import classesRotina from '../classesRotina';

export default function LinhaTarefa({
  tarefa,
  aoAbrir,
  aoConcluir,
  aoAcao,
  aoDesfazer,
  variante = 'lista',
  rotuloData,
}) {
  const concluida = tarefa.completed || variante === 'historico';
  function acao(evento, tipo) {
    evento.currentTarget.closest('details')?.removeAttribute('open');
    aoAcao(tipo, tarefa);
  }

  return (
    <article
      className={`${classesRotina.linhaTarefa} ${classesRotina[`linhaTarefa_${variante}`] ?? ''}`}
    >
      <button
        type='button'
        role='checkbox'
        aria-checked={Boolean(concluida)}
        aria-label={
          concluida
            ? `Desfazer conclusão de ${tarefa.title}`
            : `Concluir ${tarefa.title}`
        }
        className={`${classesRotina.caixaTarefa} ${concluida ? classesRotina.tarefaConcluida : ''}`}
        onClick={() => (concluida ? aoDesfazer?.(tarefa) : aoConcluir(tarefa))}
      >
        {concluida && <Check size={14} strokeWidth={3} aria-hidden='true' />}
      </button>
      <IconeRotina
        nome={tarefa.icon}
        classe={classesRotina.iconeTarefa}
        data-icone-tarefa
      />
      <button
        type='button'
        className={classesRotina.copiaTarefa}
        title={tarefa.title}
        onClick={() => aoAbrir(tarefa)}
      >
        <strong>{tarefa.title}</strong>
        {(variante === 'proximas' ||
          variante === 'historico' ||
          variante === 'dia') && (
          <span>
            {rotuloData ?? `${diaRelativo(tarefa.occurrenceDate)} · ${tarefa.time}`}
          </span>
        )}
      </button>
      {variante === 'lista' && (
        <time className={classesRotina.horarioTarefa}>{tarefa.time}</time>
      )}
      <SeloCategoriaRotina
        categoria={tarefa.category}
        neutro={variante === 'proximas'}
      />
      {aoAcao && !concluida && (
        <details className={classesRotina.menuTarefa} name='acoes-tarefa-rotina'>
          <summary aria-label={`Opções para ${tarefa.title}`}>
            <MoreVertical size={19} aria-hidden='true' />
          </summary>
          <div className={classesRotina.itensMenu}>
            {[
              ['detalhe', 'Ver detalhes'],
              ['editar', 'Editar'],
              ['reagendar', 'Reagendar'],
              ['lembrete', 'Ajustar lembrete'],
              ['repeticao', 'Repetição'],
              ['excluir', 'Excluir tarefa'],
            ].map(([tipo, rotulo]) => (
              <button
                key={tipo}
                type='button'
                onClick={evento => acao(evento, tipo)}
              >
                {rotulo}
              </button>
            ))}
          </div>
        </details>
      )}
    </article>
  );
}
