import Header from './components/Header';
import HeroSection from './components/HeroSection';
import MomentoSection from './components/MomentoSection';
import CategoriasSection from './components/CategoriasSection';
import PassosSection from './components/PassosSection';
import FaqSection from './components/FaqSection';
import CtaBanner from './components/CtaBanner';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-white flex flex-col font-['DM_Sans'] antialiased selection:bg-[#E03B00] selection:text-white">
      <Header />
      <main className="flex-1 flex flex-col">
        <HeroSection />
        <MomentoSection />
        <CategoriasSection />
        <PassosSection />
        <FaqSection />
        <CtaBanner />
      </main>
      <Footer />
    </div>
  );
}
