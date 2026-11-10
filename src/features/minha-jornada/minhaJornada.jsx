import Styles from './styles/minhaJornada.module.css';
import PreparationStage from './components/PreparationStages';
import EditorialCards from './components/EditorialCards';
import Etapa1 from './components/etapa_1';
import { useState } from 'react';

export default function Aprendendo() {

  const [view, useView] = useState(1)

  return (
    <main className={Styles.main}>
      {view === 1 && (<>
        <PreparationStage onChange={useView}/>
        <EditorialCards onChange={useView}/>
      </>
      )}
      {view === 2 && (<>
        <Etapa1 onChange={useView}/>
      </>
      )}

    </main>
  );
}
