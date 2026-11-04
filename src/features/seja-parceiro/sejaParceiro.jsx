import { Footer } from '../../shared';
import {
  HeroSection,
  BenefitsSection,
  CategoriesSection,
  StepsSection,
  QuestionsSection,
  CtaSection,
} from './components';

export default function SejaParceiro() {
  return (
    <>
      <main className="bg-white text-(--azul-titulo) wrap-anywhere [--laranja-principal:#e03b00] [--texto-apoio:#617385] [font-optical-sizing:none] [font-variation-settings:'opsz'_14]">
        <HeroSection />
        <BenefitsSection />
        <CategoriesSection />
        <StepsSection />
        <QuestionsSection />
        <CtaSection />
      </main>
      <Footer variant='landing' />
    </>
  );
}
