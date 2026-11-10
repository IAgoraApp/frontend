import Styles from "../styles/HousingSearth.module.css"

export default function HousingSearth(){
    return(
        <section className={Styles.HousingSearth}>
            <div>
                <form action="#">

                <div className={Styles.perguntas}>
                    <label htmlFor="cidade">Onde você quer morar?</label>
                    <input type="text" name="cidade" id="cidade" placeholder="Cidade ou bairro"/>
                </div>

                <div className={Styles.perguntas}>
                    <label htmlFor="aluguel">Até quanto por mês?</label>
                    <input type="text" name="aluguel" id="aluguel" placeholder="Aluguel + condomínio + outras contas"/>
                </div>

                <button>Buscar meu canto</button>
                </form>
            </div>
        </section>
    )
}