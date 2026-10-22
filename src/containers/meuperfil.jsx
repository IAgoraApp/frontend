import { Header, Footer } from '../components'
import Styles from '../styles/meuperfil.module.css'
import Foto from '../assets/images/fotoperfil.png'
import Frase from '../assets/images/frase.png'

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

            <Footer />
        </main>
    )
}