import { Link, useLocation } from 'react-router-dom';
import { destinoMercado } from '../../aplicacao/utilitarios/navegacao';

export function LinkNavegacao({ to, ...propriedades }) {
  const { pathname } = useLocation();
  return <Link to={destinoMercado(to, pathname)} {...propriedades} />;
}
