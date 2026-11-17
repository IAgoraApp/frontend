import { useSyncExternalStore } from 'react';
import banco from '../../../iagora_banco_mock_completo.json';

// O JSON é a única carga inicial. Alterações do protótipo vivem nesta sessão.
let dados = structuredClone(banco.dados);
const ouvintes = new Set();
export const USUARIO_A = 1;
export const hoje = () => {
  const data = new Date();
  return `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}-${String(data.getDate()).padStart(2, '0')}`;
};
export const moeda = valor =>
  Number(valor || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
export const dataCurta = valor =>
  valor
    ? new Date(`${valor.slice(0, 10)}T12:00:00`).toLocaleDateString('pt-BR')
    : 'Sem prazo';

export function alterarBanco(operacao) {
  const proximo = structuredClone(dados);
  operacao(proximo);
  dados = proximo;
  ouvintes.forEach(ouvir => ouvir());
}
export function inserir(colecao, registro, bancoAtual) {
  const novo = {
    ...registro,
    id: Math.max(0, ...bancoAtual[colecao].map(item => item.id)) + 1,
  };
  bancoAtual[colecao].push(novo);
  return novo;
}
export function salvarRegistro(colecao, registro) {
  alterarBanco(b => {
    if (registro.id)
      b[colecao] = b[colecao].map(item =>
        item.id === registro.id ? { ...item, ...registro } : item
      );
    else inserir(colecao, registro, b);
  });
}
export function removerRegistro(colecao, id) {
  alterarBanco(b => {
    b[colecao] = b[colecao].filter(item => item.id !== id);
    if (colecao === 'tarefa') {
      b.execucao_tarefa = b.execucao_tarefa.filter(
        item => item.tarefa_id !== id
      );
      b.recorrencia_tarefa = b.recorrencia_tarefa.filter(
        item => item.tarefa_id !== id
      );
    }
    if (colecao === 'limpezas')
      b.execucao_limpeza = b.execucao_limpeza.filter(
        item => item.limpeza_id !== id
      );
    if (colecao === 'comodo') {
      const limpezas = b.limpezas
        .filter(item => item.comodo_id === id)
        .map(item => item.id);
      b.limpezas = b.limpezas.filter(item => item.comodo_id !== id);
      b.execucao_limpeza = b.execucao_limpeza.filter(
        item => !limpezas.includes(item.limpeza_id)
      );
    }
    if (colecao === 'compras')
      b.compra_item = b.compra_item.filter(item => item.compras_id !== id);
    if (colecao === 'receitas') {
      b.receita_item = b.receita_item.filter(item => item.receita_id !== id);
      b.receita_favorita = b.receita_favorita.filter(
        item => item.receita_id !== id
      );
    }
  });
}
const inscrever = ouvir => {
  ouvintes.add(ouvir);
  return () => ouvintes.delete(ouvir);
};
const snapshot = () => dados;
export function useBancoMvp() {
  const b = useSyncExternalStore(inscrever, snapshot);
  const perfil = b.perfil.find(item => item.user_id === USUARIO_A);
  const casa = b.casa.find(item => item.user_id === USUARIO_A);
  const comodos = b.comodo.filter(item => item.casa_id === casa?.id);
  const categorias = b.categoria_tarefa.filter(
    item => item.user_id === USUARIO_A
  );
  const tarefas = b.tarefa.filter(item =>
    categorias.some(c => c.id === item.categoria_id)
  );
  return {
    b,
    perfil,
    casa,
    comodos,
    categorias,
    tarefas,
    limpezas: b.limpezas.filter(item =>
      comodos.some(c => c.id === item.comodo_id)
    ),
    transacoes: b.transacao_financeira.filter(
      item => item.user_id === USUARIO_A
    ),
    endereco: b.endereco.find(item => item.id === casa?.endereco_id),
  };
}
