import Styles from '../styles/Checklist.module.css'

function Checklist(){
    return(
        <section className={Styles.Checklist}>
            <form className={Styles.form}>
                <div className={Styles.check}>
                    <input type="checkbox" name="opcao2" id="opcao1" />
                    <label htmlFor="opcao1">
                        <h2>01 / Entender o que cabe no bolso</h2>
                        <p>Mapeie sua renda, as contas do mês e o custo para começar.</p>
                    </label>
                </div>

                <div className={Styles.check}>
                    <input type="checkbox" name="opcao2" id="opcao2" />
                    <label htmlFor="opcao2">
                        <h2>02 / Escolher onde faz sentido morar</h2>
                        <p>Pense em localização, deslocamento e no espaço que você precisa.</p>
                    </label>
                </div>

                <div className={Styles.check}>
                    <input type="checkbox" name="opcao2" id="opcao3" />
                    <label htmlFor="opcao3">
                        <h2>03 / Preparar documentos e visitas</h2>
                        <p>Organize as informações antes de comparar opções.</p>
                    </label>
                </div>

                <div className={Styles.check}>
                    <input type="checkbox" name="opcao2" id="opcao4" />
                    <label htmlFor="opcao4">
                        <h2>04 / Separar o essencial da casa</h2>
                        <p>Priorize o que você vai usar desde o primeiro dia.</p>
                    </label>
                </div>

                <div className={Styles.check}>
                    <input type="checkbox" name="opcao2" id="opcao5" />
                    <label htmlFor="opcao5">
                        <h2>05 / Organizar a mudança</h2>
                        <p>Liste caixas, transporte e as tarefas da chegada.</p>
                    </label>
                </div>
            </form>
        </section>
    )
}

export default Checklist