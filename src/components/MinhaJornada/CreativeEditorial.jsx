import Styles from '../../styles/MinhaJornada/CreativeEditorial.module.css'

function CreativeEditorial(){
    return(
        <section className={Styles.section_Creative}>
            <div className={Styles.div_left}>
                <h3>SUA JORNADA PRA MORAR SOZINHO</h3>
                <div className={Styles.titulos_grandes}>
                    <h2>O primeiro</h2>
                    <div className={Styles.container_laranja}>
                        passo é seu.
                    </div>
                </div>
                <p>Organize as decisões da mudança e acompanhe o que falta para pegar as chaves.</p>
            </div>

            <div className={Styles.div_right}>

            </div>
        </section>
    )
}

export default CreativeEditorial