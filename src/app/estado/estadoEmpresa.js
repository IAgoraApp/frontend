import { useMemo, useSyncExternalStore } from 'react';

export const CHAVE_EMPRESA = 'iagora:empresa:v1';
const EVENTO_EMPRESA = 'iagora:empresa:mudanca';

export const situacoesAnuncio = {
  ativo: 'Ativo',
  analise: 'Em análise',
  pausado: 'Pausado',
  expirado: 'Expirado',
  rascunho: 'Rascunho',
};

export const situacoesContato = {
  naoLido: 'Não respondido',
  andamento: 'Em andamento',
  concluido: 'Concluído',
};

export const categoriasEmpresa = [
  'Limpeza',
  'Manutenção',
  'Mudanças',
  'Organização',
  'Outros',
];

export const idEmpresaPadrao = 'casa-em-dia';

export const normalizarTexto = valor =>
  String(valor)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

export const formatarData = valor => new Date(valor).toLocaleDateString('pt-BR');

export const urlSegura = valor => {
  try {
    const url = new URL(valor);
    return ['http:', 'https:'].includes(url.protocol) ? url.href : null;
  } catch {
    return null;
  }
};

function mapearSituacaoAnuncio(situacao) {
  const mapa = {
    active: 'ativo',
    review: 'analise',
    paused: 'pausado',
    expired: 'expirado',
    draft: 'rascunho',
  };
  return situacoesAnuncio[situacao] ? situacao : (mapa[situacao] ?? null);
}

function mapearSituacaoContato(situacao) {
  const mapa = {
    unread: 'naoLido',
    progress: 'andamento',
    done: 'concluido',
  };
  return situacoesContato[situacao] ? situacao : (mapa[situacao] ?? null);
}

export function criarEstadoInicialEmpresa() {
  const agora = new Date().toISOString();
  const base = {
    descricao:
      'Limpeza residencial e pós-mudança, com equipe treinada e produtos de qualidade.',
    regiao: 'São Paulo, SP e região',
    preco: 'A partir de R$ 120,00',
    telefone: '(11) 91234-5678',
    email: 'contato@casaemdia.exemplo',
    disponibilidade: 'Segunda a sábado, das 8h às 18h',
    atendimento: 'Residencial',
    fotos: [],
    atualizadoEm: agora,
    criadoEm: agora,
  };
  return {
    versao: 1,
    exemplo: true,
    empresa: {
      id: idEmpresaPadrao,
      nome: 'Casa em Dia Serviços',
      email: 'contato@casaemdia.exemplo',
      telefone: '(11) 91234-5678',
      regiao: 'São Paulo, SP e região',
      categoria: 'Limpeza',
      sobre:
        'Somos uma empresa de limpeza e organização. Combinamos os detalhes de cada atendimento para entender o que sua casa precisa.',
      endereco: '',
      site: '',
      horario: 'Segunda a sábado, das 8h às 18h',
      logo: '',
      portfolio: [],
    },
    anuncios: [
      {
        ...base,
        id: 'limpeza-residencial',
        titulo: 'Limpeza residencial',
        categoria: 'Limpeza',
        situacao: 'ativo',
        visualizacoes: 420,
        contatosRecebidos: 24,
      },
      {
        ...base,
        id: 'pos-mudanca',
        titulo: 'Limpeza pós-mudança',
        categoria: 'Limpeza',
        situacao: 'analise',
        visualizacoes: 230,
        contatosRecebidos: 12,
      },
      {
        ...base,
        id: 'organizacao',
        titulo: 'Organização de ambientes',
        categoria: 'Organização',
        situacao: 'pausado',
        visualizacoes: 98,
        contatosRecebidos: 6,
      },
      {
        ...base,
        id: 'limpeza-comercial',
        titulo: 'Limpeza comercial',
        categoria: 'Limpeza',
        situacao: 'expirado',
        atendimento: 'Comercial',
        visualizacoes: 55,
        contatosRecebidos: 2,
      },
    ],
    contatos: [
      {
        id: 'joao',
        nome: 'João Silva',
        contato: 'Contato demonstrativo',
        anuncioId: 'limpeza-residencial',
        servico: 'Limpeza residencial',
        situacao: 'naoLido',
        criadoEm: agora,
        mensagens: [
          {
            id: 'mensagem-joao',
            autor: 'cliente',
            texto:
              'Olá! Gostaria de um orçamento para limpar meu apartamento de dois quartos. Vocês atendem na Vila Mariana?',
            data: agora,
          },
        ],
      },
      {
        id: 'mariana',
        nome: 'Mariana Costa',
        contato: 'Contato demonstrativo',
        anuncioId: 'pos-mudanca',
        servico: 'Limpeza pós-mudança',
        situacao: 'andamento',
        criadoEm: agora,
        mensagens: [
          {
            id: 'mensagem-mariana',
            autor: 'cliente',
            texto: 'Preciso de uma limpeza completa após a mudança.',
            data: agora,
          },
        ],
      },
      {
        id: 'carlos',
        nome: 'Carlos Henrique',
        contato: 'Contato demonstrativo',
        anuncioId: 'organizacao',
        servico: 'Organização de ambientes',
        situacao: 'concluido',
        criadoEm: agora,
        mensagens: [
          {
            id: 'mensagem-carlos',
            autor: 'cliente',
            texto: 'Quero organizar os armários e a cozinha.',
            data: agora,
          },
        ],
      },
      {
        id: 'patricia',
        nome: 'Patrícia Lima',
        contato: 'Contato demonstrativo',
        anuncioId: 'limpeza-residencial',
        servico: 'Limpeza residencial',
        situacao: 'andamento',
        criadoEm: agora,
        mensagens: [
          {
            id: 'mensagem-patricia',
            autor: 'cliente',
            texto: 'Vocês têm disponibilidade para esta semana?',
            data: agora,
          },
        ],
      },
    ],
  };
}

const estadoPadrao = criarEstadoInicialEmpresa();

function migrarDadosLegados(dados) {
  if (dados?.versao === 1) return dados;
  if (dados?.version === 1) {
    return {
      versao: 1,
      exemplo: Boolean(dados.example),
      empresa: {
        id: dados.company?.id || idEmpresaPadrao,
        nome: dados.company?.name || '',
        email: dados.company?.email || '',
        telefone: dados.company?.phone || '',
        regiao: dados.company?.region || '',
        categoria: dados.company?.category || 'Limpeza',
        sobre: dados.company?.about || '',
        endereco: dados.company?.address || '',
        site: dados.company?.website || '',
        horario: dados.company?.hours || '',
        logo: dados.company?.logo || '',
        portfolio: Array.isArray(dados.company?.portfolio)
          ? dados.company.portfolio
          : [],
      },
      anuncios: (dados.ads || []).map(anuncio => ({
        id: anuncio.id,
        titulo: anuncio.title,
        descricao: anuncio.description,
        categoria: anuncio.category,
        regiao: anuncio.region,
        preco: anuncio.price,
        telefone: anuncio.phone,
        email: anuncio.email,
        disponibilidade: anuncio.availability,
        atendimento: anuncio.attendance,
        fotos: Array.isArray(anuncio.photos) ? anuncio.photos : [],
        situacao: mapearSituacaoAnuncio(anuncio.status) || 'rascunho',
        visualizacoes: Number(anuncio.views) || 0,
        contatosRecebidos: Number(anuncio.contactCount) || 0,
        criadoEm: anuncio.createdAt,
        atualizadoEm: anuncio.updatedAt,
      })),
      contatos: (dados.contacts || []).map(contato => ({
        id: contato.id,
        nome: contato.name,
        contato: contato.contact,
        anuncioId: contato.adId,
        servico: contato.service,
        situacao: mapearSituacaoContato(contato.status) || 'naoLido',
        criadoEm: contato.createdAt,
        mensagens: (contato.messages || []).map(msg => ({
          id: msg.id,
          autor: msg.author === 'client' ? 'cliente' : 'empresa',
          texto: msg.text,
          data: msg.date,
        })),
      })),
    };
  }
  return null;
}

export function analisarEstadoEmpresa(bruto) {
  if (!bruto) return { dados: estadoPadrao, erro: false };
  try {
    const analisado = JSON.parse(bruto);
    const dados = migrarDadosLegados(analisado);
    if (
      !dados ||
      dados.versao !== 1 ||
      typeof dados.empresa?.nome !== 'string' ||
      !Array.isArray(dados.empresa.portfolio) ||
      !Array.isArray(dados.anuncios) ||
      !Array.isArray(dados.contatos) ||
      !dados.anuncios.every(
        anuncio =>
          typeof anuncio.id === 'string' &&
          typeof anuncio.titulo === 'string' &&
          typeof anuncio.descricao === 'string' &&
          typeof anuncio.regiao === 'string' &&
          Object.hasOwn(situacoesAnuncio, anuncio.situacao) &&
          Array.isArray(anuncio.fotos) &&
          Number.isFinite(anuncio.visualizacoes) &&
          Number.isFinite(anuncio.contatosRecebidos)
      ) ||
      !dados.contatos.every(
        contato =>
          typeof contato.id === 'string' &&
          typeof contato.nome === 'string' &&
          Object.hasOwn(situacoesContato, contato.situacao) &&
          Array.isArray(contato.mensagens) &&
          contato.mensagens.every(
            mensagem =>
              typeof mensagem.texto === 'string' &&
              typeof mensagem.data === 'string'
          )
      )
    ) {
      throw new Error('invalido');
    }
    return { dados, erro: false };
  } catch {
    return { dados: estadoPadrao, erro: true };
  }
}

function capturarEstadoEmpresa() {
  try {
    return localStorage.getItem(CHAVE_EMPRESA);
  } catch {
    return '__indisponivel__';
  }
}

function inscreverEmpresa(ouvinte) {
  const aoMudarArmazenamento = evento => {
    if (evento.key === CHAVE_EMPRESA || evento.key === null) ouvinte();
  };
  window.addEventListener('storage', aoMudarArmazenamento);
  window.addEventListener(EVENTO_EMPRESA, ouvinte);
  return () => {
    window.removeEventListener('storage', aoMudarArmazenamento);
    window.removeEventListener(EVENTO_EMPRESA, ouvinte);
  };
}

export function useEmpresa() {
  const bruto = useSyncExternalStore(
    inscreverEmpresa,
    capturarEstadoEmpresa,
    () => null
  );
  return useMemo(() => analisarEstadoEmpresa(bruto), [bruto]);
}

export function atualizarEmpresa(atualizador) {
  const atual = analisarEstadoEmpresa(capturarEstadoEmpresa());
  if (atual.erro) {
    throw new Error(
      'Não foi possível ler os dados anteriores. Eles foram preservados.'
    );
  }
  const proximo = atualizador(atual.dados);
  if (analisarEstadoEmpresa(JSON.stringify(proximo)).erro) {
    throw new Error('Confira os dados antes de salvar.');
  }
  try {
    localStorage.setItem(CHAVE_EMPRESA, JSON.stringify(proximo));
  } catch {
    throw new Error(
      'Não foi possível salvar no navegador. Libere espaço ou reduza as fotos.'
    );
  }
  window.dispatchEvent(new Event(EVENTO_EMPRESA));
  return proximo;
}

export function validarAnuncio(anuncio) {
  if (
    !anuncio.titulo.trim() ||
    !anuncio.descricao.trim() ||
    !anuncio.regiao.trim() ||
    !anuncio.preco.trim()
  ) {
    return 'Preencha título, descrição, região e preço ou orçamento.';
  }
  if (!categoriasEmpresa.includes(anuncio.categoria)) {
    return 'Escolha uma categoria.';
  }
  if (!anuncio.telefone.trim() && !anuncio.email.trim()) {
    return 'Informe pelo menos um contato da empresa.';
  }
  if (
    anuncio.email &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(anuncio.email)
  ) {
    return 'Informe um e-mail válido.';
  }
  return '';
}

export const criarAnuncioVazio = empresa => ({
  id: crypto.randomUUID(),
  titulo: '',
  descricao: '',
  categoria: 'Limpeza',
  regiao: empresa.regiao,
  preco: 'Sob orçamento',
  telefone: empresa.telefone,
  email: empresa.email,
  disponibilidade: empresa.horario,
  atendimento: 'Residencial',
  fotos: [],
  situacao: 'rascunho',
  visualizacoes: 0,
  contatosRecebidos: 0,
  criadoEm: new Date().toISOString(),
  atualizadoEm: new Date().toISOString(),
});

export async function lerImagemComoDados(arquivo) {
  if (
    !['image/jpeg', 'image/png', 'image/webp'].includes(arquivo.type) ||
    arquivo.size > 5 * 1024 * 1024
  ) {
    throw new Error('Use JPG, PNG ou WebP de até 5 MB.');
  }
  const url = URL.createObjectURL(arquivo);
  try {
    const imagem = new Image();
    imagem.src = url;
    await imagem.decode();
    const escala = Math.min(
      1,
      1000 / Math.max(imagem.width, imagem.height)
    );
    const tela = document.createElement('canvas');
    tela.width = Math.round(imagem.width * escala);
    tela.height = Math.round(imagem.height * escala);
    tela.getContext('2d').drawImage(imagem, 0, 0, tela.width, tela.height);
    return tela.toDataURL('image/jpeg', 0.78);
  } finally {
    URL.revokeObjectURL(url);
  }
}
