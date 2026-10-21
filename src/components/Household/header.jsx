import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Logo from '../../assets/images/logoLaranja.png';
import { Button } from '../ui';
import styles from '../../styles/household.module.css';

const links = [
  { label: 'Início', to: '/home' },
  { label: 'Casa', to: '/casa' },
  { label: 'Finanças', to: '/manutencao?area=financas' },
  { label: 'Minha rotina', to: '/manutencao?area=rotina' },
  { label: 'Empresas e serviços', to: '/marketplace' },
];

export default function HouseholdHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();
  return (
    <header className={styles.header}>
      <Link to='/' aria-label='Iagora, página inicial'>
        <img
          src={Logo}
          alt='Iagora'
          width={126}
          height={47}
          className={styles.logo}
        />
      </Link>
      <nav
        id='navegacao-casa'
        aria-label='Navegação principal'
        className={`${styles.navigation} ${menuOpen ? styles.navigationOpen : ''}`}
      >
        {links.map(({ label, to }) => (
          <NavLink
            key={label}
            to={to}
            onClick={() => setMenuOpen(false)}
            className={() =>
              to === '/casa' &&
              ['/casa', '/cozinha', '/limpeza'].includes(pathname)
                ? styles.activeLink
                : undefined
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>
      <Button as={Link} to='/login' color='acao' className={styles.profile}>
        Meu perfil
      </Button>
      <button
        type='button'
        className={styles.menuToggle}
        aria-expanded={menuOpen}
        aria-controls='navegacao-casa'
        aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <X aria-hidden='true' /> : <Menu aria-hidden='true' />}
      </button>
    </header>
  );
}
