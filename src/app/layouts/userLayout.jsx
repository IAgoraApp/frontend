import { Outlet } from 'react-router-dom';
import { Header } from '../../shared';

export default function UserLayout({ children }) {
  return (
    <>
      <Header variant='user' />
      {children || <Outlet />}
    </>
  );
}
