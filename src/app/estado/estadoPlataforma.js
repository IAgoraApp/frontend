import { acessoLocal } from '../dados/acessoLocal';
import { lerSessao } from '../dados/sessao';

const CHAVE_ARMAZENAMENTO = 'iagora_estado_plataforma_v1';

const dadosDemonstracao = import.meta.env.DEV && acessoLocal ? {
  perfil: {
    nome: 'Ana',
    nomeCompleto: 'Ana Clara Souza',
    email: 'ana@iagora.com.br',
    telefone: '(11) 99999-0000',
    cidade: 'São Paulo',
    bairro: 'Vila Mariana',
    momento: 'preparacao',
    momentoRotulo: 'Vou morar sozinho',
    prioridades: ['Finanças e orçamento', 'Encontrar um lugar'],
    tipoMoradia: 'Studio compacto (25–32m²)',
    pessoasNaCasa: 1,
    orcamentoMensal: 3200,
    notificacoes: {
      rotina: true,
      financas: true,
      resumoSemanal: true,
      mensagensEmpresa: true,
    },
  },
  servicosFavoritos: ['limpeza-residencial'],
  avaliacoesServicos: [],
  contatosCliente: [],
  checklists: {
    diaADia: [
      { id: 'c1', texto: 'Lavar a louça e liberar a pia', concluido: true },
      { id: 'c2', texto: 'Tirar o lixo e separar os recicláveis', concluido: false },
      { id: 'c3', texto: 'Dar atenção ao banheiro', concluido: false },
    ],
    mudanca: [
      { id: 'm1', texto: 'Chave reserva e documento em mãos', concluido: true },
      { id: 'm2', texto: 'Testar disjuntor e registro de água', concluido: false },
      { id: 'm3', texto: 'Kit básico de limpeza e lâmpadas', concluido: false },
    ],
    mercado: [
      { id: 's1', texto: 'Arroz, feijão e macarrão', concluido: true },
      { id: 's2', texto: 'Detergente, esponja e pano de prato', concluido: true },
      { id: 's3', texto: 'Frutas e legumes da semana', concluido: false },
    ],
  },
} : null;

const estadoInicial = dadosDemonstracao ?? {
  perfil: {}, servicosFavoritos: [], avaliacoesServicos: [], contatosCliente: [],
  checklists: { diaADia: [], mudanca: [], mercado: [] },
};

function chaveDaConta() {
  if (acessoLocal) return CHAVE_ARMAZENAMENTO;
  return CHAVE_ARMAZENAMENTO + ':' + (lerSessao()?.id ?? 'visitante');
}

export function lerEstadoPlataforma() {
  try {
    const salvo = localStorage.getItem(chaveDaConta());
    if (!salvo) return estadoInicial;
    const analisado = JSON.parse(salvo);
    return {
      ...estadoInicial,
      ...analisado,
      perfil: { ...estadoInicial.perfil, ...(analisado.perfil || {}) },
    };
  } catch {
    return estadoInicial;
  }
}

export function salvarEstadoPlataforma(proximoEstado) {
  try {
    localStorage.setItem(chaveDaConta(), JSON.stringify(proximoEstado));
    window.dispatchEvent(new CustomEvent('iagora:estado'));
  } catch {
    return false;
  }
  return true;
}

export function calcularProgressoJornada(estado) {
  const etapas = estado?.etapasJornada || [];
  if (!etapas.length) return 52;
  let totalItens = 0;
  let feitos = 0;
  etapas.forEach(etapa => {
    (etapa.itens || []).forEach(item => {
      totalItens += 1;
      if (item.feito) feitos += 1;
    });
  });
  if (!totalItens) return 52;
  return Math.max(15, Math.round((feitos / totalItens) * 100));
}
