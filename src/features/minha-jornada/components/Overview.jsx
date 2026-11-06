import Styles from '../styles/Overview.module.css'

function Overview(){
    return(
        <section className={Styles.Overview}>
            <div className={Styles.textos_top}>
                <h3>SEU CAMINHO ATÉ AS CHAVES</h3>
                <h2>Você não precisa resolver tudo hoje.</h2>
            </div>

            <div className={Styles.container_etapas}>
                <div className={Styles.info}>
                    <h3>Etapas concluídas</h3>
                    <h2>0 de 5</h2>
                </div>

                <div className={Styles.info}>
                    <h3>Seu foco agora</h3>
                    <h2>Planejar</h2>
                </div>

                <div className={Styles.info}>
                    <h3>Próximo passo</h3>
                    <h2>Seu orçamento</h2>
                </div>
            </div>
        </section>
    )
}

export default Overview