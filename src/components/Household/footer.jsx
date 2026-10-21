import { Link } from 'react-router-dom';
import Logo from '../../assets/images/logoLaranja.png';
import styles from '../../styles/household.module.css';

export default function HouseholdFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.brand}>
          <Link to='/' aria-label='Iagora, página inicial'>
            <img
              src={Logo}
              alt='Iagora'
              width={126}
              height={46}
              className={styles.logo}
            />
          </Link>
          <p>Um guia para conquistar e cuidar da sua independência.</p>
        </div>
        <nav aria-label='Conheça o Iagora'>
          <h2>Conheça o Iagora</h2>
          <Link to='/#funcionalidades'>Funcionalidades</Link>
          <Link to='/#como-funciona'>Como funciona</Link>
          <Link to='/manutencao?area=sobre'>Sobre nós</Link>
        </nav>
        <nav aria-label='Sua conta'>
          <h2>Sua conta</h2>
          <Link to='/login'>Meu perfil</Link>
          <a href='mailto:Iagora@hotmail.com'>Suporte</a>
          <Link to='/#perguntas-frequentes'>Perguntas frequentes</Link>
        </nav>
        <div>
          <h2>Vamos conversar</h2>
          <a href='mailto:Iagora@hotmail.com'>Iagora@hotmail.com</a>
          <p className={styles.socials}>Instagram · GitHub · LinkedIn</p>
        </div>
      </div>
      <div className={styles.legal}>
        © Iagora · Todos os direitos reservados.
      </div>
    </footer>
  );
}
