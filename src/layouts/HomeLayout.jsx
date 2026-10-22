import { Outlet } from 'react-router-dom';
import Header from '../components/header';

export default function HomeLayout({ children }) {
  return (
    <>
      <Header variant='home' />
      {children || <Outlet />}
    </>
  );
}
