import Styles from "../styles/CreativeMasthead.module.css"

export default function CreativeMasthead(){
    return(
        <section className={Styles.CreativeMasthead}>
            <div className={Styles.left}>
                <div className={Styles.textos}>
                    <h3>ENCONTRAR CASA / UM CANTO PRA CHAMAR DE SEU</h3>
                    <h2>Abre a porta <span>Pro seu agora</span></h2>
                </div>
                <div className={Styles.divAzul}>
                    <p>DO SEU JEITO. NO SEU TEMPO</p>
                </div>
            </div>

            <div className={Styles.right}>

            </div>
        </section>
    )
}