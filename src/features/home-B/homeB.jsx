import Styles from '../home-B/styles/homeB.module.css'
import BoasVindas from './components/BoasVindas';
import Atalhos from './components/Atalhos';
import Conteudo from './components/Conteudo';

export default function Aprendendo() {
  return (
    <main className={Styles.main}>
      <BoasVindas/>
      <Atalhos/>
      <Conteudo/>
    </main>
  );
}
