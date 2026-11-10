import Styles from '../styles/info_pessoais.module.css'
export default function InfoPessoais() {
    return (
        <section className={Styles.informacao_usuario}>
            <div className={Styles.informacao_usuario1}>
                <a href='#' className={Styles.botao_voltar}>
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
                    <p>
                        Momento do usuário
                    </p>
                </div>




            </div>






        </section>
    )

}
