import { useEffect } from 'react';
import { Header, Footer } from '../index';
import styles from '../../styles/household.module.css';

export default function HouseholdLayout({ title, children, className = '' }) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = `${title} | Iagora`;
    return () => {
      document.title = previousTitle;
    };
  }, [title]);

  return (
    <div className={`${styles.page} ${className}`}>
      <a href='#conteudo-principal' className={styles.skipLink}>
        Pular para o conteúdo
      </a>
      <Header />
      <main id='conteudo-principal' tabIndex={-1} className={styles.main}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
