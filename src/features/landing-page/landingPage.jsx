import { Sections } from './components';
import { Footer } from '../../shared';

export default function LandingPage() {
  return (
    <div className='flex min-h-screen flex-col bg-white font-body antialiased selection:bg-[#E03B00] selection:text-white'>      <main className='flex flex-1 flex-col'>
        <Sections.FirstSection />
        <Sections.MomentoSection />
        <Sections.RecursosSection />
        <Sections.PassosSection />
        <Sections.PerguntasSection />
        <Sections.EndSection />
      </main>
      <Footer />
    </div>
  );
}
