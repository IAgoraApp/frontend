import { Link, useLocation } from 'react-router-dom';
import Logo from '../../assets/images/logoLaranja.png';
import { Button } from './ui/index';
import { headerVariants } from '../../data/header';

export default function Header({
  variant = 'user',
  className = '',
  borderClass = '',
}) {
  const location = useLocation();
  const {
    logoLink,
    navLinks,
    actionButton: button,
  } = headerVariants[variant] ?? headerVariants.user;
  const isLinkActive = route => location.pathname === route;

  return (
    <header
      className={`mx-30 flex justify-between py-5 items-center ${borderClass} ${className}`}
    >
      <Link to={logoLink} aria-label='Página inicial Iagora'>
        <img className='w-40 cursor-pointer' src={Logo} alt='IAgora' />
      </Link>

      <nav className='flex gap-10 items-center'>
        {navLinks.map((item, index) => {
          const active = isLinkActive(item.rota);

          return (
            <Link
              key={item.rota || index}
              to={item.rota}
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
