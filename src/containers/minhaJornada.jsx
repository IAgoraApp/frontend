import { Header, Footer } from '../components';
import { Sections } from '../components/MinhaJornada';

export default function MinhaJornada() {
  return (
    <>
      <Header/>
      <main>
        <Sections.CreativeEditorial/>
        <Sections.Titulo/>
        <Sections.JourneyOverview/>
        <Sections.EditorialCards/>
      </main>
      <Footer/>
    </>
  );
}
