import { contaApi } from '../../app/dados/contaApi';
import {
  listarApi,
  opcionalApi,
  registroDaApi,
} from '../../app/dados/contratoApi';

export async function carregarCasa(usuario, perfil, opcoes) {
  const casas = await listarApi(`/casas/user/${usuario}`, opcoes);
  const casa = casas[0];
  if (!casa) return { casa: casas };
  const [endereco, comodos, limpezas, execucoes, estoque, compras] =
    await Promise.all([
      casa.endereco_id
        ? opcionalApi(`/casas/${casa.id}/endereco`, opcoes)
        : null,
      listarApi(`/comodos/casa/${casa.id}`, opcoes),
      listarApi(`/limpezas/casa/${casa.id}`, opcoes),
      listarApi(`/execucoes-limpeza/perfil/${perfil.id}`, opcoes),
      listarApi(`/estoque-itens/casa/${casa.id}`, opcoes),
      listarApi(`/compras/casa/${casa.id}`, opcoes),
    ]);
  return {
    casa: casas,
    endereco: endereco ? [endereco] : [],
    comodo: comodos,
    limpezas,
    execucao_limpeza: execucoes,
    estoque_item: estoque,
    compras,
  };
}

export function editarResidencia(id, { nome, tipo, ...endereco }) {
  return contaApi(`/casas/${id}/residencia`, {
    metodo: 'PATCH',
    dados: { nome, tipo, endereco },
  });
}

const rotas = { comodo: '/comodos', limpezas: '/limpezas' };

export async function salvarRegistroCasa(colecao, registro) {
  const { id, casa_id, comodo_id, nome, tipo, descricao, proxima_vez } =
    registro;
  const rota = rotas[colecao];
  const resposta = await contaApi(id ? `${rota}/${id}` : rota, {
    metodo: id ? 'PATCH' : 'POST',
    dados:
      colecao === 'comodo'
        ? { casaId: casa_id, nome, tipo, descricao }
        : { comodoId: comodo_id, nome, descricao, proximaVez: proxima_vez },
  });
  return resposta ? registroDaApi(resposta) : registro;
}

export function excluirRegistroCasa(colecao, id) {
  return contaApi(`${rotas[colecao]}/${id}`, { metodo: 'DELETE' });
}

export function registrarLimpeza(id, perfilId) {
  const agora = new Date();
  const dataLocal = new Date(
    agora.getTime() - agora.getTimezoneOffset() * 60000
  );
  return contaApi(`/limpezas/${id}/execucoes`, {
    metodo: 'POST',
    dados: { perfilId, realizadaEm: dataLocal.toISOString().slice(0, -1) },
  });
}

export function excluirExecucaoLimpeza(limpezaId, id) {
  return contaApi(`/limpezas/${limpezaId}/execucoes/${id}`, {
    metodo: 'DELETE',
  });
}
