import Styles from '../styles/BoasVindas.module.css'

function BoasVindas(){
    return(
        <section className={Styles.BoasVindas}>
            <h2>Oi! Vamos preparar sua mudança?</h2>

            <div className={Styles.seuMomento}>
                <div className={Styles.div_left}> 
                    <h3>SEU MOMENTO</h3>
                    <h2>Vou morar sozinho</h2>
                </div>

                <a href="#">Alterar ↗</a>
            </div>
        </section>
    )
}

export default BoasVindas