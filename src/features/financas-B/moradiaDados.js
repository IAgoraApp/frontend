import { alterarBancoPreparacao } from '../../app/dados/bancoMvp';
import {
  listar,
  modelo,
  proximoId,
  removerRegistro,
} from '../preparacao/modelo';

const maximoValor = 9999999999.99;

export function planoDoImovel(banco, usuario, imovelId) {
  const vinculo = banco.vinculos_planos_imoveis?.find(
    item => item.user_id === usuario && item.imovel_id === imovelId
  );
  return banco.plano_moradia.find(
    item => item.id === vinculo?.plano_id && item.user_id === usuario
  );
}

export function planoDeReferencia(banco, usuario, imovel) {
  const vinculado = planoDoImovel(banco, usuario, imovel?.id);
  if (vinculado) return vinculado;
  const primeiro = listar(banco, 'casa_desejada', usuario)[0];
  if (imovel && imovel.id !== primeiro?.id) return undefined;
  return listar(banco, 'plano_moradia', usuario).find(
    item =>
      item.status === 'ativo' &&
      !banco.vinculos_planos_imoveis?.some(
        vinculo => vinculo.user_id === usuario && vinculo.plano_id === item.id
      )
  );
}

function garantirPlanoImovel(banco, usuario, imovelId) {
  const imovel = banco.casa_desejada.find(
    item => item.id === imovelId && item.user_id === usuario
  );
  if (!imovel) throw new Error('Este imóvel já não está disponível.');
  const atual = planoDoImovel(banco, usuario, imovelId);
  if (atual) return atual;
  const plano = {
    id: proximoId(banco.plano_moradia),
    user_id: usuario,
    nome: imovel.titulo,
    renda_mensal: 0,
    reserva_atual: 0,
    mudanca_prevista: null,
    status: 'ativo',
  };
  banco.plano_moradia.push(plano);
  banco.vinculos_planos_imoveis = (banco.vinculos_planos_imoveis ?? []).filter(
    item => item.user_id !== usuario || item.imovel_id !== imovelId
  );
  banco.vinculos_planos_imoveis.push({
    user_id: usuario,
    imovel_id: imovelId,
    plano_id: plano.id,
  });
  return plano;
}

export function salvarGastosImovel(usuario, imovelId, gastos) {
  alterarBancoPreparacao(banco => {
    const imovel = banco.casa_desejada.find(
      item => item.user_id === usuario && item.id === imovelId
    );
    if (!imovel) throw new Error('Este imóvel já não está disponível.');
    const plano =
      planoDeReferencia(banco, usuario, imovel) ??
      garantirPlanoImovel(banco, usuario, imovelId);
    for (const gasto of gastos) {
      const existente = banco.custo_moradia.find(
        item =>
          item.plano_id === plano.id &&
          item.tipo === 'mensal' &&
          item.categoria === gasto.categoria &&
          item.nome === gasto.nome
      );
      if (gasto.valor === '') {
        if (existente) removerRegistro(banco, 'custo_moradia', existente.id);
        continue;
      }
      const valor = Number(gasto.valor);
      if (!Number.isFinite(valor) || valor < 0 || valor > maximoValor)
        throw new Error('Revise o valor de ' + gasto.nome + '.');
      const dados = {
        nome: gasto.nome,
        categoria: gasto.categoria,
        tipo: 'mensal',
        plano_id: plano.id,
        valor: Math.round(valor * 100) / 100,
      };
      if (existente) Object.assign(existente, dados);
      else
        banco.custo_moradia.push({
          id: proximoId(banco.custo_moradia),
          ...dados,
        });
    }
  });
}

export function editarMoradia(
  usuario,
  entidade,
  pai,
  registro,
  valores,
  imovelId
) {
  let salvo;
  alterarBancoPreparacao(banco => {
    const planoId = entidade === 'plano_moradia' ? registro?.id : pai;
    const plano =
      banco.plano_moradia.find(
        item => item.id === planoId && item.user_id === usuario
      ) ??
      (usuario &&
        valores &&
        imovelId &&
        !pai &&
        !registro &&
        entidade === 'custo_moradia' &&
        garantirPlanoImovel(banco, usuario, imovelId));
    const configuracao = modelo[entidade];
    const vinculo = configuracao.vinculo ?? 'user_id';
    const responsavel =
      entidade === 'custo_moradia'
        ? plano?.id
        : configuracao.vinculo
          ? pai
          : usuario;
    const atual =
      (imovelId &&
        entidade === 'plano_moradia' &&
        !registro &&
        garantirPlanoImovel(banco, usuario, imovelId)) ||
      (registro &&
        banco[entidade].find(
          item => item.id === registro.id && item[vinculo] === responsavel
        ));
    const planoExistente = entidade !== 'plano_moradia' || registro;
    if (!usuario || (planoExistente && !plano) || (registro && !atual))
      throw new Error('Este registro já não está disponível.');

    if (!valores) {
      removerRegistro(banco, entidade, atual.id);
      if (entidade === 'plano_moradia')
        banco.vinculos_planos_imoveis =
          banco.vinculos_planos_imoveis?.filter(
            item => item.plano_id !== atual.id
          ) ?? [];
      return;
    }

    const campos = Object.fromEntries(
      configuracao.campos.map(({ nome }) => [nome, valores[nome]])
    );
    if (entidade === 'plano_moradia' && atual && valores.status)
      campos.status = valores.status;
    for (const chave of ['valor', 'renda_mensal', 'reserva', 'reserva_atual']) {
      if (!(chave in campos)) continue;
      const valor = campos[chave] ?? 0;
      if (!Number.isFinite(valor) || valor < 0 || valor > maximoValor)
        throw new Error('Informe um valor entre zero e R$ 9.999.999.999,99.');
      campos[chave] = Math.round(valor * 100) / 100;
    }
    if (atual) {
      Object.assign(atual, campos);
      salvo = atual.id;
      return;
    }

    salvo = proximoId(banco[entidade]);
    const padrao = entidade === 'plano_moradia' ? { status: 'ativo' } : {};
    banco[entidade].push({
      ...padrao,
      ...campos,
      id: salvo,
      [vinculo]: responsavel,
    });
  });
  return salvo;
}
