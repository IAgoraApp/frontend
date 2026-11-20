import { contaApi } from './contaApi';

export function registroDaApi(registro) {
  return Object.fromEntries(
    Object.entries(registro).map(([chave, valor]) => [
      chave.replace(/[A-Z]/g, letra => '_' + letra.toLowerCase()),
      valor,
    ])
  );
}

export async function listarApi(caminho, opcoes) {
  const dados = await contaApi(caminho, opcoes);
  if (!Array.isArray(dados))
    throw new Error('O servidor não retornou a lista esperada.');
  return dados.map(registroDaApi);
}

export async function opcionalApi(caminho, opcoes) {
  try {
    return await contaApi(caminho, opcoes);
  } catch (falha) {
    if (falha.status === 404) return null;
    throw falha;
  }
}
