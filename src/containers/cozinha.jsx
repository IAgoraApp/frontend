import HouseholdLayout from '../components/Household/layout';
import HeroSection from '../components/Household/heroSection';
import NextStep from '../components/Household/nextStep';
import ReceitaSection from '../components/Cozinha/receitaSection';
import ComprasSection from '../components/Cozinha/comprasSection';
import { kitchenHero } from '../data/cozinha';

export default function Cozinha() {
  return (
    <HouseholdLayout title='Cozinha'>
      <HeroSection {...kitchenHero} />
      <ReceitaSection />
      <ComprasSection />
      <NextStep
        title='Aprender a cozinhar também é se cuidar.'
        description='Um repertório simples já muda a sua semana.'
        action={{ href: '#receita-do-dia', label: 'Aprender o básico' }}
      />
    </HouseholdLayout>
  );
}
