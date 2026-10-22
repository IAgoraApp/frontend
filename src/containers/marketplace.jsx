import { Footer } from '../components'
import Styles from '../styles/marketplace.module.css'
import Direita from '../assets/images/div-direita.png'
import Manutenção from '../assets/images/essentials.png'
import Mudança from '../assets/images/moving.png'
import Limpeza from '../assets/images/services.png'

function Marketplace() {

    return (
        <main>
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
                    <img src={Direita} alt="Imagem de uma mulher com um celular na mão" />

                </div>
            </section>

            <section className={Styles.cuidado}>
                <p className={Styles.p2}>
                    ENCONTRE QUEM RESOLVE
                </p>

                <h2 className={Styles.h2_cuidado}>
                    Que cuidado sua casa precisa agora?
                </h2>

                <div className={Styles.pesquisa}>

                    <form>
                        <label htmlfor="serviço"> O que você procura?</label>

                        <input type="text" id="serviço" name="serviço" placeholder="Limpeza, manutenção, mudança..." required />
                    </form>

                    <form>
                        <label htmlfor="local"> Onde precisa do serviço?</label>

                        <input type="text" id="local" name="local" placeholder="Rua, bairro, cidade..." required />
                    </form>

                    <div className={Styles.buscar_empresa}>
                        <button className={Styles.empresa} type="submit">Buscar empresas ↗</button>
                    </div>

                </div>

            </section>


            <section className={Styles.buscar_empresas}>

                <div className={Styles.servicos}>
                    <a href='#' className={Styles.gerais}>Todas</a>
                    <a href='#' className={Styles.gerais}>Limpeza</a>
                    <a href='#' className={Styles.gerais}>Manutenção</a>
                    <a href='#' className={Styles.gerais}>Mudança</a>
                </div>

                <div className={Styles.servicos2}>
                    <div className={Styles.limpeza}>
                        <div className={Styles.limpeza_img}>
                            <img src={Limpeza} alt="Imagem de uma mulher limpando uma casa" />
                        </div>

                        <div className={Styles.limpeza_text}>
                            <h3 className={Styles.h3_limpeza}>01 / EMPRESA · LIMPEZA</h3>

                            <h2 className={Styles.h2_limpeza}>Casa em Dia Serviços</h2>

                            <p className={Styles.p_limpeza}>
                                Limpeza residencial e pós-mudança. Atendimento em São Paulo e região.
                            </p>

                        </div>
                        <button className={Styles.conhecer}>Conhecer a empresa ↗</button>


                    </div>

                    <div className={Styles.manutencao}>
                        <div className={Styles.limpeza_img}>
                            <img src={Manutenção} alt="Objetos essenciais de manutenção" />
                        </div>

                        <div className={Styles.limpeza_text}>
                            <h3 className={Styles.h3_limpeza}>02 / EMPRESA · MANUTENÇÃO</h3>

                            <h2 className={Styles.h2_limpeza}>Liga & Resolve</h2>

                            <p className={Styles.p_limpeza}>
                                Pequenos reparos e cuidados para deixar a casa funcionando.
                            </p>

                        </div>
                        <button className={Styles.conhecer}>Conhecer a empresa ↗</button>


                    </div>
                    <div className={Styles.mudanca}>
                        <div className={Styles.limpeza_img}>
                            <img src={Mudança} alt="Imagem de uma mulher com objetos de mudança" />
                        </div>

                        <div className={Styles.limpeza_text}>
                            <h3 className={Styles.h3_limpeza}>03 / EMPRESA · MUDANÇAS</h3>

                            <h2 className={Styles.h2_limpeza}>Mudaê Transportes</h2>

                            <p className={Styles.p_limpeza}>
                                Transporte e apoio para levar seu próximo capítulo para outro endereço.
                            </p>

                        </div>
                        <button className={Styles.conhecer}>Conhecer a empresa ↗</button>

                    </div>


                </div>



            </section>

            <section className={Styles.divulgacao}>
                <div className={Styles.divulgacao_h2}>
                    <h2 className={Styles.h2_divulgacao}>
                        Vai contratar? Combine os detalhes.
                    </h2>

                    <p className={Styles.p_divulgacao}>
                        Converse sobre o escopo, a região, a disponibilidade e o valor antes de decidir.
                    </p>
                </div>

                <div className={Styles.divulgacao_botao}>
                    <button className={Styles.divulgacao_button}>Conhecer Casa em Dia ↗</button>
                </div>

            </section>



            <Footer />
        </main>
    )
}

export default Marketplace