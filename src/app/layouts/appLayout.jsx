import { useLayoutEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Cabecalho } from '../../shared/index';
import { HoverMenuLateral } from './components/useMenuLateral';

export default function LayoutAplicacao({
  varianteCabecalho,
  children,
  classe = '',
  propriedadesCabecalho,
  referencia,
}) {
  const hoverMenu = useState(false);
  const [sobreMenu, setSobreMenu] = hoverMenu;
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return (
    <div
      ref={referencia}
      className={`flex min-h-dvh min-w-0 flex-col bg-white ${classe}`}
      data-layout-aplicacao='ativo'
      onPointerMove={evento => {
        if (
          sobreMenu &&
          evento.pointerType === 'mouse' &&
          !(
            evento.target instanceof Element &&
            evento.target.closest('.casa-menu')
          )
        )
          setSobreMenu(false);
      }}
      onPointerLeave={() => setSobreMenu(false)}
    >
      <Cabecalho {...propriedadesCabecalho} variante={varianteCabecalho} />
      <HoverMenuLateral.Provider value={hoverMenu}>
        {children ?? <Outlet />}
      </HoverMenuLateral.Provider>
    </div>
  );
}
