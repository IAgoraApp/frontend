import { Link, Navigate, useNavigate } from 'react-router-dom';
import Logo from '../assets/images/logoLaranja.png';
import Chaves from '../assets/images/chaves.png';
import Mulher from '../assets/images/img esquerda.png';
import Homem from '../assets/images/img2.png';
import Servicos from '../assets/images/services.png';
import { profiles } from '../data/demo';
import { useAppStore } from '../store/useAppStore';
import styles from '../styles/app.module.css';

export default function SeuMomento() {
  const navigate = useNavigate();
  const session = useAppStore(state => state.session);
  const update = useAppStore(state => state.update);
  const images = { planejando: Mulher, morando: Homem, anunciante: Servicos };
  if (!session) return <Navigate to='/login' replace />;
  return (
    <main
      className={`${styles.auth} ${styles.app}`}
      style={{ background: 'var(--azul-escuro)', color: 'white' }}
    >
      <header>
        <Link to='/'>
          <img src={Logo} alt='Iagora' />
        </Link>
        <span>SEU MOMENTO · 01 / 01</span>
      </header>
      <section className={styles.row}>
        <div className={styles.stack}>
          <p className={styles.eyebrow} style={{ color: '#ffb897' }}>
            EI, QUE BOM TER VOCÊ AQUI!
          </p>
          <h1 className='font-heading text-5xl md:text-7xl font-extrabold'>
            Seu agora
            <br />
            começa onde?
          </h1>
          <p>Cada começo é diferente. Conta pra gente qual é o seu.</p>
        </div>
        <img src={Chaves} alt='' className='hidden md:block w-40' />
      </section>
      <section className={styles.grid3} aria-label='Escolha seu perfil'>
        {profiles.map((profile, index) => (
          <button
            key={profile.id}
            onClick={() => {
              update({ profile: profile.id });
              navigate('/home');
            }}
            className={styles.card}
            style={{ color: 'var(--azul-titulo)', textAlign: 'left' }}
          >
            <img src={images[profile.id]} alt='' />
            <div className={styles.cardBody}>
              <span className={styles.eyebrow}>0{index + 1} / SEU MOMENTO</span>
              <h2>{profile.title}</h2>
              <p>{profile.description}</p>
              <span className={styles.textButton}>Começar por aqui ↗</span>
            </div>
          </button>
        ))}
      </section>
      <p className='text-center'>
        Pode mudar de ideia depois. Seu momento também muda!
      </p>
    </main>
  );
}
