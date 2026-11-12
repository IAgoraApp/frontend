import { useLayoutEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Cabecalho } from '../../compartilhado/indice';

export default function LayoutAplicacao({
  varianteCabecalho,
  children,
  classe = '',
  propriedadesCabecalho,
}) {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return (
    <div
      className={`flex min-h-dvh min-w-0 flex-col bg-white ${classe}`}
      data-layout-aplicacao='ativo'
    >
      <Cabecalho {...propriedadesCabecalho} variante={varianteCabecalho} />
      {children ?? <Outlet />}
    </div>
  );
}
