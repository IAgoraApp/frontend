import { useLayoutEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import NavegacaoCasa from './components/casaNavigation';
import './casaLayout.css';

export default function LayoutCasa() {
  const { pathname } = useLocation();
  const conteudo = useRef(null);
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    conteudo.current?.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return (
    <div className='casa-shell'>
      <NavegacaoCasa />
      <div className='casa-conteudo' ref={conteudo}>
        <Outlet />
      </div>
    </div>
  );
}
