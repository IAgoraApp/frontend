import { contaApi } from '../../app/dados/contaApi';
import { listarApi } from '../../app/dados/contratoApi';
import { lerSessao, salvarSessao } from '../../app/dados/sessao';

export async function carregarPerfil(id, perfil, opcoes) {
  const [casa, endereco] = await Promise.all([
    listarApi(`/casas/user/${id}`, opcoes),
    perfil.endereco_id ? contaApi(`/perfis/${perfil.id}/endereco`, opcoes) : null,
  ]);
  return { casa, endereco: endereco ? [endereco] : [] };
}

export async function salvarIdentidade(id, { nome, email }) {
  const sessao = lerSessao();
  const atualizada = await contaApi(`/perfis/${id}/identidade`, {
    metodo: 'PATCH', dados: { nome, email },
  });
  if (sessao && lerSessao()?.token === sessao.token) salvarSessao({ ...sessao, email: atualizada.email });
}

export function salvarPerfilPessoal(id, dados) {
  return contaApi(`/perfis/${id}`, { metodo: 'PATCH', dados });
}

export function vincularEndereco(id, dados) {
  if (dados && !/^\d{5}-?\d{3}$/.test(dados.cep))
    throw new Error('Informe um CEP com oito dígitos.');
  return contaApi(`/perfis/${id}/endereco`, { metodo: dados ? 'PATCH' : 'DELETE', dados });
}
