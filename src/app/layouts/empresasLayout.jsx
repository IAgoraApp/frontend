import { Outlet } from 'react-router-dom';
import { Header } from '../../shared';

export default function EmpresasLayout({ children }) {
  return (
    <>
      <Header variant='empresas' />
      {children || <Outlet />}
    </>
  );
}
