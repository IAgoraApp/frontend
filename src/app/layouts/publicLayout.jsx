import { Outlet } from 'react-router-dom';
import { Header } from '../../shared';

export default function PublicLayout({ children }) {
  return (
    <>
      <Header variant='public' />
      {children || <Outlet />}
    </>
  );
}
