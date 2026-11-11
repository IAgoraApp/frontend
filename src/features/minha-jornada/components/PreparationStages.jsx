import Styles from "../styles/PreparationStage.module.css";
import jornadaEtapas from "../data/jornadaEtapas.json";

function PreparationStage({ onChange }) {
  return (
    <section className={Styles.PreparationStage}>
      <div className={Styles.containerTitulo}>
        <div className={Styles.left}>
          <h2>Sua independência, passo a passo.</h2>
          <p>Retome de onde parou. Cada etapa pode ser ajustada ao seu ritmo.</p>
        </div>
        <div className={Styles.right}></div>
      </div>

      <div className={Styles.Etapas}>
        {jornadaEtapas.stages.map((etapa) => (
          <button
            type="button"
            className={Styles.etapa}
            key={etapa.id}
            onClick={() => onChange(etapa.id)}
          >
            <div className={Styles.divTexto}>
              <h3>{etapa.number} / {etapa.navTitle}</h3>
              <p>{etapa.subtitle}</p>
            </div>
            <p>Começar ↗</p>
          </button>
        ))}
      </div>

      <div className={Styles.container_Buttons}>
        <a href="#" className={Styles.btnLaranja}>Minhas Metas</a>
        <a href="#" className={Styles.btnNormal}>Pendências</a>
        <a href="#" className={Styles.btnNormal}>Histórico</a>
      </div>
    </section>
  );
}

export default PreparationStage;
