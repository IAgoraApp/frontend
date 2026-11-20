import { useSyncExternalStore } from 'react';
import { lerUsuarioMvpAtivo, usePerfilPreparacao } from './perfilNavegacao';
import banco from '../../../iagora_banco_mock_completo.json';

const chaveReceitas = 'iagora:banco-mvp:receitas:v1';
const colecoesReceitas = [
  'receitas',
  'receita_item',
  'receita_favorita',
  'receita_usuario',
];

function lerReceitasSalvas() {
  try {
    const salvas = JSON.parse(window.localStorage.getItem(chaveReceitas));
    return Object.fromEntries(
      colecoesReceitas
        .filter(colecao => Array.isArray(salvas?.[colecao]))
        .map(colecao => [colecao, salvas[colecao]])
    );
  } catch {
    return {};
  }
}

const chaveFinancas = 'iagora:banco-mvp:financas:v1';
const colecoesFinancas = [
  'categoria_financas',
  'conta_financeira',
  'transacao_financeira',
  'orcamento',
  'meta_financeira',
  'recorrencia_financeira',
];

function lerFinancasSalvas() {
  try {
    const salvas = JSON.parse(window.localStorage.getItem(chaveFinancas));
    return Object.fromEntries(
      colecoesFinancas
        .filter(colecao => Array.isArray(salvas?.[colecao]))
        .map(colecao => [colecao, salvas[colecao]])
    );
  } catch {
    return {};
  }
}

const chaveCompras = 'iagora:banco-mvp:compras:v1';
const colecoesCompras = ['compras', 'compra_item', 'estoque_item', 'produto'];

function lerComprasSalvas() {
  try {
    const salvas = JSON.parse(window.localStorage.getItem(chaveCompras));
    return Object.fromEntries(
      colecoesCompras
        .filter(colecao => Array.isArray(salvas?.[colecao]))
        .map(colecao => [colecao, salvas[colecao]])
    );
  } catch {
    return {};
  }
}

const chaveCobrancas = 'iagora:banco-mvp:cobrancas:v1';
const colecoesCobrancas = [
  'assinatura', 'pagamento', 'metodo_pagamento', 'perfil_empresa', 'servico',
  'publicacao_servico', 'enderecos_empresa', 'validacoes_empresa', 'contas_empresa_locais',
];

function lerCobrancasSalvas() {
  try {
    const salvas = JSON.parse(localStorage.getItem(chaveCobrancas));
    return Object.fromEntries(
      colecoesCobrancas.filter(c => Array.isArray(salvas?.[c])).map(c => [c, salvas[c]])
    );
  } catch {
    return {};
  }
}

function mesclarDadosEmpresa(b) {
  const enderecos = new Map((b.enderecos_empresa ?? []).map(e => [e.id, e]));
  b.endereco = b.endereco.map(e => {
    const atualizado = enderecos.get(e.id);
    enderecos.delete(e.id);
    return atualizado ?? e;
  });
  b.endereco.push(...enderecos.values());
  const ids = new Set(b.users.map(u => u.id));
  b.users.push(...(b.contas_empresa_locais ?? []).filter(u => !ids.has(u.id)));
}

export function alterarBancoCobrancas(operacao) {
  alterarBanco(b => {
    Object.assign(b, lerCobrancasSalvas());
    b.enderecos_empresa ??= [];
    b.validacoes_empresa ??= [];
    b.contas_empresa_locais ??= [];
    mesclarDadosEmpresa(b);
    operacao(b);
    try {
      localStorage.setItem(chaveCobrancas, JSON.stringify(
        Object.fromEntries(colecoesCobrancas.map(c => [c, b[c]]))
      ));
    } catch {
      throw new Error('O navegador não conseguiu salvar as alterações de cobrança.');
    }
  });
}

const chavePerfil = 'iagora:banco-mvp:perfil:v1';
const chavePerfilUsuario = usuario => usuario === USUARIO_A ? chavePerfil : chavePerfil + ':' + usuario;

function aplicarPerfilSalvo(bancoAtual, chave = chavePerfil) {
  try {
    const salvo = JSON.parse(window.localStorage.getItem(chave));
    if (!salvo) return {};
    const perfil = bancoAtual.perfil.find(item => item.id === salvo.perfil?.id);
    const usuario = bancoAtual.users.find(item => item.id === perfil?.user_id);
    if (!usuario) return {};
    Object.assign(perfil, salvo.perfil);
    if (typeof salvo.email === 'string') usuario.email = salvo.email;
    for (const endereco of Object.values(salvo.enderecos ?? {})) {
      const atual = bancoAtual.endereco.find(item => item.id === endereco.id);
      if (atual) Object.assign(atual, endereco);
      else bancoAtual.endereco.push(endereco);
    }
    return salvo.enderecos ?? {};
  } catch {
    return {};
  }
}

const chaveMarketplace = 'iagora:banco-mvp:marketplace:v1';
const colecoesMarketplace = ['servico_contratado', 'avaliacao_servico', 'chat_servico', 'mensagem', 'enderecos_marketplace', 'propostas_marketplace'];

function lerMarketplaceSalvo() {
  try {
    const salvo = JSON.parse(window.localStorage.getItem(chaveMarketplace));
    return Object.fromEntries(
      colecoesMarketplace
        .filter(colecao => Array.isArray(salvo?.[colecao]))
        .map(colecao => [colecao, salvo[colecao]])
    );
  } catch {
    return {};
  }
}

function mesclarEnderecosMarketplace(db, salvos) {
  if (!Array.isArray(salvos)) return;
  const ids = new Set(db.endereco.map(item => item.id));
  db.endereco.push(...salvos.filter(item => !ids.has(item.id)));
}
const chavePreparacao = 'iagora:banco-mvp:preparacao:v1';
const colecoesPreparacao = [
  'jornada', 'etapa_jornada', 'tarefa_jornada', 'plano_moradia',
  'custo_moradia', 'simulacao_moradia', 'simulacao_item', 'casa_desejada',
  'progresso_aula', 'tentativa_quiz', 'resposta_quiz', 'enderecos_preparacao',
  'previsoes_mudanca',
  'fotos_etapas_preparacao',
  'vinculos_planos_imoveis',
  'dinheiro_preparacao',
  'categorias_custos_preparacao',
];

function lerPreparacaoSalva() {
  try {
    const salvo = JSON.parse(localStorage.getItem(chavePreparacao));
    return Object.fromEntries(
      colecoesPreparacao.filter(c => Array.isArray(salvo?.[c])).map(c => [c, salvo[c]])
    );
  } catch {
    return {};
  }
}

export function alterarBancoPreparacao(operacao) {
  alterarBanco(b => {
    Object.assign(b, lerPreparacaoSalva());
    b.enderecos_preparacao ??= [];
    mesclarEnderecosMarketplace(b, b.enderecos_preparacao);
    operacao(b);
    localStorage.setItem(chavePreparacao, JSON.stringify(
      Object.fromEntries(colecoesPreparacao.map(c => [c, b[c]]))
    ));
  });
}

let dados = { ...structuredClone(banco.dados), ...lerReceitasSalvas(), ...lerFinancasSalvas(), ...lerComprasSalvas(), ...lerMarketplaceSalvo(), ...lerCobrancasSalvas(), ...lerPreparacaoSalva() };
mesclarEnderecosMarketplace(dados, dados.enderecos_marketplace);
mesclarEnderecosMarketplace(dados, dados.enderecos_preparacao);
mesclarDadosEmpresa(dados);
aplicarPerfilSalvo(dados);
for (const perfil of banco.dados.perfil.filter(item => item.user_id !== 1))
  aplicarPerfilSalvo(dados, chavePerfil + ':' + perfil.user_id);
const ouvintes = new Set();
export const USUARIO_A = 1;
export const USUARIO_B = banco.dados.perfil.find(perfil => perfil.tipo === 2).user_id;
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
export function alterarBancoReceitas(operacao) {
  alterarBanco(b => {
    Object.assign(b, lerReceitasSalvas());
    operacao(b);
    const receitas = Object.fromEntries(
      colecoesReceitas.map(colecao => [colecao, b[colecao]])
    );
    try {
      window.localStorage.setItem(chaveReceitas, JSON.stringify(receitas));
    } catch {
      throw new Error(
        'O navegador não conseguiu salvar suas alterações. Verifique o armazenamento e tente novamente.'
      );
    }
  });
}
export function alterarBancoFinancas(operacao) {
  alterarBanco(b => {
    Object.assign(b, lerFinancasSalvas());
    operacao(b);
    const financas = Object.fromEntries(
      colecoesFinancas.map(colecao => [colecao, b[colecao]])
    );
    try {
      window.localStorage.setItem(chaveFinancas, JSON.stringify(financas));
    } catch {
      throw new Error('O navegador não conseguiu salvar a alteração. Verifique o armazenamento e tente novamente.');
    }
  });
}
export function alterarBancoCompras(operacao) {
  alterarBanco(b => {
    Object.assign(b, lerComprasSalvas());
    operacao(b);
    const compras = Object.fromEntries(
      colecoesCompras.map(colecao => [colecao, b[colecao]])
    );
    try {
      window.localStorage.setItem(chaveCompras, JSON.stringify(compras));
    } catch {
      throw new Error('O navegador não conseguiu salvar a alteração.');
    }
  });
}
export function alterarBancoPerfil(userId, operacao) {
  alterarBanco(b => {
    mesclarEnderecosMarketplace(b, lerMarketplaceSalvo().enderecos_marketplace);
    const chave = chavePerfilUsuario(userId);
    const enderecos = aplicarPerfilSalvo(b, chave);
    const perfil = b.perfil.find(item => item.user_id === userId);
    const usuario = b.users.find(item => item.id === userId);
    if (!perfil || !usuario) throw new Error('Perfil indisponível.');
    const endereco = operacao(b, perfil, usuario);
    if (endereco) enderecos[endereco.id] = endereco;
    try {
      localStorage.setItem(chave, JSON.stringify({
        perfil,
        email: usuario.email,
        enderecos,
      }));
    } catch {
      throw new Error('O navegador não conseguiu salvar suas alterações.');
    }
  });
}
export function alterarBancoMarketplace(operacao) {
  alterarBanco(b => {
    Object.assign(b, lerMarketplaceSalvo());
    mesclarEnderecosMarketplace(b, b.enderecos_marketplace);
    aplicarPerfilSalvo(b);
    operacao(b);
    const registros = Object.fromEntries(
      colecoesMarketplace.map(colecao => [colecao, b[colecao]])
    );
    try {
      window.localStorage.setItem(chaveMarketplace, JSON.stringify(registros));
    } catch {
      throw new Error('O navegador não conseguiu salvar a alteração.');
    }
  });
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
  const alterar = colecoesReceitas.includes(colecao)
    ? alterarBancoReceitas
    : alterarBanco;
  alterar(b => {
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
      b.receita_usuario = b.receita_usuario.filter(
        item => item.receita_id !== id
      );
    }
  });
}
if (typeof window !== 'undefined') {
  window.addEventListener('storage', evento => {
    if (!evento.newValue || ![chaveMarketplace, chaveCobrancas].includes(evento.key)) return;
    if (evento.key === chaveCobrancas) {
      alterarBanco(db => {
        Object.assign(db, lerCobrancasSalvas());
        mesclarDadosEmpresa(db);
      });
      return;
    }
    alterarBanco(db => {
      Object.assign(db, lerMarketplaceSalvo());
      mesclarEnderecosMarketplace(db, db.enderecos_marketplace);
    });
  });
}
const inscrever = ouvir => {
  ouvintes.add(ouvir);
  return () => ouvintes.delete(ouvir);
};
const snapshot = () => dados;
export function useBancoMvp(usuarioSelecionado) {
  const preparacao = usePerfilPreparacao();
  const usuario = usuarioSelecionado ?? lerUsuarioMvpAtivo() ?? (preparacao ? USUARIO_B : USUARIO_A);
  const b = useSyncExternalStore(inscrever, snapshot);
  const perfil = b.perfil.find(item => item.user_id === usuario);
  const casa = b.casa.find(item => item.user_id === usuario);
  const comodos = b.comodo.filter(item => item.casa_id === casa?.id);
  const categorias = b.categoria_tarefa.filter(
    item => item.user_id === usuario
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
      item => item.user_id === usuario
    ),
    endereco: b.endereco.find(item => item.id === (casa?.endereco_id ?? perfil?.endereco_id)),
  };
}
