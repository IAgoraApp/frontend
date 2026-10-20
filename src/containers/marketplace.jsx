import Header from '../components/Header'
import Footer from '../components/Footer'
import Styles from '../styles/marketplace.module.css'
function Marketplace() {

    return (
        <main>
            <Header />
            <section className={Styles.apresentacao}>
                <div className={Styles.div1}>
                    <div className={Styles.apresentacao_texto1}>
                        <h3 className={Styles.h3}>EMPRESAS QUE CUIDAM DO SEU CANTO</h3>
                    </div>
                    <div className={Styles.apresentacao_texto2}>
                        <h2 className={Styles.h2_deuruim}>
                            Deu ruim?
                        </h2>
                    </div>
                    <div className={Styles.apresentacao_texto3}>
                        <h2 className={Styles.h2}>
                            Tem quem faça.
                        </h2>
                    </div>
                    <div className={Styles.apresentacao_texto4}>
                        <p className={Styles.p1}>
                           Encontre prestadoras de serviços, conheça o que cada empresa oferece e combine o atendimento direto com ela. 
                        </p>
                    </div>

                    <div className={Styles.apresentacao_texto5}>
                        <a href="#"> Quero divulgar minha empresa ↗ </a>
                    </div>
                    <div className={Styles.apresentacao_texto6}>
                        <a href="#"> INDEPENDÊNCIA NA VIDA REAL ↗ </a>
                    </div>

                </div>


                <div className={Styles.div2}>

                </div>

            </section>
            <Footer />
        </main>
    )
}

export default Marketplace