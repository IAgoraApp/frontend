import { EmpresaSection } from './components';
import { useLocation } from 'react-router-dom';
export default function Empresa({ pagina = 'inicio' }) {
  const { pathname } = useLocation();
  return <EmpresaSection key={pathname} pagina={pagina} />;
}
