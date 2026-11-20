import { listar } from './modelo';

function planoAtivo(banco, usuario) {
  return listar(banco, 'plano_moradia', usuario).find(
    item => item.status === 'ativo'
  );
}

export function lerPrevisaoMudanca(banco, usuario) {
  return (
    planoAtivo(banco, usuario)?.mudanca_prevista ??
    banco.previsoes_mudanca?.find(item => item.user_id === usuario)?.data ??
    null
  );
}

export function gravarPrevisaoMudanca(banco, usuario, data) {
  const plano = planoAtivo(banco, usuario);
  banco.previsoes_mudanca = (banco.previsoes_mudanca ?? []).filter(
    item => item.user_id !== usuario
  );
  if (plano) plano.mudanca_prevista = data;
  else if (data) banco.previsoes_mudanca.push({ user_id: usuario, data });
}
