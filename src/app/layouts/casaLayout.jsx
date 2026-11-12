import { useLayoutEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import NavegacaoCasa from './components/casaNavigation';

export default function LayoutCasa() {
  const { pathname } = useLocation();
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return (
    <>
      <NavegacaoCasa />
      <Outlet />
    </>
  );
}
