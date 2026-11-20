import { acessoLocal } from '../dados/acessoLocal';
import { Navigate, Outlet } from 'react-router-dom';
import DadosServidor from '../dados/DadosServidor';
import { useSessao } from '../dados/sessao';

export function RotaPrivada() {
  const sessao = useSessao();
  if (acessoLocal) return <Outlet />;
  return sessao ? (
    <DadosServidor sessao={sessao}>
      <Outlet />
    </DadosServidor>
  ) : (
    <Navigate to='/login' replace />
  );
}

export const RotaPublica = () => <Outlet />;
