import { BookOpen, ClipboardList, House } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import LayoutCasa from '../../app/layouts/casaLayout';
import { MenuLateralCasa } from '../../app/layouts/components/casaNavigation';
import { Container, Titulo } from '../../shared/ui';

const secoes = [
  {
    rota: '/minhajornada',
    nome: 'Minha jornada',
    Icone: ClipboardList,
    links: [],
  },
  {
    rota: '/encontrar-casa',
    nome: 'Imóveis desejados',
    Icone: House,
    links: [],
  },
  {
    rota: '/aprendendo',
    nome: 'Aprendendo a morar',
    Icone: BookOpen,
    links: [],
  },
];

export const painel =
  'min-w-0 rounded-xl border border-(--borda-suave) bg-white p-4 sm:p-5';
export const campo =
  'w-full min-w-0 rounded-lg border border-(--borda-suave) bg-white px-3 py-2 font-normal';

export default function LayoutPreparacao({
  titulo,
  descricao,
  chaveSecao,
  acao,
  children,
}) {
  const { pathname, search } = useLocation();
  return (
    <LayoutCasa
      secao={chaveSecao ?? search}
      navegacao={
        <MenuLateralCasa
          titulo='Minha mudança'
          IconeTitulo={House}
          rotulo='Navegação de preparação'
          secoes={secoes}
          pathname={pathname}
        />
      }
    >
      <main className='min-h-full min-w-0 bg-(--azul-fundo) text-(--azul-titulo) wrap-anywhere [&_:is(a,button,input,select,textarea):focus-visible]:outline-2 [&_:is(a,button,input,select,textarea):focus-visible]:outline-offset-3 [&_:is(a,button,input,select,textarea):focus-visible]:outline-(--laranja-principal)'>
        <Container classe='casa-pagina-conteudo space-y-4'>
          {(titulo || descricao || acao) && (
            <header
              className={
                acao
                  ? 'flex flex-wrap items-center justify-between gap-3'
                  : undefined
              }
            >
              <div>
                <Titulo
                  como='h1'
                  classe='text-3xl leading-tight font-bold sm:text-4xl'
                >
                  {titulo}
                </Titulo>
                {descricao && (
                  <p className='mt-2 text-(--texto-apoio)'>{descricao}</p>
                )}
              </div>
              {acao}
            </header>
          )}
          {children}
        </Container>
      </main>
    </LayoutCasa>
  );
}
