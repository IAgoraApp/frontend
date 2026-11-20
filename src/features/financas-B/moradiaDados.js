import { alterarBancoPreparacao } from '../../app/dados/bancoMvp';
import { modelo, proximoId, removerRegistro } from '../preparacao/modelo';

const maximoValor = 9999999999.99;

export function editarMoradia(
  usuario,
  entidade,
  pai,
  registro,
  valores,
  copiarCustos
) {
  let salvo;
  alterarBancoPreparacao(banco => {
    const simulacao =
      entidade === 'simulacao_item'
        ? banco.simulacao_moradia.find(item => item.id === pai)
        : null;
    const planoId =
      entidade === 'plano_moradia'
        ? registro?.id
        : (simulacao?.plano_id ?? pai);
    const plano = banco.plano_moradia.find(
      item => item.id === planoId && item.user_id === usuario
    );
    const configuracao = modelo[entidade];
    const vinculo = configuracao.vinculo ?? 'user_id';
    const responsavel = configuracao.vinculo ? pai : usuario;
    const atual =
      registro &&
      banco[entidade].find(
        item => item.id === registro.id && item[vinculo] === responsavel
      );
    const planoExistente = entidade !== 'plano_moradia' || registro;
    if (!usuario || (planoExistente && !plano) || (registro && !atual))
      throw new Error('Este registro já não está disponível.');

    if (!valores) {
      removerRegistro(banco, entidade, atual.id);
      return;
    }

    const campos = Object.fromEntries(
      configuracao.campos.map(({ nome }) => [nome, valores[nome]])
    );
    if (entidade === 'plano_moradia' && atual) campos.status = valores.status;
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
    const padrao =
      entidade === 'plano_moradia'
        ? { status: 'ativo' }
        : entidade === 'simulacao_moradia'
          ? { criada_em: new Date().toISOString() }
          : {};
    banco[entidade].push({
      ...padrao,
      ...campos,
      id: salvo,
      [vinculo]: responsavel,
    });
    if (entidade === 'simulacao_moradia' && copiarCustos) {
      const custos = banco.custo_moradia.filter(item => item.plano_id === pai);
      const primeiroId = proximoId(banco.simulacao_item);
      banco.simulacao_item.push(
        ...custos.map(({ nome, categoria, tipo, valor }, indice) => ({
          id: primeiroId + indice,
          simulacao_id: salvo,
          nome,
          categoria,
          tipo,
          valor,
        }))
      );
    }
  });
  return salvo;
}
