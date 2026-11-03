import { Sections } from './components';
import { Footer } from '../../shared';

export default function LandingPage() {
  return (
    <>
      <main>
        <Sections.FirstSection />
        <Sections.VideoSection />
        <Sections.MomentoSection />
        <Sections.RecursosSection />
        <Sections.PerguntasSection />
        <Sections.EndSection />
      </main>
      <Footer />
    </>
  );
}
