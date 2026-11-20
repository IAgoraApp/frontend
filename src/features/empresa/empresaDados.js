import { alterarBancoCobrancas, inserir } from '../../app/dados/bancoMvp';
import { servicoPublico } from '../marketplace/marketplaceDados';

export function empresaDoUsuario(b, userId) {
  return b.perfil_empresa.find(empresa => empresa.user_id === userId);
}

export function servicosDaEmpresa(b, empresa) {
  return empresa ? b.servico.filter(s => s.empresa_id === empresa.id) : [];
}

function obterEmpresa(b, userId) {
  const empresa = empresaDoUsuario(b, userId);
  if (!empresa) throw new Error('Cadastre o perfil da empresa primeiro.');
  return empresa;
}

function obterServico(b, userId, id) {
  const empresa = obterEmpresa(b, userId);
  const servico = servicosDaEmpresa(b, empresa).find(s => s.id === id);
  if (!servico) throw new Error('Serviço indisponível.');
  return { empresa, servico };
}

const chaveContaLocal = 'iagora:empresa:conta-local';
export function contaEmpresaLocal(b, sessao) {
  const selecionada = Number(sessionStorage.getItem(chaveContaLocal));
  const id = selecionada || b.perfil_empresa[0]?.user_id;
  return b.users.find(
    u =>
      empresaDoUsuario(b, u.id) &&
      (sessao?.tipo === 2 ? u.email === sessao.email : u.id === id)
  );
}

export function selecionarContaEmpresaLocal(b, email) {
  const conta = b.users.find(
    u => u.email.toLowerCase() === email && empresaDoUsuario(b, u.id)
  );
  if (!conta) return false;
  sessionStorage.setItem(chaveContaLocal, String(conta.id));
  return true;
}

function aplicarPerfil(b, userId, dados) {
  const empresa = empresaDoUsuario(b, userId);
  const cnpj = dados.cnpj?.replace(/\D/g, '');
  if (!/^\d{14}$/.test(cnpj ?? ''))
    throw new Error('Informe os 14 dígitos do CNPJ.');
  if (b.perfil_empresa.some(e => e.user_id !== userId && e.cnpj === cnpj))
    throw new Error('CNPJ já cadastrado.');
  const perfil = { ...dados, cnpj };
  if (empresa) Object.assign(empresa, perfil);
  else
    inserir(
      'perfil_empresa',
      {
        ...perfil,
        user_id: userId,
        endereco_id: null,
        validado: false,
        data_criacao: new Date().toISOString(),
      },
      b
    );
}

export function cadastrarEmpresaLocal(email, dados) {
  let conta;
  alterarBancoCobrancas(b => {
    if (b.users.some(u => u.email.toLowerCase() === email.toLowerCase()))
      throw new Error('Já existe uma conta com esse e-mail.');
    conta = inserir('users', { email, tipo: 2 }, b);
    b.contas_empresa_locais.push(conta);
    aplicarPerfil(b, conta.id, dados);
  });
  sessionStorage.setItem(chaveContaLocal, String(conta.id));
}

export function salvarEmpresa(userId, dados) {
  alterarBancoCobrancas(b => {
    if (
      !b.users.some(
        u => u.id === userId && (u.tipo === 2 || empresaDoUsuario(b, u.id))
      )
    )
      throw new Error('Conta profissional indisponível.');
    aplicarPerfil(b, userId, dados);
  });
}

export function enviarEmpresaParaAnalise(userId) {
  alterarBancoCobrancas(b => {
    const empresa = obterEmpresa(b, userId);
    if (empresa.validado || b.validacoes_empresa.includes(empresa.id))
      throw new Error('O perfil já foi enviado para análise.');
    b.validacoes_empresa.push(empresa.id);
  });
}

export function salvarEnderecoEmpresa(userId, endereco) {
  alterarBancoCobrancas(b => {
    const empresa = obterEmpresa(b, userId);
    const atual = b.enderecos_empresa.find(e => e.id === empresa.endereco_id);
    if (atual) {
      Object.assign(atual, endereco, { id: atual.id });
    } else {
      empresa.endereco_id = inserir('endereco', endereco, b).id;
      b.enderecos_empresa.push(
        b.endereco.find(e => e.id === empresa.endereco_id)
      );
    }
    b.endereco = b.endereco.map(e =>
      e.id === empresa.endereco_id
        ? b.enderecos_empresa.find(item => item.id === e.id)
        : e
    );
  });
}

export function salvarServico(userId, id, dados) {
  let salvo;
  alterarBancoCobrancas(b => {
    const empresa = obterEmpresa(b, userId);
    const { titulo, descricao, categoria, tipo_preco, fotos, disponibilidade } =
      dados;
    const preco = tipo_preco === 'orcamento' ? null : dados.preco;
    if (!titulo?.trim() || !descricao?.trim() || !categoria?.trim())
      throw new Error(
        'Preencha o título, a descrição e a categoria do serviço.'
      );
    if (
      tipo_preco !== 'orcamento' &&
      (!Number.isFinite(preco) ||
        preco < 0 ||
        preco > 99999999.99 ||
        Math.abs(preco * 100 - Math.round(preco * 100)) > 0.00001)
    )
      throw new Error('Informe um preço válido com até duas casas decimais.');
    const valores = {
      titulo: titulo.trim(),
      descricao: descricao.trim(),
      categoria: categoria.trim(),
      tipo_preco,
      preco,
      fotos,
      disponibilidade,
    };
    if (id) {
      salvo = obterServico(b, userId, id).servico;
      Object.assign(salvo, valores);
    } else {
      salvo = inserir(
        'servico',
        {
          ...valores,
          empresa_id: empresa.id,
          ativo: true,
          validado: false,
          nota: null,
          status_publicacao: 'rascunho',
          publicado_em: null,
          expira_em: null,
        },
        b
      );
    }
  });
  return salvo;
}

export function acionarServico(userId, id, acao) {
  alterarBancoCobrancas(b => {
    const { empresa, servico } = obterServico(b, userId, id);
    if (acao === 'validar') {
      if (
        !empresa.validado ||
        servico.validado ||
        servico.status_publicacao === 'pendente'
      )
        throw new Error(
          'O serviço precisa estar apto a ser enviado para análise.'
        );
      servico.status_publicacao = 'pendente';
    } else if (acao === 'excluir') {
      if (
        b.servico_contratado.some(p => p.servico_id === id) ||
        b.publicacao_servico.some(p => p.servico_id === id)
      )
        throw new Error(
          'Este serviço tem histórico. Desative-o para retirar do catálogo.'
        );
      b.servico = b.servico.filter(s => s.id !== id);
    } else {
      servico.ativo = acao === 'ativar';
    }
  });
}

function publicacaoDoUsuario(b, userId, id) {
  const publicacao = b.publicacao_servico.find(p => p.id === id);
  const vinculo = obterServico(b, userId, publicacao?.servico_id);
  return { ...vinculo, publicacao };
}

export function contratarPublicacao(userId, servicoId, planoId, renovacaoId) {
  alterarBancoCobrancas(b => {
    const { empresa, servico } = obterServico(b, userId, servicoId);
    const anterior =
      renovacaoId && publicacaoDoUsuario(b, userId, renovacaoId).publicacao;
    if (!empresa.validado || !servico.validado || !servico.ativo)
      throw new Error(
        'A publicação exige empresa e serviço aprovados e serviço ativo.'
      );
    if (
      (anterior && anterior.servico_id !== servico.id) ||
      b.publicacao_servico.some(
        p => p.servico_id === servicoId && p.status === 'pendente'
      )
    )
      throw new Error('Já existe uma publicação pendente ou o registro mudou.');
    if (
      !anterior &&
      b.publicacao_servico.some(
        p =>
          p.servico_id === servicoId &&
          p.status === 'ativa' &&
          Date.parse(p.fim) > Date.now()
      )
    )
      throw new Error('Use a opção de renovar a publicação atual.');
    const plano = b.plano_publicacao.find(
      p => p.id === (anterior?.plano_id ?? planoId) && p.ativo
    );
    if (!plano) throw new Error('Plano de publicação indisponível.');
    inserir(
      'publicacao_servico',
      {
        servico_id: servico.id,
        plano_id: plano.id,
        valor: plano.preco,
        status: 'pendente',
        inicio: null,
        fim: null,
      },
      b
    );
  });
}

export function cancelarPublicacao(userId, id) {
  alterarBancoCobrancas(b => {
    const { publicacao, servico } = publicacaoDoUsuario(b, userId, id);
    if (
      !['pendente', 'ativa'].includes(publicacao.status) ||
      (publicacao.fim && Date.parse(publicacao.fim) <= Date.now())
    )
      throw new Error('A publicação já foi encerrada.');
    publicacao.status = 'cancelada';
    b.pagamento
      .filter(
        p =>
          p.user_id === userId &&
          p.publicacao_id === id &&
          p.status === 'pendente'
      )
      .forEach(p => {
        p.status = 'cancelado';
      });
    atualizarVitrine(b, servico);
  });
}

export function cobrarPublicacao(userId, id, metodoId) {
  alterarBancoCobrancas(b => {
    const { publicacao } = publicacaoDoUsuario(b, userId, id);
    if (
      publicacao.status !== 'pendente' ||
      b.pagamento.some(p => p.publicacao_id === id && p.status === 'pendente')
    )
      throw new Error('Já existe uma cobrança ou a publicação foi encerrada.');
    if (
      !b.metodo_pagamento.some(
        m => m.user_id === userId && m.id === metodoId && m.ativo
      )
    )
      throw new Error('Selecione um método de pagamento ativo.');
    inserir(
      'pagamento',
      {
        user_id: userId,
        metodo_id: metodoId,
        assinatura_id: null,
        publicacao_id: id,
        valor: publicacao.valor,
        status: 'pendente',
        gateway: 'mock',
        transacao_externa_id: null,
        criado_em: new Date().toISOString(),
        pago_em: null,
      },
      b
    );
  });
}

function atualizarVitrine(b, servico) {
  const vigentes = b.publicacao_servico.filter(
    p =>
      p.servico_id === servico.id &&
      p.status === 'ativa' &&
      Date.parse(p.fim) > Date.now()
  );
  if (!vigentes.length) {
    if (servico.status_publicacao === 'publicado')
      servico.status_publicacao = 'rascunho';
    servico.publicado_em = null;
    servico.expira_em = null;
    return;
  }
  servico.status_publicacao = 'publicado';
  servico.publicado_em = new Date(
    Math.min(...vigentes.map(p => Date.parse(p.inicio)))
  ).toISOString();
  servico.expira_em = new Date(
    Math.max(...vigentes.map(p => Date.parse(p.fim)))
  ).toISOString();
}

export function concluirPagamentoPublicacao(userId, id, confirmar) {
  alterarBancoCobrancas(b => {
    const pagamento = b.pagamento.find(
      p =>
        p.id === id &&
        p.user_id === userId &&
        p.publicacao_id &&
        p.status === 'pendente' &&
        p.gateway === 'mock'
    );
    if (!pagamento) throw new Error('Cobrança indisponível.');
    if (!confirmar) {
      pagamento.status = 'cancelado';
      return;
    }
    const { empresa, servico, publicacao } = publicacaoDoUsuario(
      b,
      userId,
      pagamento.publicacao_id
    );
    const plano = b.plano_publicacao.find(p => p.id === publicacao.plano_id);
    if (
      !empresa.validado ||
      !servico.validado ||
      !servico.ativo ||
      publicacao.status !== 'pendente' ||
      !plano
    )
      throw new Error('A publicação precisa estar apta para ativação.');
    const agora = Date.now();
    const inicio = Math.max(
      agora,
      ...b.publicacao_servico
        .filter(
          p => p.servico_id === servico.id && p.status === 'ativa' && p.fim
        )
        .map(p => Date.parse(p.fim))
    );
    const fim = inicio + plano.duracao_dias * 86400000;
    Object.assign(publicacao, {
      status: 'ativa',
      inicio: new Date(inicio).toISOString(),
      fim: new Date(fim).toISOString(),
    });
    pagamento.status = 'pago';
    pagamento.pago_em = new Date(agora).toISOString();
    atualizarVitrine(b, servico);
  });
}

export function situacaoServico(servico, empresa, publicacoes) {
  if (!servico.ativo) return 'Desativado';
  if (
    servicoPublico(
      servico,
      empresa,
      undefined,
      publicacoes.filter(p => p.servico_id === servico.id)
    )
  )
    return 'Publicado';
  if (servico.validado) return 'Aprovado';
  if (servico.status_publicacao === 'pendente') return 'Em análise';
  if (servico.status_publicacao === 'reprovado') return 'Reprovado';
  return 'Rascunho';
}
