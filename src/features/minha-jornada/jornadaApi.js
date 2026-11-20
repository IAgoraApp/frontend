import { contaApi } from '../../app/dados/contaApi';
import { listarApi } from '../../app/dados/contratoApi';
import {
  descricaoGuia,
  etapasGuia,
  encontrarGuia,
  nomeGuia,
  tarefasDaEtapa,
} from './guiaMudanca';

export async function carregarJornada(usuario, opcoes) {
  const jornadas = await listarApi(`/jornadas/user/${usuario}`, opcoes);
  const guia = encontrarGuia({ jornada: jornadas }, usuario);
  if (!guia) return { jornada: jornadas };
  const etapas = await listarApi(`/jornadas/${guia.id}/etapas`, opcoes);
  const tarefas = await Promise.all(
    etapas.map(etapa =>
      listarApi(`/etapas-jornada/${etapa.id}/tarefas`, opcoes)
    )
  );
  return {
    jornada: jornadas.map(jornada => ({ ...jornada, comprasIncluidas: true })),
    etapa_jornada: etapas,
    tarefa_jornada: tarefas.flat(),
    fotos_etapas_preparacao: etapas
      .filter(etapa => etapa.foto)
      .map(etapa => ({ etapa_id: etapa.id, foto: etapa.foto })),
  };
}

export async function atualizarGuiaApi(
  banco,
  usuario,
  referencia,
  acao,
  dados
) {
  let guia = encontrarGuia(banco, usuario);
  let etapas = guia
    ? banco.etapa_jornada.filter(item => item.jornada_id === guia.id)
    : [];
  let tarefas = banco.tarefa_jornada;
  if (!guia) {
    const nova = await contaApi('/jornadas/guia', {
      metodo: 'POST',
      dados: {
        nome: nomeGuia,
        descricao: descricaoGuia,
        etapas: etapasGuia.map((etapa, indice) => ({
          etapa: {
            titulo: etapa.titulo,
            descricao: etapa.descricao,
            categoria: etapa.categoria,
            ordem: indice + 1,
          },
          tarefas: tarefasDaEtapa(etapa).map(
            ([titulo, descricao], posicao) => ({
              titulo,
              descricao,
              ordem: posicao + 1,
            })
          ),
        })),
      },
    });
    guia = nova;
    etapas = await listarApi(`/jornadas/${guia.id}/etapas`);
    tarefas = (
      await Promise.all(
        etapas.map(etapa => listarApi(`/etapas-jornada/${etapa.id}/tarefas`))
      )
    ).flat();
  }
  const localizar = item =>
    etapas.find(etapa =>
      item.registroId != null
        ? etapa.id === item.registroId
        : etapa.categoria === item.categoria || etapa.titulo === item.titulo
    );
  if (acao === 'adicionar-etapa') {
    return contaApi(`/jornadas/${guia.id}/etapas`, {
      metodo: 'POST',
      dados: {
        ...dados,
        ordem: Math.max(0, ...etapas.map(etapa => etapa.ordem)) + 1,
      },
    });
  }
  const etapa = localizar(referencia);
  if (!etapa) throw new Error('Esta etapa já não está disponível.');
  const rotaEtapa = `/etapas-jornada/${etapa.id}`;
  if (acao === 'renomear-etapa')
    return contaApi(rotaEtapa, { metodo: 'PATCH', dados });
  if (acao === 'remover-etapa')
    return contaApi(rotaEtapa, { metodo: 'DELETE' });
  if (acao === 'mover-etapa') {
    const destino = localizar(dados);
    if (!destino || destino.id === etapa.id) return;
    const ids = etapas
      .toSorted((a, b) => a.ordem - b.ordem)
      .map(item => item.id)
      .filter(id => id !== etapa.id);
    ids.splice(
      ids.indexOf(destino.id) + (dados.lado === 'depois' ? 1 : 0),
      0,
      etapa.id
    );
    return contaApi(`/jornadas/${guia.id}/etapas/ordenar`, {
      metodo: 'PATCH',
      dados: { ids },
    });
  }
  const itens = tarefas.filter(item => item.etapa_id === etapa.id);
  if (acao === 'adicionar-item') {
    const ordem = Math.max(0, ...itens.map(item => item.ordem)) + 1;
    return contaApi(rotaEtapa + '/tarefas', {
      metodo: 'POST',
      dados: { ...dados, ordem },
    });
  }
  const tarefa = itens.find(item =>
    dados.id ? item.id === dados.id : item.titulo === dados.titulo
  );
  if (!tarefa) throw new Error('Este item já não está disponível.');
  const rotaTarefa = `/tarefas-jornada/${tarefa.id}`;
  if (acao === 'remover-item')
    return contaApi(rotaTarefa, { metodo: 'DELETE' });
  return contaApi(rotaTarefa + (tarefa.concluida ? '/reabrir' : '/concluir'), {
    metodo: 'PATCH',
  });
}
