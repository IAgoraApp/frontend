import { Sections } from '../components/LandingPage';
import { Header, Footer } from '../components';

export default function LandingPage() {
  return (
    <>
      <Header />
      <main>
        <Sections.FirstSection />
        <Sections.VideoSection />
        <Sections.MomentoSection />
        <Sections.RecursosSection />
        <Sections.PerguntasSection />
      </main>
      <Footer />
    </>
  );
}
