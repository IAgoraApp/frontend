import { useState } from 'react';
import Styles from './styles/minhaJornada.module.css';
import PreparationStage from './components/PreparationStages';
import EditorialCards from './components/EditorialCards';
import EtapaJornada from './components/etapa_1';

export default function Aprendendo() {
  const [etapaAtual, setEtapaAtual] = useState(null);

  return (
    <main className={Styles.main}>
      {etapaAtual === null ? (
        <>
          <PreparationStage onChange={setEtapaAtual} />
          <EditorialCards />
        </>
      ) : (
        <EtapaJornada etapaAtual={etapaAtual} onChange={setEtapaAtual} />
      )}
    </main>
  );
}
