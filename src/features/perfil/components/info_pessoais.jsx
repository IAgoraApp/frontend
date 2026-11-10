import Styles from '../styles/info_pessoais.module.css'
export default function InfoPessoais({mudarView}) {
    return (
        <section className={Styles.informacao_usuario}>
            <div className={Styles.informacao_usuario1}>
                <a href='#' className={Styles.botao_voltar} onClick={() => mudarView(1)}>
                    <p className={Styles.pbotao_voltar}>
                        ← Voltar
                    </p>
                </a>

                <div className={Styles.suaconta}>
                    <p className={Styles.sua_conta}>
                        Sua conta
                    </p>
                </div>

                <h3 className={Styles.suas_informacoes}>
                    Informações pessoais.
                </h3>

                <p className={Styles.revise}>
                    Revise seus dados e preferências.
                </p>

            </div>

            <div className={Styles.dados_usuario2}>
                <div className={Styles.dados_usuario3}>


                    <div className={Styles.dados_usuario_form}>

                        <form>
                            <label htmlfor="nome"> Nome</label>

                            <input type="text" id="nome" name="nome" placeholder="Maria Silva" required />
                        </form>

                        <div className={Styles.dados_usuario_form2}>
                            <form>
                                <label htmlfor="email"> E-mail</label>

                                <input type="email" id="email" name="email" placeholder="mariasilva@exemplo.com" required />
                            </form>

                            <form>
                                <label htmlfor="cidade"> Cidade</label>

                                <input type="text" id="cidade" name="cidade" placeholder="São Paulo" required />
                            </form>

                        </div>

                        <div className={Styles.dados_usuario_botoes}>

                            <a href='#' className={Styles.botaoalteracoes}>
                                <p className={Styles.pbotaoalteracoes}>
                                    Salvar alterações
                                </p>
                            </a>

                            <a href='#' className={Styles.botaocancelar}>
                                <p className={Styles.pbotaoacancelar}>
                                    Cancelar
                                </p>
                            </a>
                        </div>
                    </div>
                </div>

                <div className={Styles.momento_user}>

                    <p className={Styles.momento_user_p1}>
                        SUA CONTA, DO SEU JEITO
                    </p>

                    <p className={Styles.momento_user_p2}>
                        Maria Silva
                    </p>

                    <div className={Styles.seumomento}>
                        <p className={Styles.momento_user_p3}>
                            Seu momento
                        </p>

                        <p className={Styles.momento_user_p4}>
                            Já moro sozinho
                        </p>
                    </div>

                    <div className={Styles.seucidade}>
                        <p className={Styles.momento_user_p5}>
                            Sua cidade
                        </p>

                        <p className={Styles.momento_user_p6}>
                            São Paulo, SP
                        </p>
                    </div>

                    <div className={Styles.alterar_momento}>
                        <a href='#' className={Styles.botaoalterar_momento}>
                            <p className={Styles.pbotaoalterar_momento}>
                                Alterar momento
                            </p>
                        </a>
                    </div>

                </div>




            </div>






        </section>
    )

}
