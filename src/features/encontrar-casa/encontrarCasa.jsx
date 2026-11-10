import Styles from "./styles/Aprendendo.module.css"
import CreativeMasthead from "./components/CreativeMasthead";
import HousingSearth from "./components/HousingSearth";
import HousingResults from "./components/HousingResults";
import NextStep from "./components/NextStep";
import Footer from '../../shared/footer'

export default function Aprendendo() {
  return (
    <main className={Styles.main}>
      <CreativeMasthead/>
      <HousingSearth/>
      <HousingResults/>
      <NextStep/>
      <Footer/>
    </main>
  );
}
