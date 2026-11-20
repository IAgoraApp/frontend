import { contaApi } from '../../app/dados/contaApi';
import {
  listarApi,
  opcionalApi,
  registroDaApi,
} from '../../app/dados/contratoApi';

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

export async function carregarRotina(usuario, opcoes) {
  const [categorias, tarefas, execucoes] = await Promise.all([
    listarApi(`/categorias-tarefa/usuario/${usuario}`, opcoes),
    listarApi(`/tarefas/usuario/${usuario}`, opcoes),
    listarApi(`/execucoes-tarefa/usuario/${usuario}`, opcoes),
  ]);
  const regras = await Promise.all(
    tarefas.map(item => opcionalApi(`/tarefas/${item.id}/recorrencia`, opcoes))
  );
  return {
    categoria_tarefa: categorias,
    tarefa: tarefas,
    execucao_tarefa: execucoes,
    recorrencia_tarefa: regras.filter(Boolean).map(registroDaApi),
  };
}

export function salvarCategoriaRotina(id, dados) {
  return contaApi(id ? `/categorias-tarefa/${id}` : '/categorias-tarefa', {
    metodo: dados ? (id ? 'PATCH' : 'POST') : 'DELETE',
    dados,
  });
}

export function editarRecorrenciaRotina(tarefaId, existe, dados) {
  return contaApi(`/tarefas/${tarefaId}/recorrencia`, {
    metodo: dados ? (existe ? 'PATCH' : 'POST') : 'DELETE',
    dados,
  });
}

function regraTarefa(tarefa) {
  if (tarefa.frequency === 'none') return null;
  return {
    frequencia: frequencias[tarefa.frequency],
    inicio: tarefa.startDate || tarefa.date,
    fim: tarefa.endDate || null,
    diasSemana:
      tarefa.frequency === 'weekly'
        ? tarefa.weekdays.map(dia => dias[dia])
        : null,
    diaMes:
      tarefa.frequency === 'monthly'
        ? [Number(tarefa.date.slice(8, 10))]
        : null,
  };
}

function alterarExecucao(id, metodo, dados, acao) {
  return contaApi(`/execucoes-tarefa/${id}${acao ? '/' + acao : ''}`, {
    metodo,
    dados,
  });
}

export async function aplicarAcaoRotina(
  acao,
  { tarefas, categorias, recorrencia_tarefa, execucao_tarefa }
) {
  const ocorrencia = acao.occurrence;
  const id = acao.id ?? ocorrencia?.taskId ?? ocorrencia?.id;
  const regra = recorrencia_tarefa.find(item => item.tarefa_id === id);
  const idExecucao = ocorrencia?.executionId;
  if (acao.type === 'complete')
    return alterarExecucao(idExecucao, 'PATCH', undefined, 'concluir');
  if (acao.type === 'undo')
    return alterarExecucao(id, 'PATCH', undefined, 'reabrir');
  if (acao.type === 'delete') {
    if (ocorrencia.frequency !== 'none' && acao.scope === 'series')
      return editarRecorrenciaRotina(id, true);
    if (
      regra ||
      execucao_tarefa.some(
        execucao => execucao.tarefa_id === id && execucao.status === 'concluida'
      )
    )
      return alterarExecucao(idExecucao, 'DELETE');
    return contaApi(`/tarefas/${id}`, { metodo: 'DELETE' });
  }
  if (acao.type === 'reschedule') {
    const dataPrevista = `${acao.date}T${acao.time}:00`;
    if (regra && acao.scope === 'series') {
      await contaApi(`/tarefas/${id}`, {
        metodo: 'PATCH',
        dados: { prazo: dataPrevista },
      });
      return editarRecorrenciaRotina(id, true, {
        inicio: acao.date,
        ...(regra.fim && regra.fim < acao.date && { fim: acao.date }),
      });
    }
    if (!regra)
      await contaApi(`/tarefas/${id}`, {
        metodo: 'PATCH',
        dados: { prazo: dataPrevista },
      });
    return alterarExecucao(idExecucao, 'PATCH', { dataPrevista });
  }
  if (acao.type === 'update') {
    if ('reminder' in acao.changes) {
      return contaApi(`/tarefas/${id}`, {
        metodo: 'PATCH',
        dados: { lembreteMinutos: acao.changes.reminder === 'none' ? -1 : Number(acao.changes.reminder) },
      });
    }
    const tarefa = { ...tarefas.get(id), ...acao.changes };
    const dados = {
      nome: tarefa.title,
      descricao: tarefa.notes || '',
      categoriaId: Number(tarefa.category),
    };
    if ('date' in acao.changes)
      dados.prazo = `${tarefa.date}T${tarefa.time}:00`;
    await contaApi(`/tarefas/${id}`, { metodo: 'PATCH', dados });
    const proximaRegra = regraTarefa(tarefa);
    if (regra || proximaRegra)
      await editarRecorrenciaRotina(id, Boolean(regra), proximaRegra);
    if (dados.prazo && idExecucao && !regra && !proximaRegra)
      await alterarExecucao(idExecucao, 'PATCH', { dataPrevista: dados.prazo });
    return;
  }
  if (acao.type !== 'add') return;
  const padrao =
    categorias[0] ??
    (await salvarCategoriaRotina(null, {
      nome: 'Rotina',
      cor: '#12377d',
      icone: 'list-check',
    }));
  for (const tarefa of acao.tasks) {
    const categoriaId =
      categorias.find(item => String(item.id) === tarefa.category)?.id ??
      padrao.id;
    const prazo = `${tarefa.date}T${tarefa.time}:00`;
    const registro = await contaApi('/tarefas', {
      metodo: 'POST',
      dados: {
        categoriaId,
        nome: tarefa.title,
        descricao: tarefa.notes || null,
        prazo,
      },
    });
    const novaRegra = regraTarefa(tarefa);
    if (novaRegra) await editarRecorrenciaRotina(registro.id, false, novaRegra);
    else
      await contaApi(`/tarefas/${registro.id}/execucoes`, {
        metodo: 'POST',
        dados: { dataPrevista: prazo },
      });
  }
}
