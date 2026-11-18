import { useLayoutEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import NavegacaoCasa from './components/casaNavigation';
import './casaLayout.css';

export default function LayoutCasa({
  navegacao = <NavegacaoCasa />,
  secao,
  areaCasa = false,
  children,
}) {
  const { pathname } = useLocation();
  const conteudo = useRef(null);
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    conteudo.current?.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname, secao]);

  return (
    <div
      className={`casa-shell layout-menu-lateral${areaCasa ? ' casa-shell-area' : ''}`}
    >
      {navegacao}
      <div className='casa-conteudo' ref={conteudo}>
        {children ?? <Outlet />}
      </div>
    </div>
  );
}
