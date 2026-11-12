import { Outlet } from 'react-router-dom';
import LayoutAplicacao from './LayoutAplicacao';
import { Rodape } from '../../compartilhado/indice';

export default function LayoutEmpresas(propriedades) {
  return (
    <LayoutAplicacao {...propriedades} varianteCabecalho='empresas'>
      <Outlet />
      <Rodape variante='empresa' />
    </LayoutAplicacao>
  );
}
