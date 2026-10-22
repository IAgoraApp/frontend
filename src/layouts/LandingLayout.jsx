import { Outlet } from 'react-router-dom';
import Header from '../components/header';

export default function LandingLayout({ children }) {
  return (
    <>
      <Header variant='landing' />
      {children || <Outlet />}
    </>
  );
}
