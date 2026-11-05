import { Link, useLocation } from 'react-router-dom';
import { Container } from '../../../shared/ui';

const links = [
  ['/empresa', 'Visão geral'],
  ['/dashboard', 'Desempenho'],
  ['/meus-servicos', 'Meus anúncios'],
  ['/perfil-empresa', 'Perfil da empresa'],
  ['/contatos', 'Contatos'],
  ['/empresa/marketplace', 'Marketplace'],
];
export default function EmpresaNavigation() {
  const { pathname } = useLocation();
  return (
    <div className='sticky top-0 z-30 min-w-0 border-y border-[#e6edf2] bg-white'>
      <Container>
        <nav
          aria-label='Área da empresa'
          className='flex min-h-14 gap-6 overflow-x-auto text-sm'
        >
          {links.map(([to, label]) => {
            const active =
              pathname === to ||
              (to === '/meus-servicos' &&
                (pathname.startsWith('/meus-servicos/') ||
                  pathname === '/anunciar-servico')) ||
              (to === '/contatos' && pathname.startsWith('/contatos/'));
            return (
              <Link
                key={to}
                to={to}
                aria-current={active ? 'page' : undefined}
                preventScrollReset
                className={
                  'flex min-h-14 shrink-0 items-center border-b-[3px] px-1 py-4 focus-visible:outline-2 focus-visible:-outline-offset-3 focus-visible:outline-(--laranja-principal) ' +
                  (active
                    ? 'border-(--laranja-principal) font-bold text-(--laranja-principal)'
                    : 'border-transparent text-(--texto-apoio) hover:text-(--laranja-principal)')
                }
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </Container>
    </div>
  );
}
