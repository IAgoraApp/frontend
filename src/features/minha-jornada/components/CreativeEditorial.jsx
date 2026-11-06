import Styles from '../styles/CreativeEditorial.module.css'

function CreativeEditorial(){
    return(
        <section className={Styles.CreativeEditorial}>
            <div className={Styles.Div_left}>
                <div className={Styles.textos_top}> 

                    <h3>SUA JORNADA PRA MORAR SOZINHO</h3>

                    <div className={Styles.titulos}>
                        <h2>O primeiro</h2>
                        <div className={Styles.caixaLaranja}>
                            passo é seu.
                        </div>
                    </div>

                    <p>Organize as decisões da mudança e acompanhe o que falta para pegar as chaves.</p>

                    <a href="#">Planejar meu orçamento ↗</a>
                </div>

                <div className={Styles.texto_bottom}>
                    <p>INDEPENDÊNCIA NA VIDA REAL ↗</p>
                </div>
            </div>

            <div className={Styles.Div_right}>

            </div>
        </section>
    )
}

export default CreativeEditorial