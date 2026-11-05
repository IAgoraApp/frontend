import { useLayoutEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import CasaNavigation from './components/casaNavigation';

export default function CasaLayout() {
  const { pathname } = useLocation();
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  return (
    <>
      <CasaNavigation />
      <Outlet />
    </>
  );
}
