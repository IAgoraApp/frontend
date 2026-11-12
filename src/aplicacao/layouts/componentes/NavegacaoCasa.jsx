import { useEffect, useRef } from 'react';
import { House, Sparkles, Utensils } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Container } from '../../../compartilhado/indice';

const areas = [
  {
    caminho: '/casa',
    rotulo: 'Casa',
    icone: House,
    inicial: 'hub',
    links: [
      ['hub', 'Visão geral'],
      ['residencia', 'Minha residência'],
      ['manutencoes', 'Manutenções'],
      ['despesas', 'Despesas'],
      ['servicos', 'Encontrar ajuda'],
    ],
  },
  {
    caminho: '/limpeza',
    rotulo: 'Limpeza',
    icone: Sparkles,
    inicial: 'inicio',
    links: [
      ['inicio', 'Visão geral'],
      ['biblioteca', 'Guias por cômodo'],
      ['checklist', 'Meu checklist'],
      ['materiais', 'Materiais'],
    ],
  },
  {
    caminho: '/cozinha',
    rotulo: 'Cozinha',
    icone: Utensils,
    inicial: 'inicio',
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

export default function NavegacaoCasa() {
  const { pathname, search } = useLocation();
  const area = areas.find(item => item.caminho === pathname) ?? areas[0];
  const parametros = new URLSearchParams(search);
  const solicitada = parametros.get('visao');
  let atual = area.links.some(([chave]) => chave === solicitada)
    ? solicitada
    : area.inicial;
  if (pathname === '/casa' && ['editar', 'cadastrar'].includes(solicitada)) {
    atual = 'residencia';
  }
  if (pathname === '/casa' && solicitada === 'historico') {
    atual = 'manutencoes';
  }
  if (pathname === '/limpeza' && parametros.has('guia')) {
    atual = 'biblioteca';
  }
  if (pathname === '/cozinha' && parametros.has('receita')) {
    atual = 'buscar';
  }

  const referenciaLista = useRef(null);

  useEffect(() => {
    const lista = referenciaLista.current;
    const ativo = lista?.querySelector('[aria-current="page"]');
    if (!ativo) return;
    const item = ativo.getBoundingClientRect();
    const areaVisivel = lista.getBoundingClientRect();
    if (item.left < areaVisivel.left) {
      lista.scrollBy({
        left: item.left - areaVisivel.left - 8,
        behavior: 'instant',
      });
    } else if (item.right > areaVisivel.right) {
      lista.scrollBy({
        left: item.right - areaVisivel.right + 8,
        behavior: 'instant',
      });
    }
  }, [pathname, search]);

  return (
    <div className='sticky top-0 z-30 min-w-0 border-y border-[#e6edf2] bg-white font-corpo text-(--azul-titulo) shadow-[0_2px_6px_-4px_rgba(16,42,67,0.15)] [&_a:focus-visible]:outline-2 [&_a:focus-visible]:-outline-offset-3 [&_a:focus-visible]:outline-(--laranja-principal)'>
      <Container>
        <div className='flex min-w-0 flex-col sm:flex-row sm:items-center sm:gap-6'>
          <p className='hidden shrink-0 text-xs font-bold tracking-wider text-(--texto-apoio) lg:block'>
            CUIDE DO SEU CANTO
          </p>
          <nav
            aria-label='Casa, limpeza e cozinha'
            className='grid w-full grid-cols-3 gap-1 py-2 sm:max-w-md sm:gap-2'
          >
            {areas.map(({ caminho, rotulo, icone: Icone }) => (
              <Link
                key={caminho}
                to={caminho}
                aria-current={pathname === caminho ? 'location' : undefined}
                className={
                  'flex min-h-12 min-w-0 items-center justify-center gap-1.5 rounded-lg px-2 text-sm font-bold transition-colors sm:gap-2 sm:px-4 ' +
                  (pathname === caminho
                    ? 'bg-(--laranja-fundo) text-(--laranja-principal)'
                    : 'text-(--texto-apoio) hover:bg-(--azul-fundo) hover:text-(--azul-titulo)')
                }
              >
                <Icone size={18} aria-hidden='true' className='shrink-0' />
                <span>{rotulo}</span>
              </Link>
            ))}
          </nav>
        </div>

        <nav
          ref={referenciaLista}
          aria-label={'Navegação de ' + area.rotulo}
          className='relative flex min-h-12 min-w-0 gap-5 overflow-x-auto overscroll-x-contain border-t border-[#eef2f5] text-sm sm:gap-7'
        >
          {area.links.map(([chave, rotulo]) => (
            <Link
              key={chave}
              to={area.caminho + (chave === area.inicial ? '' : '?visao=' + chave)}
              preventScrollReset
              aria-current={atual === chave ? 'page' : undefined}
              className={
                'flex min-h-12 shrink-0 items-center border-b-[3px] px-1 py-3 ' +
                (atual === chave
                  ? 'border-(--laranja-principal) font-bold text-(--laranja-principal)'
                  : 'border-transparent text-(--texto-apoio) hover:text-(--laranja-principal)')
              }
            >
              {rotulo}
            </Link>
          ))}
        </nav>
      </Container>
    </div>
  );
}
