import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { inicioDaSessao, perfilDaRota, perfilDaSessao, temSessao } from './sessao';
import { lerEstadoPlataforma } from '../estado/estadoPlataforma';
import { rotaPessoalDoMomento } from './navegacao';

export const RotaPrivada = () => {
  const localizacao = useLocation();
  const perfilNecessario = perfilDaRota(localizacao.pathname);
  if (!temSessao() || perfilDaSessao() !== perfilNecessario) {
    return (
      <Navigate
        to={perfilNecessario === 'empresa' ? '/login?perfil=empresa' : '/login'}
        replace
        state={{
          destino: localizacao.pathname + localizacao.search + localizacao.hash,
        }}
      />
    );
  }
  const caminho = rotaPessoalDoMomento(localizacao.pathname, lerEstadoPlataforma().perfil.momento);
  if (caminho !== localizacao.pathname) {
    return <Navigate to={caminho + localizacao.search + localizacao.hash} replace state={localizacao.state} />;
  }
  return <Outlet />;
};

export const RotaPublica = () => {
  const { pathname } = useLocation();
  if (pathname === '/' && temSessao()) {
    return <Navigate to={inicioDaSessao(lerEstadoPlataforma().perfil.momento)} replace />;
  }
  return <Outlet />;
};
