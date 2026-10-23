import HouseholdLayout from '../components/Household/layout';
import SectionHeading from '../components/Household/sectionHeading';
import HeroSection from '../components/Household/heroSection';
import EditorialCard from '../components/Household/editorialCard';
import NextStep from '../components/Household/nextStep';
import CuidadosSection from '../components/Casa/cuidadosSection';
import { houseHero, houseCards } from '../data/casa';
import styles from '../styles/household.module.css';
import HouseManager from '../components/Casa/houseManager';

export default function Casa() {
  return (
    <HouseholdLayout title='Casa'>
      <SectionHeading
        as='h1'
        eyebrow='SEU CANTO VIVO'
        title='Uma casa com a sua cara.'
        description='Cuidar do básico abre espaço para viver o que importa.'
      />
      <HouseManager />
      <HeroSection {...houseHero} reversed headingAs='h2' />
      <section
        className={styles.cards}
        aria-label='Explore os cuidados da casa'
      >
        {houseCards.map(card => (
          <EditorialCard key={card.eyebrow} {...card} />
        ))}
      </section>
      <CuidadosSection />
      <NextStep
        title='Tem coisa que pede uma mão extra.'
        description='Encontre empresas de limpeza, manutenção e mudança.'
        action={{ to: '/marketplace', label: 'Encontrar empresas' }}
      />
    </HouseholdLayout>
  );
}
