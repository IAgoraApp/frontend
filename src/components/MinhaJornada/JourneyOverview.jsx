import Styles from '../../styles/MinhaJornada/JourneyOverview.module.css'

function JourneyOverview(){
    return(
        <section className={Styles.section_Journey}>
            <div className={Styles.card}>
                <h3>Etapas concluídas</h3>
                <h2>0 de 5</h2>
            </div>
            <div className={Styles.card}>
                <h3>Seu foco agora</h3>
                <h2>Planejar</h2>
            </div>
            <div className={Styles.card}>
                <h3>Próximo passo</h3>
                <h2>Seu orçamento</h2>
            </div>
        </section>
    )
}

export default JourneyOverview