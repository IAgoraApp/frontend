import { useDadosServidor } from '../../../app/dados/contextoServidor';
import { aplicarAcaoRotina } from '../rotinaApi';
import { useState } from 'react';
import {
  alterarBanco,
  hoje,
  inserir,
  useBancoMvp,
} from '../../../app/dados/bancoMvp';
import { adicionarDias } from '../utils/dates';
import { proximaOcorrencia } from '../utils/recorrenciasMvp';

const frequencias = { daily: 'diaria', weekly: 'semanal', monthly: 'mensal' };
const dias = [
  'domingo',
  'segunda',
  'terca',
  'quarta',
  'quinta',
  'sexta',
  'sabado',
];

export function useCategoriasRotina() {
  return useBancoMvp().categorias.map(c => ({
    id: String(c.id),
    rotulo: c.nome,
    cor: c.cor,
  }));
}

function gerarProxima(db, regra, hora, referencia) {
  const data = proximaOcorrencia(regra, db.execucao_tarefa, referencia);
  if (data) criarExecucao(db, regra.tarefa_id, `${data}T${hora}:00`);
}

function criarExecucao(db, tarefaId, data) {
  return inserir(
    'execucao_tarefa',
    {
      tarefa_id: tarefaId,
      data_prevista: data,
      status: 'pendente',
      concluida_em: null,
    },
    db
  );
}

function salvarRegra(db, tarefaId, tarefa) {
  const anterior = db.recorrencia_tarefa.find(r => r.tarefa_id === tarefaId);
  if (tarefa.frequency === 'none') {
    db.recorrencia_tarefa = db.recorrencia_tarefa.filter(
      r => r.tarefa_id !== tarefaId
    );
    return;
  }
  const campos = {
    tarefa_id: tarefaId,
    frequencia: frequencias[tarefa.frequency],
    intervalo: anterior?.intervalo ?? 1,
    inicio: tarefa.startDate || tarefa.date,
    fim: tarefa.endDate || null,
    dias_semana:
      tarefa.frequency === 'weekly' ? tarefa.weekdays.map(d => dias[d]) : null,
    dia_mes:
      tarefa.frequency === 'monthly'
        ? (anterior?.dia_mes ?? [Number(tarefa.date.slice(8, 10))])
        : null,
  };
  if (anterior) Object.assign(anterior, campos);
  else inserir('recorrencia_tarefa', campos, db);
}

export function useRotinaBanco() {
  const { b, perfil, tarefas, categorias } = useBancoMvp();
  const servidor = useDadosServidor();
  const [lembretes, setLembretes] = useState({});
  const porId = new Map(
    tarefas.map(t => {
      const regra = b.recorrencia_tarefa.find(r => r.tarefa_id === t.id);
      const prazo = t.prazo || regra?.inicio || hoje();
      return [
        t.id,
        {
          id: t.id,
          title: t.nome,
          category: String(t.categoria_id),
          notes: t.descricao || '',
          date: prazo.slice(0, 10),
          time: prazo.slice(11, 16) || '12:00',
          frequency:
            Object.keys(frequencias).find(
              f => frequencias[f] === regra?.frequencia
            ) || 'none',
          weekdays: (regra?.dias_semana || [])
            .map(d => dias.indexOf(d))
            .filter(d => d >= 0),
          startDate: regra?.inicio,
          endDate: regra?.fim || '',
          icon: 'lista',
          reminder: servidor ? String(t.lembrete_minutos ?? 'none') : lembretes[t.id] || 'none',
        },
      ];
    })
  );
  const ocorrencias = b.execucao_tarefa
    .flatMap(e => {
      const tarefa = porId.get(e.tarefa_id);
      if (!tarefa) return [];
      return [
        {
          ...tarefa,
          taskId: tarefa.id,
          executionId: e.id,
          occurrenceId: e.id,
          occurrenceDate: e.data_prevista.slice(0, 10),
          time: e.data_prevista.slice(11, 16) || tarefa.time,
          completed: e.status === 'concluida',
          completedAt: e.concluida_em || e.data_prevista,
        },
      ];
    })
    .sort((a, c) =>
      `${a.occurrenceDate}T${a.time}`.localeCompare(
        `${c.occurrenceDate}T${c.time}`
      )
    );

  async function despachar(acao) {
    if (!servidor && acao.type === 'update' && 'reminder' in acao.changes) {
      setLembretes(atual => ({ ...atual, [acao.id]: acao.changes.reminder }));
      return;
    }
    if (servidor) {
      try {
        await aplicarAcaoRotina(acao, { ...b, categorias, tarefas: porId });
      } finally {
        await servidor.atualizar();
      }
      return;
    }
    alterarBanco(db => {
      const ocorrencia = acao.occurrence;
      const execucao = db.execucao_tarefa.find(
        e =>
          e.id ===
          (ocorrencia?.executionId ??
            (acao.type === 'undo' ? acao.id : undefined))
      );
      if (
        acao.type === 'complete' &&
        execucao &&
        execucao.status !== 'concluida'
      ) {
        execucao.status = 'concluida';
        execucao.concluida_em = acao.completedAt;
        const regra = db.recorrencia_tarefa.find(
          r => r.tarefa_id === execucao.tarefa_id
        );
        const futura = db.execucao_tarefa.some(
          e =>
            e.tarefa_id === execucao.tarefa_id &&
            e.status !== 'concluida' &&
            e.data_prevista > execucao.data_prevista
        );
        if (regra && !futura) {
          const seguinte = adicionarDias(ocorrencia.occurrenceDate, 1);
          gerarProxima(
            db,
            regra,
            ocorrencia.time,
            seguinte > hoje() ? seguinte : hoje()
          );
        }
      }
      if (acao.type === 'undo' && execucao) {
        execucao.status = 'pendente';
        execucao.concluida_em = null;
      }
      if (acao.type === 'add') {
        for (const valores of acao.tasks) {
          const categoria =
            categorias.find(c => String(c.id) === valores.category) ??
            categorias[0] ??
            inserir(
              'categoria_tarefa',
              {
                user_id: perfil.user_id,
                nome: 'Rotina',
                cor: '#12377d',
                icone: 'list-check',
              },
              db
            );
          const prazo = `${valores.date}T${valores.time}:00`;
          const tarefa = inserir(
            'tarefa',
            {
              categoria_id: categoria.id,
              nome: valores.title,
              descricao: valores.notes || null,
              prazo,
            },
            db
          );
          salvarRegra(db, tarefa.id, valores);
          criarExecucao(db, tarefa.id, prazo);
        }
      }
      if (acao.type === 'update' || acao.type === 'reschedule') {
        const id = acao.id ?? ocorrencia.id;
        const tarefa = db.tarefa.find(t => t.id === id);
        if (!tarefa) return;
        if (acao.type === 'reschedule') {
          const prazo = `${acao.date}T${acao.time}:00`;
          if (execucao && !ocorrencia.completed) execucao.data_prevista = prazo;
          if (acao.scope === 'series' || ocorrencia.frequency === 'none') {
            tarefa.prazo = prazo;
            const regra = db.recorrencia_tarefa.find(r => r.tarefa_id === id);
            if (regra) {
              regra.inicio = acao.date;
              if (regra.fim && regra.fim < regra.inicio)
                regra.fim = regra.inicio;
            }
          }
          return;
        }
        const anterior = porId.get(id);
        const valores = { ...anterior, ...acao.changes };
        tarefa.nome = valores.title;
        tarefa.descricao = valores.notes || null;
        tarefa.categoria_id = Number(valores.category);
        if ('date' in acao.changes) {
          const prazo = `${valores.date}T${valores.time}:00`;
          tarefa.prazo = prazo;
          if (
            execucao &&
            execucao.status !== 'concluida' &&
            (valores.date !== anterior.date || valores.time !== anterior.time)
          )
            execucao.data_prevista = prazo;
          if (valores.date !== anterior.date) valores.startDate = valores.date;
        }
        salvarRegra(db, id, valores);
      }
      if (acao.type === 'delete') {
        if (acao.scope === 'series' || ocorrencia.frequency === 'none') {
          db.recorrencia_tarefa = db.recorrencia_tarefa.filter(
            r => r.tarefa_id !== ocorrencia.id
          );
          db.execucao_tarefa = db.execucao_tarefa.filter(
            e => e.tarefa_id !== ocorrencia.id || e.status === 'concluida'
          );
          if (!db.execucao_tarefa.some(e => e.tarefa_id === ocorrencia.id))
            db.tarefa = db.tarefa.filter(t => t.id !== ocorrencia.id);
        } else {
          db.execucao_tarefa = db.execucao_tarefa.filter(
            e => e.id !== ocorrencia.executionId
          );
        }
      }
    });
  }

  return {
    estado: {
      tasks: [...porId.values()],
      completions: ocorrencias
        .filter(o => o.completed)
        .map(o => ({ ...o, id: o.executionId })),
    },
    ocorrencias,
    despachar,
  };
}
