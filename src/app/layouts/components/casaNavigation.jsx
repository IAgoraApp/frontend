import { House, Sparkles, Utensils } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import '../../../shared/ui/mvp.css';
const areas = [
  {
    rota: '/casa',
    nome: 'Minha casa',
    Icone: House,
    inicial: 'hub',
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
      ['inicio', 'Receitas'],
      ['favoritas', 'Receitas favoritas'],
      ['despensa', 'Minha despensa'],
      ['compras', 'Lista de compras'],
    ],
  },
];
export default function NavegacaoCasa() {
  const { pathname, search } = useLocation();
  const visao = new URLSearchParams(search).get('visao');
  const referencia = useRef(null);
  useEffect(() => {
    if (window.matchMedia('(max-width: 600px)').matches)
      referencia.current
        ?.querySelector('[aria-current="page"]')
        ?.scrollIntoView({
          block: 'nearest',
          inline: 'center',
          behavior: 'instant',
        });
  }, [pathname, search]);
  return (
    <aside className='casa-menu'>
      <p className='casa-menu-titulo'>
        <House size={22} />
        Seu canto
      </p>
      <nav ref={referencia} aria-label='Navegação da casa'>
        {areas.map(({ rota, nome, Icone, inicial, links }) => (
          <section key={rota}>
            {links.length === 0 ? (
              <Link
                className='casa-menu-principal'
                to={rota}
                aria-current={pathname === rota ? 'page' : undefined}
              >
                <Icone size={16} />
                {nome}
              </Link>
            ) : (
              <h2>
                <Icone size={16} />
                {nome}
              </h2>
            )}
            <div>
              {links.map(([id, rotulo]) => (
                <Link
                  key={id}
                  to={`${rota}?visao=${id}`}
                  aria-current={
                    pathname === rota && (visao || inicial) === id
                      ? 'page'
                      : undefined
                  }
                >
                  {rotulo}
                </Link>
              ))}
            </div>
          </section>
        ))}
      </nav>
    </aside>
  );
}
