import axios from 'axios';
import { encerrarSessao, lerSessao } from './sessao';

export { encerrarSessao, lerSessao, salvarSessao } from './sessao';

const baseURL = (
  import.meta.env.DEV ? '/api' : import.meta.env.VITE_API_URL || '/api'
).replace(/\/+$/, '');

const api = axios.create({
  baseURL,
  timeout: 12000,
  allowAbsoluteUrls: false,
  headers: { Accept: 'application/json' },
});

api.interceptors.request.use(config => {
  if (config.autenticado !== false) {
    const token = config.token ?? lerSessao()?.token;
    if (token) config.headers.set('Authorization', `Bearer ${token}`);
  }
  return config;
});

api.interceptors.response.use(
  resposta => resposta,
  falha => {
    if (axios.isCancel(falha)) return Promise.reject(falha);
    const status = falha.response?.status;
    const corpo = falha.response?.data;
    const cabecalho = falha.config?.headers?.get('Authorization');
    const token = lerSessao()?.token;
    if (status === 401 && token && cabecalho === `Bearer ${token}`)
      encerrarSessao();
    const mensagem =
      corpo?.erro ||
      corpo?.mensagem ||
      corpo?.message ||
      (!status
        ? 'Não foi possível conectar ao servidor. Tente novamente.'
        : status >= 500
          ? 'O servidor está indisponível. Tente novamente.'
          : 'Não foi possível concluir esta operação.');
    return Promise.reject(
      Object.assign(new Error(mensagem, { cause: falha }), { status })
    );
  }
);

const rotasPublicas = new Set([
  '/user/login',
  '/user/login/google',
  '/user/register',
  '/user/forgot-password',
  '/user/reset-password',
]);

export async function contaApi(
  caminho,
  { metodo = 'GET', dados, token, signal, params, responseType, timeout } = {}
) {
  const resposta = await api.request({
    url: caminho,
    method: metodo,
    data: dados,
    token,
    signal,
    params,
    responseType,
    timeout,
    autenticado: !rotasPublicas.has(caminho),
  });
  return resposta.status === 204 ? null : resposta.data;
}
