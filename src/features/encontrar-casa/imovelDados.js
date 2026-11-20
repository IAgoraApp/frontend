import { alterarBancoPreparacao } from '../../app/dados/bancoMvp';
import { camposEnderecoPerfil } from '../perfil/perfilDados';
import { proximoId } from '../preparacao/modelo';
import { tipoValorImovel } from '../preparacao/valorImovel';
import { planoDoImovel } from '../financas-B/moradiaDados';

export const opcoesMobilia = [
  ['mobiliado', 'Mobiliado'],
  ['parcial', 'Parcialmente mobiliado'],
  ['sem-moveis', 'Sem móveis'],
];
export function salvarImovel(usuario, id, valores) {
  const {
    titulo,
    descricao,
    tipo,
    valor,
    valor_tipo,
    mobilia,
    ...dadosEndereco
  } = valores;
  if (valor != null && !['mensal', 'total'].includes(valor_tipo))
    throw new Error('Escolha se o valor do imóvel é mensal ou total.');
  if (
    valor != null &&
    (!Number.isFinite(valor) || valor < 0 || valor > 9999999999.99)
  )
    throw new Error('Informe um valor válido para o imóvel.');
  if (descricao?.length > 500)
    throw new Error('A descrição aceita até 500 caracteres.');
  if (dadosEndereco.cep && !/^\d{5}-?\d{3}$/.test(dadosEndereco.cep))
    throw new Error('Informe um CEP com oito dígitos.');
  const dados = Object.fromEntries(
    camposEnderecoPerfil.map(({ nome }) => [nome, dadosEndereco[nome] ?? null])
  );
  let salvo;
  alterarBancoPreparacao(banco => {
    const atual = banco.casa_desejada.find(
      item => item.user_id === usuario && item.id === id
    );
    if (id && !atual) throw new Error('O imóvel já não está disponível.');
    if (
      atual &&
      tipoValorImovel(atual) === 'mensal' &&
      (valor !== atual.valor || valor_tipo !== 'mensal')
    ) {
      const plano = planoDoImovel(banco, usuario, atual.id);
      if (plano)
        banco.custo_moradia = banco.custo_moradia.filter(
          item =>
            !(
              item.plano_id === plano.id &&
              item.tipo === 'mensal' &&
              item.categoria === 'moradia' &&
              item.nome === 'Aluguel ou prestação' &&
              item.valor === atual.valor
            )
        );
    }
    let endereco_id = null;
    if (Object.values(dados).some(Boolean)) {
      const existente = banco.enderecos_preparacao.find(
        item => item.id === atual?.endereco_id
      );
      if (existente) {
        Object.assign(existente, dados);
        Object.assign(
          banco.endereco.find(item => item.id === existente.id),
          dados
        );
        endereco_id = existente.id;
      } else {
        endereco_id = proximoId(banco.endereco);
        const endereco = { ...dados, id: endereco_id };
        banco.endereco.push(endereco);
        banco.enderecos_preparacao.push(endereco);
      }
    }
    salvo = atual?.id ?? proximoId(banco.casa_desejada);
    const registro = {
      id: salvo,
      user_id: usuario,
      titulo,
      descricao,
      tipo,
      valor,
      valor_tipo,
      mobilia,
      endereco_id,
    };
    if (atual) Object.assign(atual, registro);
    else banco.casa_desejada.push(registro);
  });
  return salvo;
}
