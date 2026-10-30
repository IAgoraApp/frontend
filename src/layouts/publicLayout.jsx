import { Outlet } from 'react-router-dom';
import Header from '../components/shared/header';

export default function PublicLayout({ children }) {
  return (
    <>
      <Header variant='public' />
      {children || <Outlet />}
    </>
  );
}
