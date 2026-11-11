import Styles from '../styles/Conteudo.module.css'
import Caderno from '../assets/caderno.png'

function Conteudo(){
    return(
        <section className={Styles.Conteudo}>
            <div className={Styles.div_left}>
                <div className={Styles.textos}>
                    <h3>MINHA JORNADA</h3>
                    <h2>Seu progresso rumo à independência.</h2>
                    <p>
                        52% concluído · 3 metas ativas · 2 atividades desta semana. Continue organizando reserva inicial, lista do essencial e pesquisa de bairros. 
                    </p>

                    <a href="#">Ver progresso</a>
                </div>
                <img src={Caderno} alt="img caderno" />
            </div>

            <div className={Styles.div_right}>
                <div className={Styles.img}>

                </div>
                <div className={Styles.textos_abaixo}>
                    <h3>PARA O SEU MOMENTO</h3>
                    <h2>Recomendações feitas para a sua fase.</h2>
                    <p>
                        Veja lembretes de metas, atividades e conteúdos personalizados para planejar a mudança com mais segurança.
                    </p>
                </div>
            </div>
        </section>
    )
}

export default Conteudo