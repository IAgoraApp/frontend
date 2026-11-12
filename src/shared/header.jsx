import { useEffect, useId, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import logoLaranja from './assets/logoLaranja.png';
import { Botao } from './ui/index';
import {
  variantesCabecalho,
  variantesCabecalhoUsuario,
} from './headerConfig';

export default function Cabecalho({
  variante = 'usuario',
  tipoUsuario = 'consumidorA',
  classe = '',
  classeBorda = '',
}) {
  const localizacao = useLocation();
  const referenciaCabecalho = useRef(null);
  const referenciaBotao = useRef(null);
  const idMenu = useId();
  const chaveNavegacao = `${variante}:${tipoUsuario}:${localizacao.key}`;
  const [abertoEm, setAbertoEm] = useState(null);
  const menuAberto = abertoEm === chaveNavegacao;
  const fecharMenu = () => setAbertoEm(null);

  useEffect(() => {
    if (!menuAberto) return;
    const aoClicarFora = evento => {
      if (!referenciaCabecalho.current?.contains(evento.target)) {
        setAbertoEm(null);
      }
    };
    document.addEventListener('pointerdown', aoClicarFora);
    return () => document.removeEventListener('pointerdown', aoClicarFora);
  }, [menuAberto]);

  const { rotaLogo, linksNavegacao, botaoAcao } =
    variante === 'usuario'
      ? (variantesCabecalhoUsuario[tipoUsuario] ??
        variantesCabecalhoUsuario.consumidorA)
      : (variantesCabecalho[variante] ?? variantesCabecalho.publico);

  const ehRotaAtiva = rota => {
    const caminho = localizacao.pathname;
    if (caminho === rota) return true;
    if (rota === '/sobrenos' && caminho === '/sobre-nos') {
      return true;
    }
    if (rota === '/casa' && ['/limpeza', '/cozinha'].includes(caminho)) {
      return true;
    }
    if (rota === '/financas' && caminho.startsWith('/calculadoras')) {
      return true;
    }
    if (
      rota === '/marketplace' &&
      (caminho.startsWith('/empresas/') ||
        caminho.startsWith('/servicos/') ||
        caminho.startsWith('/buscar') ||
        caminho.startsWith('/categoria') ||
        caminho === '/favoritos' ||
        caminho.startsWith('/meus-contatos'))
    ) {
      return true;
    }
    if (
      rota === '/empresa/dashboard' &&
      (caminho === '/dashboard' || caminho.startsWith('/empresa/dashboard'))
    ) {
      return true;
    }
    if (
      rota === '/empresa/anuncios' &&
      (caminho.startsWith('/empresa/anuncios') ||
        caminho.startsWith('/meus-servicos') ||
        caminho === '/empresa/anunciar' ||
        caminho === '/anunciar-servico')
    ) {
      return true;
    }
    if (
      rota === '/empresa/perfil' &&
      (caminho.startsWith('/empresa/perfil') ||
        caminho.startsWith('/perfil-empresa'))
    ) {
      return true;
    }
    if (
      rota === '/empresa/contatos' &&
      (caminho.startsWith('/empresa/contatos') ||
        caminho.startsWith('/contatos'))
    ) {
      return true;
    }
    if (
      rota === '/empresa/marketplace' &&
      caminho.startsWith('/empresa/marketplace')
    ) {
      return true;
    }
    if (rota === '/planejamento' && caminho.startsWith('/planejamento')) {
      return true;
    }
    if (rota === '/minhajornada' && caminho.startsWith('/minhajornada')) {
      return true;
    }
    if (rota === '/aprendendo' && caminho.startsWith('/aprendendo')) {
      return true;
    }
    if (rota === '/encontrar-casa' && caminho.startsWith('/encontrar-casa')) {
      return true;
    }
    return false;
  };

  const renderizarLinks = (movel = false) =>
    linksNavegacao.map(item => (
      <Link
        key={item.rota}
        to={item.rota}
        aria-current={ehRotaAtiva(item.rota) ? 'page' : undefined}
        onClick={fecharMenu}
        className={`text-sm font-bold transition-colors hover:text-(--laranja-principal) sm:text-[15px] ${
          ehRotaAtiva(item.rota)
            ? 'text-(--laranja-principal)'
            : 'text-(--azul-titulo)'
        } ${
          movel
            ? 'flex min-h-11 items-center rounded-lg p-3 hover:bg-(--azul-fundo)'
            : 'whitespace-nowrap'
        }`}
      >
        {item.nome}
      </Link>
    ));

  const renderizarAcao = () =>
    botaoAcao && (
      <Botao
        como={Link}
        to={botaoAcao.rota}
        cor={botaoAcao.cor || 'laranja'}
        onClick={fecharMenu}
        classe='px-6! min-h-[46px]! text-[15px]!'
      >
        {botaoAcao.rotulo}
      </Botao>
    );

  return (
    <header
      ref={referenciaCabecalho}
      className={`@container/cabecalho relative border-b border-[#eef2f5] bg-white px-(--margem-pagina) [&_:is(a,button):focus-visible]:outline-2 [&_:is(a,button):focus-visible]:outline-offset-3 [&_:is(a,button):focus-visible]:outline-(--laranja-principal) ${classeBorda} ${classe}`}
      onKeyDown={evento => {
        if (evento.key === 'Escape' && menuAberto) {
          fecharMenu();
          referenciaBotao.current?.focus();
        }
      }}
      onBlur={evento => {
        if (!evento.currentTarget.contains(evento.relatedTarget)) {
          fecharMenu();
        }
      }}
    >
      <div className='mx-auto flex max-w-[1440px] min-w-0 items-center justify-between gap-[clamp(1rem,2cqw,2rem)] py-4 @min-[58rem]/cabecalho:py-5'>
        <Link
          className='min-w-0 @min-[58rem]/cabecalho:shrink-0'
          to={rotaLogo}
          aria-label='Página inicial Iagora'
          onClick={fecharMenu}
        >
          <img
            className='block h-[42px] w-[126px] object-contain sm:h-[46px]'
            src={logoLaranja}
            alt='IAgora'
          />
        </Link>

        <nav
          aria-label='Navegação principal'
          className='hidden min-w-0 flex-1 items-center justify-center gap-[clamp(1rem,3cqw,2.25rem)] @min-[58rem]/cabecalho:flex'
        >
          {renderizarLinks()}
        </nav>

        <div className='flex shrink-0 items-center gap-3'>
          {botaoAcao && (
            <div className='hidden whitespace-nowrap @min-[30rem]/cabecalho:block'>
              {renderizarAcao()}
            </div>
          )}
          <button
            ref={referenciaBotao}
            type='button'
            className='grid size-11 shrink-0 cursor-pointer place-items-center rounded-lg text-(--azul-titulo) hover:bg-(--azul-fundo) @min-[58rem]/cabecalho:hidden'
            aria-label={menuAberto ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={menuAberto}
            aria-controls={idMenu}
            onClick={() => setAbertoEm(menuAberto ? null : chaveNavegacao)}
          >
            {menuAberto ? <X aria-hidden='true' /> : <Menu aria-hidden='true' />}
          </button>
        </div>
      </div>

      <nav
        id={idMenu}
        aria-label='Navegação principal móvel'
        className='absolute inset-x-(--margem-pagina) top-full z-40 flex max-h-[70dvh] flex-col gap-1 overflow-y-auto overscroll-contain rounded-xl border border-[#dbe5ed] bg-white p-3 shadow-[0_12px_32px_#102d491a] @min-[58rem]/cabecalho:hidden [&[hidden]]:hidden'
        hidden={!menuAberto}
      >
        {renderizarLinks(true)}
        {botaoAcao && (
          <div className='pt-2 [&>a]:w-full [&>a]:text-center @min-[30rem]/cabecalho:hidden'>
            {renderizarAcao()}
          </div>
        )}
      </nav>
    </header>
  );
}
