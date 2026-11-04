import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Logo from './assets/logoLaranja.png';
import LogoFigma from './assets/logoFigma.png';
import { Button, Container } from './ui/index';
import { headerVariants } from './headerConfig';

export default function Header({
  variant = 'user',
  className = '',
  borderClass = '',
}) {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const {
    logoLink,
    navLinks,
    actionButton: button,
  } = headerVariants[variant] ?? headerVariants.user;
  const isLinkActive = route => location.pathname === route;
  const isCompanyAccess = variant === 'empresa-acesso';
  const isPublic = variant === 'public' || variant === 'institucional';

  if (variant === 'prestadores' || isCompanyAccess) {
    return (
      <header
        className={`${isCompanyAccess ? '' : 'border-b border-[#d6e0e8]'} bg-white [--laranja-principal:#e03b00] ${borderClass} ${className}`}
      >
        <Container
          className={`flex min-h-[88px] items-center justify-between gap-4 py-4 min-[1280px]:gap-[90px] min-[1280px]:py-0 ${isCompanyAccess ? 'min-[1280px]:min-h-24' : 'min-[1280px]:min-h-[139px]'}`}
        >
          <Link
            to={logoLink}
            aria-label='Página inicial Iagora'
            className='shrink-0 rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--laranja-principal)'
          >
            <img
              src={LogoFigma}
              alt='IAgora'
              width='126'
              height='47'
              className='h-[47px] w-[126px] object-cover'
            />
          </Link>
          <nav
            aria-label='Navegação de parceiros'
            className={`hidden min-w-0 flex-1 items-center justify-center leading-5 font-bold text-(--azul-titulo) min-[1280px]:flex ${isCompanyAccess ? 'gap-6 text-sm' : 'gap-7 text-[15px]'}`}
          >
            {navLinks.map(item => (
              <a
                key={item.rota}
                href={item.rota}
                aria-current={item.active ? 'location' : undefined}
                className={`whitespace-nowrap hover:text-(--laranja-principal) focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--laranja-principal) ${item.className || ''} ${item.active ? 'text-[#d54c15]' : ''}`}
              >
                {item.nome}
              </a>
            ))}
          </nav>
          <div className='flex shrink-0 items-center gap-3'>
            <Button
              as={Link}
              to={button.rota}
              color={button.color}
              className={`w-[190px] px-4! font-bold! max-sm:hidden! ${isCompanyAccess ? 'h-[52px] text-base' : 'h-[50px] text-xl'}`}
            >
              {button.label}
            </Button>
            <button
              type='button'
              aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={menuOpen}
              aria-controls='prestadores-menu'
              onClick={() => setMenuOpen(!menuOpen)}
              className='flex size-11 cursor-pointer items-center justify-center rounded-lg text-(--azul-titulo) hover:bg-(--azul-fundo) focus-visible:outline-2 focus-visible:outline-(--laranja-principal) min-[1280px]:hidden'
            >
              {menuOpen ? (
                <X aria-hidden='true' />
              ) : (
                <Menu aria-hidden='true' />
              )}
            </button>
          </div>
        </Container>
        <nav
          id='prestadores-menu'
          aria-label='Navegação de parceiros no celular'
          className={`${menuOpen ? 'flex' : 'hidden'} flex-col border-t border-[#d6e0e8] px-4 py-3 text-base font-bold text-(--azul-titulo) sm:px-6 min-[1280px]:hidden`}
        >
          {navLinks.map(item => (
            <a
              key={item.rota}
              href={item.rota}
              onClick={() => setMenuOpen(false)}
              className={`flex min-h-11 items-center rounded px-2 hover:bg-(--azul-fundo) ${item.active ? 'text-[#d54c15]' : ''}`}
            >
              {item.nome}
            </a>
          ))}
          <Button
            as={Link}
            to={button.rota}
            onClick={() => setMenuOpen(false)}
            color={button.color}
            className='mt-2 min-h-12 self-start font-bold! sm:hidden'
          >
            {button.label}
          </Button>
        </nav>
      </header>
    );
  }

  return (
    <header
      className={`${isPublic ? 'mx-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-3 py-5 sm:mx-6 lg:mx-12 xl:mx-30' : 'mx-30 flex items-center justify-between py-5'} ${borderClass} ${className}`}
    >
      <Link to={logoLink} aria-label='Página inicial Iagora'>
        <img className='w-40 cursor-pointer' src={Logo} alt='IAgora' />
      </Link>

      <nav
        className={
          isPublic
            ? 'order-last flex w-full flex-wrap items-center justify-center gap-x-4 gap-y-2 lg:order-none lg:w-auto lg:gap-10'
            : 'flex items-center gap-10'
        }
      >
        {navLinks.map((item, index) => {
          const active = isLinkActive(item.rota);

          return (
            <Link
              key={item.rota || index}
              to={item.rota}
              aria-current={active ? 'page' : undefined}
              className={`font-semibold cursor-pointer transition-all ${
                active
                  ? 'text-(--laranja-principal)'
                  : 'hover:text-(--laranja-principal)'
              }`}
            >
              {item.nome}
            </Link>
          );
        })}
      </nav>

      {button && (
        <Link to={button.rota}>
          <Button color={button.color || 'laranja'}>{button.label}</Button>
        </Link>
      )}
    </header>
  );
}
