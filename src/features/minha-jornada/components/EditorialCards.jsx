import Styles from '../styles/EditorialCards.module.css'

function EditorialCards(){
    return(
        <section className={Styles.EditorialCards}>
            <div className={Styles.Card_left}>
                <div className={Styles.top}>

                </div>
                <div className={Styles.bottom}>
                    <h3>01 / ENCONTRE SEU LUGAR</h3>
                    <h2>Um endereço para o seu agora.</h2>
                    <p>Compare o espaço, a região e o gasto total antes de escolher.</p>

                    <a href="#">Encontrar casa ↗</a>
                </div>
            </div>

            <div className={Styles.Card_right}>
                <div className={Styles.top}>

                </div>
                <div className={Styles.bottom}>
                    <h3>02 / APRENDA O BÁSICO</h3>
                    <h2>Chegar com mais repertório.</h2>
                    <p>O essencial para cuidar da casa desde os primeiros dias.</p>

                    <a href="#">Aprender a morar ↗</a>
                </div>
            </div>
        </section>
    )
}

export default EditorialCards