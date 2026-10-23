import { Header, Footer } from '../components'
import Styles from '../styles/meuperfil.module.css'
import Foto from '../assets/images/fotoperfil.png'
import Frase from '../assets/images/frase.png'
import Mulher1 from '../assets/images/morarsozinho.png'
import Homem1 from '../assets/images/morosozinho.png'


export default function MeuPerfil() {
    return (
        <main>
            <Header />

            <section className={Styles.meuperfil}>

                <div className={Styles.foto_perfil}>
                    <div className={Styles.informacoes}>
                        <p className={Styles.cara}>
                            SUA CARA, SUA HISTÓRIA
                        </p>
                        <div className={Styles.img_perfil}>
                            <img src={Foto} alt="Foto de perfil" />
                        </div>

                        <h3 className={Styles.suafoto}>
                            Sua foto
                        </h3>

                        <p className={Styles.personalize}>
                            Um detalhe só seu. Personalize quando quiser.
                        </p>

                        <div className={Styles.adicionarfoto}>
                            <button className={Styles.botaofoto}>Adicionar foto  ↗</button>
                        </div>
                    </div>
                </div>

                <div className={Styles.informacao_usuario}>
                    <h3 className={Styles.suas_informacoes}>
                        SUAS INFORMAÇÕES
                    </h3>

                    <h2 className={Styles.seujeito}>
                        Tudo no seu jeito.
                    </h2>

                    <p className={Styles.atualizedados}>
                        Atualize os dados que aparecem na sua conta Iagora.
                    </p>

                    <div className={Styles.dados_usuario}>

                        <form>
                            <label htmlfor="nome"> Nome?</label>

                            <input type="text" id="nome" name="nome" placeholder="Como podemos te chamar?" required />
                        </form>

                        <form>
                            <label htmlfor="email"> E-mail</label>

                            <input type="email" id="email" name="email" placeholder="seuemail@exemplo.com" required />
                        </form>

                    </div>

                    <div className={Styles.msg_dados}>
                        <p className={Styles.msg}>
                            Seus dados ficam no seu perfil e podem ser atualizados.
                        </p>
                    </div>

                    <div className={Styles.dados_usuario2}>

                        <button className={Styles.botaoalteracoes} type="submit">
                            <p className={Styles.pbotaoalteracoes}>
                                Salvar alterações  ↗
                            </p>

                        </button>

                        <div className={Styles.img_frase}>
                            <img src={Frase} alt="Imagem de uma frase" />
                        </div>

                    </div>
                </div>

            </section>

            <section className={Styles.momento}>

                <div className={Styles.momento_frase}>
                    <h3 className={Styles.momento_h3}>
                        PERSONALIZE SUA JORNADA.
                    </h3>

                    <h2 className={Styles.momento_h2}>
                        Em que momento você está?
                    </h2>

                    <p className={Styles.momento_p1}>
                        Você pode mudar essa escolha depois. O Iagora acompanha seu ritmo.
                    </p>
                </div>

                <div className={Styles.momento_img}>

                    <div className={Styles.momento_cards}>
                        <div className={Styles.momento_card1}>

                            <div className={Styles.momento_img1}>
                                <img src={Mulher1} />
                            </div>
                            <div className={Styles.momento_img1_text}>
                                <h3 className={Styles.momento_h3}>
                                    Quero morar sozinho
                                </h3>

                                <p className={Styles.momento_p2}>
                                    Planejar os gastos, encontrar uma casa e se preparar para a mudança.
                                </p>
                            </div>

                        </div>

                        <div className={Styles.momento_card2}>
                            <div className={Styles.momento_img2}>
                                <img src={Homem1} />
                            </div>
                            <div className={Styles.momento_img2_text}>
                                <h4 className={Styles.momento_h4}>
                                    Quero morar sozinho
                                </h4>

                                <p className={Styles.momento_p3}>
                                    Manter a casa, organizar a rotina e resolver problemas do dia a dia.
                                </p>
                            </div>
                        </div>

                    </div>

                </div>
                <div className={Styles.momento_p4}>
                    <p className={Styles.momento_p4_text}>
                        A escolha mostrada aqui é ilustrativa e ainda não está salva.
                    </p>
                </div>
            </section>


            <Footer />
        </main>
    )
}