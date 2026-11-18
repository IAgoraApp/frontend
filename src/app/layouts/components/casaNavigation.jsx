import { Archive, House, Sparkles, Utensils } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useEffect, useId, useRef } from 'react';
import BotaoMenuLateral from './botaoMenuLateral';
import useMenuLateral from './useMenuLateral';
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
    ],
  },
  {
    rota: '/despensa',
    nome: 'Minha despensa',
    Icone: Archive,
    principal: true,
    links: [['compras', 'Lista de compras', '/cozinha']],
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
  const idMenu = useId();
  const { automatico, recolhido, setRecolhidoManual, interacoes } =
    useMenuLateral();
  useEffect(() => {
    if (window.matchMedia('(max-width: 767px)').matches)
      referencia.current
        ?.querySelector(
          recolhido
            ? '.casa-menu-grupo[data-ativo="true"], .casa-menu-principal:not(.casa-menu-link-grupo)[aria-current="page"]'
            : '[aria-current="page"]'
        )
        ?.scrollIntoView({
          block: 'nearest',
          inline: 'center',
          behavior: 'instant',
        });
  }, [pathname, visao, recolhido]);

  return (
    <aside
      className='casa-menu'
      data-menu-recolhido={recolhido}
      {...interacoes}
    >
      <div className='casa-menu-topo'>
        <p className='casa-menu-titulo menu-lateral-rotulo'>
          <IconeTitulo size={22} aria-hidden='true' />
          {titulo}
        </p>
        {!automatico && (
          <BotaoMenuLateral
            expandido={!recolhido}
            aoAlternar={() => setRecolhidoManual(valor => !valor)}
            controla={idMenu}
          />
        )}
      </div>
      <nav id={idMenu} ref={referencia} aria-label={rotulo}>
        {secoes.map(({ rota, nome, Icone, inicial, principal, links }) => {
          const linkAtivo = ([id, , destino = rota]) =>
            pathname === destino && (visao || inicial || null) === id;

          const principalAtivo =
            pathname === rota && (!inicial || !visao || visao === inicial);

          const grupoAtivo =
            (principal && principalAtivo) || links.some(linkAtivo);

          return (
            <section key={nome}>
              {(principal || !links.length) && (
                <Link
                  className={`casa-menu-principal${principal ? ' casa-menu-link-grupo menu-lateral-detalhe' : ''}`}
                  inert={principal && recolhido ? true : undefined}
                  to={rota}
                  aria-label={nome}
                  title={recolhido ? nome : undefined}
                  aria-current={principalAtivo ? 'page' : undefined}
                >
                  <Icone size={16} aria-hidden='true' />
                  <span className='menu-lateral-rotulo'>{nome}</span>
                </Link>
              )}
              {links.length > 0 && (
                <>
                  {!principal && (
                    <h2 className='menu-lateral-detalhe'>
                      <Icone size={16} aria-hidden='true' />
                      <span className='menu-lateral-rotulo'>{nome}</span>
                    </h2>
                  )}
                  {automatico ? (
                    <span
                      className='casa-menu-grupo'
                      data-ativo={grupoAtivo}
                      aria-hidden='true'
                    >
                      <Icone size={16} />
                    </span>
                  ) : (
                    <button
                      type='button'
                      className='casa-menu-grupo'
                      aria-label={nome}
                      title={nome}
                      aria-controls={idMenu}
                      data-ativo={grupoAtivo}
                      onClick={evento => {
                        const grupo = evento.currentTarget.closest('section');
                        setRecolhidoManual(false);
                        requestAnimationFrame(() => {
                          const link = grupo.querySelector('a');
                          const ativo = grupo.querySelector(
                            '[aria-current="page"]'
                          );
                          (ativo ?? link)?.focus();
                        });
                      }}
                    >
                      <Icone size={16} aria-hidden='true' />
                    </button>
                  )}
                  <div
                    className='casa-menu-links menu-lateral-detalhe'
                    inert={recolhido}
                  >
                    {links.map(link => {
                      const [id, rotuloLink, destino = rota] = link;
                      return (
                        <Link
                          key={rotuloLink}
                          to={`${destino}?visao=${id}`}
                          aria-current={linkAtivo(link) ? 'page' : undefined}
                        >
                          {rotuloLink}
                        </Link>
                      );
                    })}
                  </div>
                </>
              )}
            </section>
          );
        })}
      </nav>
    </aside>
  );
}
