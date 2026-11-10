import Styles from '../styles/sobcontrole.module.css'
export default function SobControle() {
    return (
        <section className={Styles.sobcontrole}>

            <div className={Styles.momento_nav}>
                <div className={Styles.informacao_usuario1}>
                    <a href='#' className={Styles.botao_voltar}>
                        <p className={Styles.pbotao_voltar}>
                            ← Voltar
                        </p>
                    </a>

                    <div className={Styles.suaconta}>
                        <p className={Styles.sua_conta}>
                            Sua conta
                        </p>
                    </div>

                    <h3 className={Styles.sob_controle}>
                        Sua conta, sob seu controle.
                    </h3>

                    <p className={Styles.revise}>
                        Revise seus dados e preferências.
                    </p>

                </div>
            </div>

        </section>
    )
}