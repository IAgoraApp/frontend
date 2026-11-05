import { useLocation } from 'react-router-dom';
import { MarketplaceSection } from './components';
export default function Marketplace({ empresa = false, pagina = 'lista' }) {
  const { pathname } = useLocation();
  return (
    <MarketplaceSection key={pathname} empresa={empresa} pagina={pagina} />
  );
}
