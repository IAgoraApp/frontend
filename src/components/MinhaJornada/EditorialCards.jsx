import Styles from '../../styles/MinhaJornada/EditorialCards.module.css'
import { Button } from '../ui'
import { ArrowUpRight } from 'lucide-react'

function EditorialCards(){
    return(
        <section className={Styles.section_EditorialCards}>
            <div className={Styles.Card1}>
                <div className={Styles.div_top}>

                </div>
                <div className={Styles.div_bottom}>
                    <h3>01 / ENCONTRE SEU LUGAR</h3>
                    <h2>Um endereço para o seu agora.</h2>
                    <p>Compare o espaço, a região e o gasto total antes de escolher.</p>

                    <Button variant='solido' color='laranja' className={Styles.btn_encontrar}>Encontrar casa<ArrowUpRight className={Styles.seta_btn}/></Button>
                </div>
            </div>

            <div className={Styles.Card2}>
                <div className={Styles.div_top}>

                </div>
                <div className={Styles.div_bottom}>
                    <h3>02 / APRENDA O BÁSICO</h3>
                    <h2>Chegar com mais repertório.</h2>
                    <p>O essencial para cuidar da casa desde os primeiros dias.</p>

                    <Button variant='solido' color='laranja' className={Styles.btn_aprender}>Aprender a morar<ArrowUpRight className={Styles.seta_btn}/></Button>
                </div>
            </div>
        </section>
    )
}

export default EditorialCards