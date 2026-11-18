import { acessoLocal } from '../dados/acessoLocal';
import { Navigate, Outlet } from 'react-router-dom';
import { lerSessao } from '../dados/contaApi';

export const RotaPrivada = () =>
  acessoLocal || lerSessao() ? <Outlet /> : <Navigate to='/login' replace />;

export const RotaPublica = () => <Outlet />;
