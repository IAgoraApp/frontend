import { Outlet } from 'react-router-dom';
import Header from '../components/header';

export default function DashboardLayout({ children }) {
  return (
    <>
      <Header variant='dashboard' />
      {children || <Outlet />}
    </>
  );
}
