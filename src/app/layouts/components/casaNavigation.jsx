import { House, Sparkles, Utensils } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import '../../../shared/ui/mvp.css';
const areas = [
  {
    rota: '/casa',
    nome: 'Minha casa',
    Icone: House,
    links: [],
  },
  {
    rota: '/limpeza',
    nome: 'Limpeza',
    Icone: Sparkles,
    inicial: 'inicio',
    links: [
      ['inicio', 'Atividades'],
      ['historico', 'Histórico de limpeza'],
    ],
  },
  {
    rota: '/cozinha',
    nome: 'Cozinha',
    Icone: Utensils,
    inicial: 'inicio',
    links: [
      ['inicio', 'Catálogo de receitas'],
      ['minhas', 'Minhas receitas'],
      ['despensa', 'Minha despensa'],
      ['compras', 'Lista de compras'],
    ],
  },
];
export default function NavegacaoCasa() {
  const { pathname, search } = useLocation();
  const visaoAtual = new URLSearchParams(search).get('visao');
  const visao =
    pathname === '/cozinha' && ['plano', 'favoritas'].includes(visaoAtual)
      ? 'minhas'
      : visaoAtual;
  return (
    <MenuLateralCasa
      titulo='Seu canto'
      IconeTitulo={House}
      rotulo='Navegação da casa'
      secoes={areas}
      pathname={pathname}
      visao={visao}
    />
  );
}

export function MenuLateralCasa({
  titulo,
  IconeTitulo,
  rotulo,
  secoes,
  pathname,
  visao,
}) {
  const referencia = useRef(null);
  useEffect(() => {
    if (window.matchMedia('(max-width: 767px)').matches)
      referencia.current
        ?.querySelector('[aria-current="page"]')
        ?.scrollIntoView({
          block: 'nearest',
          inline: 'center',
          behavior: 'instant',
        });
  }, [pathname, visao]);

  return (
    <aside className='casa-menu'>
      <p className='casa-menu-titulo'>
        <IconeTitulo size={22} aria-hidden='true' />
        {titulo}
      </p>
      <nav ref={referencia} aria-label={rotulo}>
        {secoes.map(({ rota, nome, Icone, inicial, links }) => (
          <section key={nome}>
            {links.length === 0 ? (
              <Link
                className='casa-menu-principal'
                to={rota}
                aria-current={
                  pathname === rota && (!inicial || !visao || visao === inicial)
                    ? 'page'
                    : undefined
                }
              >
                <Icone size={16} aria-hidden='true' />
                {nome}
              </Link>
            ) : (
              <h2>
                <Icone size={16} aria-hidden='true' /> {nome}
              </h2>
            )}
            <div>
              {links.map(([id, rotuloLink]) => (
                <Link
                  key={id}
                  to={`${rota}?visao=${id}`}
                  aria-current={
                    pathname === rota && (visao || inicial) === id
                      ? 'page'
                      : undefined
                  }
                >
                  {rotuloLink}
                </Link>
              ))}
            </div>
          </section>
        ))}
      </nav>
    </aside>
  );
}
