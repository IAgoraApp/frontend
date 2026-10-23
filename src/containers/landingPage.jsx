import { Sections } from '../components/LandingPage';
import { Footer } from '../components';

export default function LandingPage() {
  return (
    <>
      <main className='landing-page'>
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
