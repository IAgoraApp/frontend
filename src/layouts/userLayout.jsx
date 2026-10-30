import { Outlet } from 'react-router-dom';
import Header from '../components/shared/header';

export default function UserLayout({ children }) {
  return (
    <>
      <Header variant='user' />
      {children || <Outlet />}
    </>
  );
}
