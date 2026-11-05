import AppLayout from './appLayout';
import { Outlet } from 'react-router-dom';
import Footer from '../../shared/footer';
import EmpresaNavigation from './components/empresaNavigation';

export default function EmpresasLayout(props) {
  return (
    <AppLayout {...props} headerVariant='empresas'>
      <EmpresaNavigation />
      <Outlet />
      <Footer variant='empresa' />
    </AppLayout>
  );
}
