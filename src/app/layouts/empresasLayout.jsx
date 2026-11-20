import { useLayoutEffect, useRef } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { acessoLocal } from '../dados/acessoLocal';
import { lerSessao } from '../dados/contaApi';
import ProvedorAvisosPerfilA from '../avisos/provedorAvisosPerfilA';
import LayoutAplicacao from './appLayout';
import { Rodape } from '../../shared/index';
import './empresasLayout.css';

export default function LayoutEmpresas(propriedades) {
  const { pathname, search } = useLocation();
  const conteudo = useRef(null);

  useLayoutEffect(() => {
    conteudo.current?.scrollTo({ top: 0 });
  }, [pathname, search]);
  if (!acessoLocal && lerSessao()?.tipo !== 2)
    return <Navigate to='/perfil' replace />;

  return (
    <ProvedorAvisosPerfilA>
      <LayoutAplicacao
        {...propriedades}
        classe='empresa-aplicacao'
        varianteCabecalho='empresas'
      >
        <div
          ref={conteudo}
          className='empresa-aplicacao-conteudo'
          role='region'
          aria-label='Conteúdo da área profissional'
          tabIndex={0}
        >
          <Outlet />
        </div>
        <Rodape variante='compacto' />
      </LayoutAplicacao>
    </ProvedorAvisosPerfilA>
  );
}
