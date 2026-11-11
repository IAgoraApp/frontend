import Styles from "../styles/HousingResults.module.css"

export default function HousingResults(){
    return(
        <section className={Styles.HousingResults}>
            <h2>Espaços para imaginar seu próximo capítulo</h2>

            <div className={Styles.container}>
                <div className={Styles.left}>
                    <h3>DO SEU JEITO</h3>
                    <h2>Refine sua busca.</h2>

                    <form action="">

                        <div className={Styles.caixaTexto}>
                            <label htmlFor="espaco">Tipo de espaço</label>
                            <input type="text" name="espaco" id="espaco" placeholder="Apartamento, casa ou estúdio"/>
                        </div>

                        <div className={Styles.caixaTexto}>
                            <label htmlFor="quartos">Quartos</label>
                            <input type="text" name="quartos" id="quartos" placeholder="1 ou mais"/>
                        </div>

                        <div className={Styles.caixaTexto}>
                            <label htmlFor="importante">O que importa pra você?</label>
                            <input type="text" name="importante" id="importante" placeholder="Transporte, trabalho, estudo"/>
                        </div>

                    </form>

                    <p>Lembre do gasto total: aluguel, condomínio, contas e deslocamento.</p>

                    <button>Simular meu orçamento</button>
                </div>

                <div className={Styles.right}>
                    <div className={Styles.card}>
                        <div className={Styles.foto}>

                        </div>

                        <div className={Styles.textos}>
                            <h3>APARTAMENTO · SÃO PAULO, SP</h3>
                            <h2>Um começo compacto e acolhedor.</h2>
                            <p>35 m² · 1 quarto · cozinha integrada</p>
                            <h2>R$ 1.400 / mês</h2>

                            <button>Salvar na minha jornada</button>
                        </div>

                        
                    </div>

                    <div className={Styles.card2}>
                        <div className={Styles.foto}>

                        </div>

                        <div className={Styles.textos}>
                            <h3>CASA · REGIÃO METROPOLITANA</h3>
                            <h2>Mais espaço para chamar de seu.</h2>
                            <p>2 quartos · quintal · espaço para dividir</p>
                            <h2>R$ 1.850 / mês</h2>

                            <button>Salvar na minha jornada</button>
                        </div>

                        
                    </div>
                </div>
            </div>
        </section>
    )
}