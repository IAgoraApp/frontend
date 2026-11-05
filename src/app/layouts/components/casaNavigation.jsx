import { useEffect, useRef } from 'react';
import { House, Sparkles, Utensils } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Container } from '../../../shared/ui';

const areas = [
  {
    path: '/casa',
    label: 'Casa',
    icon: House,
    initial: 'hub',
    links: [
      ['hub', 'Visão geral'],
      ['residencia', 'Minha residência'],
      ['manutencoes', 'Manutenções'],
      ['despesas', 'Despesas'],
      ['servicos', 'Encontrar ajuda'],
    ],
  },
  {
    path: '/limpeza',
    label: 'Limpeza',
    icon: Sparkles,
    initial: 'inicio',
    links: [
      ['inicio', 'Visão geral'],
      ['biblioteca', 'Guias por cômodo'],
      ['checklist', 'Meu checklist'],
      ['materiais', 'Materiais'],
    ],
  },
  {
    path: '/cozinha',
    label: 'Cozinha',
    icon: Utensils,
    initial: 'inicio',
    links: [
      ['inicio', 'Visão geral'],
      ['buscar', 'Receitas'],
      ['despensa', 'Minha despensa'],
      ['plano', 'Plano semanal'],
      ['compras', 'Lista de compras'],
      ['favoritas', 'Favoritas'],
      ['basico', 'Aprender o básico'],
    ],
  },
];

export default function CasaNavigation() {
  const { pathname, search } = useLocation();
  const area = areas.find(item => item.path === pathname) ?? areas[0];
  const params = new URLSearchParams(search);
  const requested = params.get('visao');
  let current = area.links.some(([key]) => key === requested)
    ? requested
    : area.initial;
  if (pathname === '/casa' && ['editar', 'cadastrar'].includes(requested))
    current = 'residencia';
  if (pathname === '/casa' && requested === 'historico')
    current = 'manutencoes';
  if (pathname === '/limpeza' && params.has('guia')) current = 'biblioteca';
  if (pathname === '/cozinha' && params.has('receita')) current = 'buscar';
  const ref = useRef(null);

  useEffect(() => {
    const list = ref.current;
    const active = list?.querySelector('[aria-current="page"]');
    if (!active) return;
    const item = active.getBoundingClientRect();
    const viewport = list.getBoundingClientRect();
    // Reveal the active item horizontally without moving the page vertically.
    if (item.left < viewport.left)
      list.scrollBy({
        left: item.left - viewport.left - 8,
        behavior: 'instant',
      });
    else if (item.right > viewport.right)
      list.scrollBy({
        left: item.right - viewport.right + 8,
        behavior: 'instant',
      });
  }, [pathname, search]);

  return (
    <div className='sticky top-0 z-30 min-w-0 border-y border-[#e6edf2] bg-white font-body text-(--azul-titulo) shadow-[0_2px_6px_-4px_rgba(16,42,67,0.15)] [&_a:focus-visible]:outline-2 [&_a:focus-visible]:-outline-offset-3 [&_a:focus-visible]:outline-(--laranja-principal)'>
      <Container>
        <div className='flex min-w-0 flex-col sm:flex-row sm:items-center sm:gap-6'>
          <p className='hidden shrink-0 text-xs font-bold tracking-wider text-(--texto-apoio) lg:block'>
            CUIDE DO SEU CANTO
          </p>
          <nav
            aria-label='Casa, limpeza e cozinha'
            className='grid w-full grid-cols-3 gap-1 py-2 sm:max-w-md sm:gap-2'
          >
            {areas.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                aria-current={pathname === path ? 'location' : undefined}
                className={
                  'flex min-h-12 min-w-0 items-center justify-center gap-1.5 rounded-lg px-2 text-sm font-bold transition-colors sm:gap-2 sm:px-4 ' +
                  (pathname === path
                    ? 'bg-(--laranja-fundo) text-(--laranja-principal)'
                    : 'text-(--texto-apoio) hover:bg-(--azul-fundo) hover:text-(--azul-titulo)')
                }
              >
                <Icon size={18} aria-hidden='true' className='shrink-0' />
                <span>{label}</span>
              </Link>
            ))}
          </nav>
        </div>
        <nav
          ref={ref}
          aria-label={'Navegação de ' + area.label}
          className='relative flex min-h-12 min-w-0 gap-5 overflow-x-auto overscroll-x-contain border-t border-[#eef2f5] text-sm sm:gap-7'
        >
          {area.links.map(([key, label]) => (
            <Link
              key={key}
              to={area.path + (key === area.initial ? '' : '?visao=' + key)}
              preventScrollReset
              aria-current={current === key ? 'page' : undefined}
              className={
                'flex min-h-12 shrink-0 items-center border-b-[3px] px-1 py-3 ' +
                (current === key
                  ? 'border-(--laranja-principal) font-bold text-(--laranja-principal)'
                  : 'border-transparent text-(--texto-apoio) hover:text-(--laranja-principal)')
              }
            >
              {label}
            </Link>
          ))}
        </nav>
      </Container>
    </div>
  );
}
