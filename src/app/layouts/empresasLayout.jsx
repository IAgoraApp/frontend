import { Outlet } from 'react-router-dom';
import LayoutAplicacao from './appLayout';
import { Rodape } from '../../shared/index';

export default function LayoutEmpresas(propriedades) {
  return (
    <LayoutAplicacao {...propriedades} varianteCabecalho='empresas'>
      <Outlet />
      <Rodape variante='empresa' />
    </LayoutAplicacao>
  );
}
