import { Link, useLocation } from 'react-router-dom';
import Logo from '../assets/images/logoLaranja.png';
import { Button } from './ui';
import { headerVariants } from '../data/header';
import { navigation } from '../data/navigation';
import { useAppStore } from '../store/useAppStore';

export default function Header({
  variant = 'home',
  className = '',
  borderClass = '',
}) {
  const location = useLocation();
  const profile = useAppStore(state => state.data.profile);
  const isPublic = variant === 'landing' || variant === 'institucional';
  const config = headerVariants[variant] ?? headerVariants.home;
  const {
    logoLink,
    navLinks,
    actionButton: button,
  } = isPublic
    ? config
    : {
        logoLink: '/home',
        navLinks: navigation[profile] || [],
        actionButton: {
          label: 'Meu perfil',
          rota: '/perfil',
          color: 'laranja',
        },
      };
  const isLinkActive = route => location.pathname === route;

  return (
    <header
      className={`site-header ${isPublic ? 'public-header' : 'app-header'} mx-30 flex justify-between py-5 items-center ${borderClass} ${className}`}
    >
      <Link to={logoLink} aria-label='Página inicial Iagora'>
        <img className='w-40 cursor-pointer' src={Logo} alt='IAgora' />
      </Link>

      <nav
        className='flex gap-10 items-center'
        aria-label='Navegação principal'
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
        <Button as={Link} to={button.rota} color={button.color || 'laranja'}>
          {button.label}
        </Button>
      )}
    </header>
  );
}
