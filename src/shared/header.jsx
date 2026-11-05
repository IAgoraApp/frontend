import { useEffect, useId, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import Logo from './assets/logoLaranja.png';
import { Button } from './ui/index';
import { headerVariants, userHeaderVariants } from './headerConfig';

export default function Header({
  variant = 'user',
  userType = 'userA',
  className = '',
  borderClass = '',
}) {
  const location = useLocation();
  const headerRef = useRef(null);
  const toggleRef = useRef(null);
  const menuId = useId();
  const navigationKey = `${variant}:${userType}:${location.key}`;
  const [openAt, setOpenAt] = useState(null);
  const menuOpen = openAt === navigationKey;
  const closeMenu = () => setOpenAt(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onPointerDown = event => {
      if (!headerRef.current?.contains(event.target)) setOpenAt(null);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [menuOpen]);

  const {
    logoLink,
    navLinks,
    actionButton: button,
  } = variant === 'user'
    ? (userHeaderVariants[userType] ?? userHeaderVariants.userA)
    : (headerVariants[variant] ?? headerVariants.public);
  const isLinkActive = route => location.pathname === route;
  const renderLinks = (mobile = false) =>
    navLinks.map(item => (
      <Link
        key={item.rota}
        to={item.rota}
        aria-current={isLinkActive(item.rota) ? 'page' : undefined}
        onClick={closeMenu}
        className={`font-semibold transition-colors hover:text-(--laranja-principal) ${isLinkActive(item.rota) ? 'text-(--laranja-principal)' : ''} ${mobile ? 'flex min-h-11 items-center rounded-lg p-3 wrap-anywhere hover:bg-(--azul-fundo)' : 'whitespace-nowrap'}`}
      >
        {item.nome}
      </Link>
    ));
  const renderAction = () =>
    button && (
      <Button
        as={Link}
        to={button.rota}
        color={button.color || 'laranja'}
        onClick={closeMenu}
      >
        {button.label}
      </Button>
    );

  return (
    <header
      ref={headerRef}
      className={`@container/header relative mx-(--page-gutter) [&_:is(a,button):focus-visible]:outline-2 [&_:is(a,button):focus-visible]:outline-offset-3 [&_:is(a,button):focus-visible]:outline-(--laranja-principal) ${borderClass} ${className}`}
      onKeyDown={event => {
        if (event.key === 'Escape' && menuOpen) {
          closeMenu();
          toggleRef.current?.focus();
        }
      }}
      onBlur={event => {
        if (!event.currentTarget.contains(event.relatedTarget)) closeMenu();
      }}
    >
      <div className='flex min-w-0 items-center justify-between gap-[clamp(1rem,2cqw,2rem)] py-4 @min-[55rem]/header:py-5'>
        <Link
          className='min-w-0 @min-[55rem]/header:shrink-0'
          to={logoLink}
          aria-label='Página inicial Iagora'
          onClick={closeMenu}
        >
          <img
            className='block h-auto w-[min(8rem,42cqw)] max-w-full @min-[30rem]/header:w-40'
            src={Logo}
            alt='IAgora'
          />
        </Link>
        <nav
          aria-label='Navegação principal'
          className='hidden min-w-0 flex-1 items-center justify-center gap-[clamp(1rem,3.5cqw,2.5rem)] @min-[55rem]/header:flex'
        >
          {renderLinks()}
        </nav>
        <div className='flex shrink-0 items-center gap-3'>
          {button && (
            <div className='hidden whitespace-nowrap @min-[30rem]/header:block'>
              {renderAction()}
            </div>
          )}
          <button
            ref={toggleRef}
            type='button'
            className='grid size-11 shrink-0 cursor-pointer place-items-center rounded-lg text-(--azul-titulo) hover:bg-(--azul-fundo) @min-[55rem]/header:hidden'
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={menuOpen}
            aria-controls={menuId}
            onClick={() => setOpenAt(menuOpen ? null : navigationKey)}
          >
            {menuOpen ? <X aria-hidden='true' /> : <Menu aria-hidden='true' />}
          </button>
        </div>
      </div>
      <nav
        id={menuId}
        aria-label='Navegação principal móvel'
        className='absolute inset-x-0 top-full z-30 flex max-h-[70dvh] flex-col gap-1 overflow-y-auto overscroll-contain rounded-xl border border-gray-200 bg-white p-3 shadow-[0_12px_32px_#102d491a] @min-[55rem]/header:hidden [&[hidden]]:hidden'
        hidden={!menuOpen}
      >
        {renderLinks(true)}
        {button && (
          <div className='pt-2 [&>a]:w-full [&>a]:text-center [&>a]:whitespace-normal @min-[30rem]/header:hidden'>
            {renderAction()}
          </div>
        )}
      </nav>
    </header>
  );
}
