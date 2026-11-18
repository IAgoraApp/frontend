const chaveSessao = 'iagora:sessao:v1';
const base = (
  import.meta.env.DEV ? '/api' : import.meta.env.VITE_API_URL || '/api'
).replace(/\/+$/, '');

export function lerSessao() {
  try {
    const sessao = JSON.parse(sessionStorage.getItem(chaveSessao));
    return sessao?.token &&
      Number.isInteger(sessao.id) &&
      [1, 2].includes(sessao.tipo)
      ? sessao
      : null;
  } catch {
    return null;
  }
}

export function salvarSessao(sessao) {
  if (
    !sessao?.token ||
    !Number.isInteger(sessao.id) ||
    ![1, 2].includes(sessao.tipo)
  )
    throw new Error('O servidor não retornou uma sessão válida.');
  sessionStorage.setItem(chaveSessao, JSON.stringify(sessao));
}

export function encerrarSessao() {
  sessionStorage.removeItem(chaveSessao);
}

export async function contaApi(
  caminho,
  { metodo = 'GET', dados, token, signal } = {}
) {
  let resposta;
  try {
    resposta = await fetch(base + caminho, {
      method: metodo,
      headers: {
        Accept: 'application/json',
        ...(dados && { 'Content-Type': 'application/json' }),
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: dados ? JSON.stringify(dados) : undefined,
      signal,
    });
  } catch (erro) {
    if (erro.name === 'AbortError') throw erro;
    throw new Error('Não foi possível conectar ao servidor. Tente novamente.', {
      cause: erro,
    });
  }

  const corpo = resposta.headers
    .get('content-type')
    ?.includes('application/json')
    ? await resposta.json()
    : null;
  if (!resposta.ok) {
    const erro = new Error(
      corpo?.erro ||
        corpo?.mensagem ||
        corpo?.message ||
        (resposta.status >= 500
          ? 'O servidor está indisponível. Tente novamente.'
          : 'Não foi possível concluir esta operação.')
    );
    erro.status = resposta.status;
    throw erro;
  }
  return corpo;
}
