import { acessoLocal } from '../dados/acessoLocal';
import { lerSessao } from '../dados/contaApi';
import { Navigate, Outlet } from 'react-router-dom';
import LayoutAplicacao from './appLayout';
import { Rodape } from '../../shared/index';

export default function LayoutEmpresas(propriedades) {
  if (!acessoLocal && lerSessao()?.tipo !== 2) return <Navigate to='/perfil' replace />;
  return (
    <LayoutAplicacao {...propriedades} varianteCabecalho='empresas'>
      <Outlet />
      <Rodape variante='empresa' />
    </LayoutAplicacao>
  );
}
