import Styles from '../../styles/MinhaJornada/CreativeEditorial.module.css'
import { Button } from '../ui'
import { ArrowUpRight } from 'lucide-react'

function CreativeEditorial(){
    return(
        <section className={Styles.section_Creative}>
            <div className={Styles.div_left}>
                <h3>SUA JORNADA PRA MORAR SOZINHO</h3>
                <div className={Styles.titulos_grandes}>
                    <h2>O primeiro</h2>
                    <div className={Styles.container_laranja}>
                        <h2>passo é seu.</h2>
                    </div>
                </div>
                <p>Organize as decisões da mudança e acompanhe o que falta para pegar as chaves.</p>
                <Button variant='solido' color='laranja' className={Styles.btn_planejar}>Planejar meu orçamento<ArrowUpRight className={Styles.seta_btn}/></Button>

                <div className={Styles.independencia}>
                    INDEPENDÊNCIA NA VIDA REAL ↗
                </div>
            </div>

            <div className={Styles.div_right}>

            </div>
        </section>
    )
}

export default CreativeEditorial