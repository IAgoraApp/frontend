import { alterarBancoPreparacao } from '../../app/dados/bancoMvp';
import { proximoId, removerRegistro } from '../preparacao/modelo';
import {
  descricaoGuia,
  encontrarGuia,
  etapasGuia,
  nomeGuia,
  tarefasDaEtapa,
} from './guiaMudanca';

function incluirEtapa(banco, jornada, { titulo, descricao, categoria = null }) {
  const etapas = banco.etapa_jornada.filter(
    item => item.jornada_id === jornada.id
  );
  if (etapas.some(item => item.titulo === titulo))
    throw new Error('Já existe uma etapa com esse nome.');
  const etapa = {
    id: proximoId(banco.etapa_jornada),
    jornada_id: jornada.id,
    titulo,
    descricao,
    categoria,
    ordem: Math.max(0, ...etapas.map(item => item.ordem)) + 1,
    status: 'pendente',
    prazo: null,
    concluida_em: null,
  };
  banco.etapa_jornada.push(etapa);
  return etapa;
}

function incluirTarefa(banco, etapa, { titulo, descricao }) {
  const tarefas = banco.tarefa_jornada.filter(
    item => item.etapa_id === etapa.id
  );
  if (tarefas.some(item => item.titulo === titulo))
    throw new Error('Já existe um item com esse nome neste checklist.');
  banco.tarefa_jornada.push({
    id: proximoId(banco.tarefa_jornada),
    etapa_id: etapa.id,
    titulo,
    descricao,
    ordem: Math.max(0, ...tarefas.map(item => item.ordem)) + 1,
    concluida: false,
  });
}

function criarGuia(banco, usuario) {
  const jornada = {
    id: proximoId(banco.jornada),
    user_id: usuario,
    nome: nomeGuia,
    descricao: descricaoGuia,
    status: 'em_andamento',
    criada_em: new Date().toISOString(),
  };
  banco.jornada.push(jornada);
  for (const definicao of etapasGuia) {
    const etapa = incluirEtapa(banco, jornada, definicao);
    for (const [titulo, descricao] of tarefasDaEtapa(definicao))
      incluirTarefa(banco, etapa, { titulo, descricao });
  }
  return jornada;
}

export function atualizarGuia(usuario, etapaAtual, acao, dados) {
  alterarBancoPreparacao(banco => {
    const jornada = encontrarGuia(banco, usuario) ?? criarGuia(banco, usuario);
    if (acao === 'adicionar-etapa') {
      incluirEtapa(banco, jornada, dados);
    } else {
      const etapa = banco.etapa_jornada.find(
        item =>
          item.jornada_id === jornada.id && item.titulo === etapaAtual.titulo
      );
      if (!etapa) throw new Error('Esta etapa já não está disponível.');
      if (acao === 'remover-etapa')
        removerRegistro(banco, 'etapa_jornada', etapa.id);
      else if (acao === 'adicionar-item') incluirTarefa(banco, etapa, dados);
      else {
        const tarefa = banco.tarefa_jornada.find(
          item =>
            item.etapa_id === etapa.id &&
            (dados.id ? item.id === dados.id : item.titulo === dados.titulo)
        );
        if (!tarefa) throw new Error('Este item já não está disponível.');
        if (acao === 'remover-item')
          removerRegistro(banco, 'tarefa_jornada', tarefa.id);
        else tarefa.concluida = !tarefa.concluida;
      }
    }

    const etapas = banco.etapa_jornada.filter(
      item => item.jornada_id === jornada.id
    );
    for (const etapa of etapas) {
      const tarefas = banco.tarefa_jornada.filter(
        item => item.etapa_id === etapa.id
      );
      const concluida =
        tarefas.length > 0 && tarefas.every(item => item.concluida);
      etapa.status = concluida ? 'concluida' : 'pendente';
      etapa.concluida_em = concluida
        ? (etapa.concluida_em ?? new Date().toISOString())
        : null;
    }
    jornada.status =
      etapas.length && etapas.every(item => item.status === 'concluida')
        ? 'concluida'
        : 'em_andamento';
  });
}
