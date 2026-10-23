import { Link } from 'react-router-dom';
import { Title, Button } from '../ui';
import { useAppStore } from '../../store/useAppStore';
import { profiles } from '../../data/demo';
import styles from '../../styles/app.module.css';

export default function TittleSection() {
  const { person, profile } = useAppStore(state => state.data);
  return (
    <section className={`${styles.pageHeading} ${styles.app}`}>
      <div className={styles.stack}>
        <p className={styles.eyebrow}>SEU AGORA COMEÇA AQUI</p>
        <Title variant='normal' as='h1'>
          Olá, {person.name.split(' ')[0]}!<br />O que vamos resolver hoje?
        </Title>
        <p className={styles.muted}>
          Um passo de cada vez também é seguir em frente.
        </p>
      </div>
      <div className={`${styles.panel} ${styles.white}`}>
        <p className={styles.eyebrow}>SEU MOMENTO</p>
        <strong>{profiles.find(item => item.id === profile)?.title}</strong>
        <Button as={Link} to='/perfil' variant='link' color='laranja'>
          Alterar meu momento
        </Button>
      </div>
    </section>
  );
}
