import { Outlet } from 'react-router-dom';
import Header from '../components/shared/header';

export default function EmpresasLayout({ children }) {
  return (
    <>
      <Header variant='empresas' />
      {children || <Outlet />}
    </>
  );
}
