import Styles from './styles/minhaJornada.module.css';
import PreparationStage from './components/PreparationStages';
import EditorialCards from './components/EditorialCards';
import Etapa1 from './components/etapa_1';

export default function Aprendendo() {
  return (
    <main className={Styles.main}>
      <PreparationStage/>
      <EditorialCards/>
      <Etapa1/>
    </main>
  );
}
