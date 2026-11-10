import Styles from "../styles/NextStep.module.css"

export default function NextStep(){
    return(
        <section className={Styles.NextStep}>
            <div className={Styles.textos}>
                <h2>Gostou do espaço? Olhe além da foto.</h2>
                <p>Liste suas perguntas e compare cada opção com o seu orçamento.</p>
            </div>

            <button>Organizar minha jornada</button>
        </section>
    )
}