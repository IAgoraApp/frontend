import Styles from "../styles/PreparationStage.module.css"


function PreparationStage({onChange}){
    return(
        <section className={Styles.PreparationStage}>

            <div className={Styles.containerTitulo}>
                <div className={Styles.left}>
                    <h2>Sua independência, passo a passo.</h2>
                    <p>Retome de onde parou. Cada etapa pode ser ajustada ao seu ritmo.</p>
                </div>

                <div className={Styles.right}></div>
            </div>

            <div className={Styles.Etapas}>

                <a className={Styles.etapa} href="#" onClick={() => onChange(2)}>

                    <div className={Styles.divTexto}>
                        <h3>01 / Seu plano</h3>
                        <p>Definir momento e prioridades</p>
                    </div>

                    <p>Começar ↗</p>
                </a>

                <a className={Styles.etapa} href="#">

                    <div className={Styles.divTexto}>
                        <h3>02 / Seu dinheiro</h3>
                        <p>Estimar custos e reserva</p>
                    </div>

                    <p>Começar ↗</p>
                </a>

                <a className={Styles.etapa} href="#">

                    <div className={Styles.divTexto}>
                        <h3>03 / Seu canto</h3>
                        <p>Pesquisar imóveis e visitar</p>
                    </div>

                    <p>Começar ↗</p>
                </a>

                <a className={Styles.etapa} href="#">

                    <div className={Styles.divTexto}>
                        <h3>04 / Sua mudança</h3>
                        <p>Organizar documentos e essenciais</p>
                    </div>

                    <p>Começar ↗</p>
                </a>

                <a className={Styles.etapa} href="#">

                    <div className={Styles.divTexto}>
                        <h3>05 / Seu dia a dia</h3>
                        <p>Aprender os primeiros cuidados</p>
                    </div>

                    <p>Começar ↗</p>
                </a>
            </div>

            <div className={Styles.container_Buttons}>
                <a href="#" className={Styles.btnLaranja}>Minhas Metas</a>
                <a href="#" className={Styles.btnNormal}>Pendências</a>
                <a href="#" className={Styles.btnNormal}>Histórico</a>
            </div>
        </section>
    )
}

export default PreparationStage