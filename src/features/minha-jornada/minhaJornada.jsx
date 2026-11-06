import Styles from './styles/minhaJornada.module.css';
import CreativeEditorial from './components/CreativeEditorial';
import Overview from './components/Overview';
import Checklist from './components/Checklist';
import EditorialCards from './components/EditorialCards';

export default function Aprendendo() {
  return (
    <main className={Styles.main}>
      <CreativeEditorial/>
      <Overview/>
      <Checklist/>
      <EditorialCards/>
    </main>
  );
}
