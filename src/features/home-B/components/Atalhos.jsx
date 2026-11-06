import Styles from '../styles/Atalhos.module.css'
import MinhaJornada from '../assets/minhajornada.svg'
import Financas from '../assets/financas.svg'
import Morar from '../assets/morar.svg'
import Casa from '../assets/casa.svg'
import Metas from '../assets/metas.svg'
import Checklist from '../assets/checklist.svg'

function Atalhos(){
    return(
        <section className={Styles.Atalhos}>
            <h2>FERRAMENTAS PARA A VIDA REAL</h2>

            <div className={Styles.container_atalhos}>
                <div className={Styles.atalho}>
                    <a href="#">
                        <img src={MinhaJornada} alt="icone minha jornada" />
                        <p>Minha Jornada</p>
                    </a>
                </div>

                <div className={Styles.atalho}>
                    <a href="#">
                        <img src={Financas} alt="icone finanças" />
                        <p>Finanças</p>
                    </a>
                </div>

                <div className={Styles.atalho}>
                    <a href="#">
                        <img src={Morar} alt="icone chapéu" />
                        <p>Aprendendo a morar</p>
                    </a>
                </div>

                <div className={Styles.atalho}>
                    <a href="#">
                        <img src={Casa} alt="icone casa" />
                        <p>Encontrar casa</p>
                    </a>
                </div>

                <div className={Styles.atalho}>
                    <a href="#">
                        <img src={Metas} alt="icone metas" />
                        <p>Metas</p>
                    </a>
                </div>

                <div className={Styles.atalho}>
                    <a href="#">
                        <img src={Checklist} alt="icone checklist" />
                        <p>Checklist</p>
                    </a>
                </div>
            </div>
        </section>
    )
}

export default Atalhos