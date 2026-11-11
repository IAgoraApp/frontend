import Styles from '../styles/sobcontrole.module.css'
import SeuJeito from '../assets/sobcontrole.png'
export default function SobControle({ mudarView }) {
    return (
        <section className={Styles.sobcontrole}>
            <div className={Styles.div1}>
                <div className={Styles.div1_esquerda}>

                    <div className={Styles.div1_voltar}>
                        <a href='#' className={Styles.div1_esquerda_link} onClick={() => mudarView(1)}>
                            ← Voltar
                        </a>
                    </div>

                    <div className={Styles.suaconta_sob}>
                        <p className={Styles.sua_conta_sob}>
                            Sua conta
                        </p>
                    </div>

                    <h3 className={Styles.suas_informacoes_sob}>
                        Sua conta, sob seu controle.
                    </h3>

                    <p className={Styles.revise_sob}>
                        Revise seus dados e preferências.
                    </p>

                </div>

                <div className={Styles.div1_direita}>
                    <img src={SeuJeito} alt="Imagem de uma pessoa segurando um celular" className={Styles.div1_direita_img} />
                </div>

            </div>

            <div className={Styles.div2}>
                <div className={Styles.div2_cards}>
                    <div className={Styles.div2_seta}>
                        ↗
                    </div>

                    <div className={Styles.div2_text}>
                        <h3 className={Styles.div2_text_h3}>
                            Informações pessoais
                        </h3>

                        <p className={Styles.div2_text_p}>
                            Abrir preferências
                        </p>
                    </div>

                    <div className={Styles.div2_detalhes}>
                        <a href='#' className={Styles.div2_text_link}>

                            Ver detalhes ↗

                        </a>
                    </div>
                </div>

                <div className={Styles.div2_cards}>
                    <div className={Styles.div2_seta}>
                        ↗
                    </div>

                    <div className={Styles.div2_text}>
                        <h3 className={Styles.div2_text_h3}>
                            Foto de perfil
                        </h3>

                        <p className={Styles.div2_text_p}>
                            Abrir preferências
                        </p>
                    </div>

                    <div className={Styles.div2_detalhes}>
                        <a href='#' className={Styles.div2_text_link}>

                            Ver detalhes ↗

                        </a>
                    </div>
                </div>

                <div className={Styles.div2_cards}>
                    <div className={Styles.div2_seta}>
                        ↗
                    </div>

                    <div className={Styles.div2_text}>
                        <h3 className={Styles.div2_text_h3}>
                            Senha e acesso
                        </h3>

                        <p className={Styles.div2_text_p}>
                            Abrir preferências
                        </p>
                    </div>

                    <div className={Styles.div2_detalhes}>
                        <a href='#' className={Styles.div2_text_link}>

                            Ver detalhes ↗

                        </a>
                    </div>
                </div>

                <div className={Styles.div2_cards}>
                    <div className={Styles.div2_seta}>
                        ↗
                    </div>

                    <div className={Styles.div2_text}>
                        <h3 className={Styles.div2_text_h3}>
                            Seu momento
                        </h3>

                        <p className={Styles.div2_text_p}>
                            Abrir preferências
                        </p>
                    </div>

                    <div className={Styles.div2_detalhes}>
                        <a href='#' className={Styles.div2_text_link}>

                            Ver detalhes ↗

                        </a>
                    </div>
                </div>

                <div className={Styles.div2_cards}>
                    <div className={Styles.div2_seta}>
                        ↗
                    </div>

                    <div className={Styles.div2_text}>
                        <h3 className={Styles.div2_text_h3}>
                            Notificações
                        </h3>

                        <p className={Styles.div2_text_p}>
                            Abrir preferências
                        </p>
                    </div>

                    <div className={Styles.div2_detalhes}>
                        <a href='#' className={Styles.div2_text_link}>

                            Ver detalhes ↗

                        </a>
                    </div>
                </div>

                <div className={Styles.div2_cards}>
                    <div className={Styles.div2_seta}>
                        ↗
                    </div>

                    <div className={Styles.div2_text}>
                        <h3 className={Styles.div2_text_h3}>
                            Privacidade
                        </h3>

                        <p className={Styles.div2_text_p}>
                            Abrir preferências
                        </p>
                    </div>

                    <div className={Styles.div2_detalhes}>
                        <a href='#' className={Styles.div2_text_link}>

                            Ver detalhes ↗

                        </a>
                    </div>
                </div>

                <div className={Styles.div2_cards}>
                    <div className={Styles.div2_seta}>
                        ↗
                    </div>

                    <div className={Styles.div2_text}>
                        <h3 className={Styles.div2_text_h3}>
                            Minha residência
                        </h3>

                        <p className={Styles.div2_text_p}>
                            Abrir preferências
                        </p>
                    </div>

                    <div className={Styles.div2_detalhes}>
                        <a href='#' className={Styles.div2_text_link}>

                            Ver detalhes ↗

                        </a>
                    </div>
                </div>

                <div className={Styles.div2_cards}>
                    <div className={Styles.div2_seta}>
                        ↗
                    </div>

                    <div className={Styles.div2_text}>
                        <h3 className={Styles.div2_text_h3}>
                            Excluir minha conta
                        </h3>

                        <p className={Styles.div2_text_p}>
                            Abrir preferências
                        </p>
                    </div>

                    <div className={Styles.div2_detalhes}>
                        <a href='#' className={Styles.div2_text_link}>

                            Ver detalhes ↗

                        </a>
                    </div>
                </div>
            </div>

            <div className={Styles.sairdaconta}>
                <a href='#' className={Styles.sairdaconta_link}>
                    <p className={Styles.sairdaconta_p}>
                        Sair da conta
                    </p>
                </a>
            </div>

        </section>
    )
}