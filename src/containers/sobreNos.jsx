import Styles from '../styles/sobrenos.module.css';
import { Header } from '../components';
import ImagemGrupo from '../assets/images/imgGrupo.png';
import Gomes from '../assets/images/gomes.png';
import Fernando from '../assets/images/fernando.jpg';
import Joao from '../assets/images/joao.png';
import IconeLinkedin from '../assets/images/icone-linkedin.svg';
import IconeGithub from '../assets/images/icone-github.svg';


function SobreNos() {
  return (
    <main>
      <Header />
      <section className={Styles.section1}>
        <div className={Styles.div_sec1}>
          <h2>Sobre nós</h2>
          <div className={Styles.p}>
            <p>
              Morar sozinho ficou mais fácil com o <span>I Agora</span>!
            </p>
            <p>
              Reunimos em um só lugar tudo o que você precisa para dar os
              primeiros passos na vida independente: calculadoras, checklists,
              guias práticos, dicas de segurança e ajuda para encontrar
              profissionais. Menos complicação, mais autonomia.
            </p>
            <p>Sua vida independente começa aqui!</p>
          </div>
        </div>
      </section>

      <section className={Styles.section2}>
        <div className={Styles.div1_sec2}>
          <h2>Conheça nossa Equipe</h2>
          <img src={ImagemGrupo} alt='imagem grupo' />
        </div>

        <div className={Styles.container_cards}>
                <div className={Styles.card}>
                    <img className={Styles.aluno} src={Gomes} alt='foto do gabriel' />

                    <div className={Styles.textos}>
                        <div className={Styles.texto}>
                        <h3>Gabriel Prado</h3>
                        <p>Desenvolvedor Back-end e Vendas</p>
                        </div>
                        <div className={Styles.links}>
                        <img src={IconeGithub} alt='github' />
                        <img src={IconeLinkedin} alt='linkedin' />
                        </div>
                    </div>
                </div>

                <div className={Styles.card}>
                    <img className={Styles.aluno} src={Fernando} alt='foto do fernando' />

                    <div className={Styles.textos}>
                        <div className={Styles.texto}>
                            <h3>Gabriel Prado</h3>
                            <p>Desenvolvedor Back-end e Vendas</p>
                        </div>
                        <div className={Styles.links}>
                            <a href="#"><img src={IconeGithub} alt='github' /></a>
                            <a href="#"><img src={IconeLinkedin} alt='linkedin' /></a>
                        </div>
                    </div>
                </div>
                <div className={Styles.card}>
                    <img className={Styles.aluno} src={Joao} alt='foto do joao' />

                    <div className={Styles.textos}>
                        <div className={Styles.texto}>
                            <h3>Gabriel Prado</h3>
                            <p>Desenvolvedor Back-end e Vendas</p>
                        </div>
                        <div className={Styles.links}>
                            <a href="#"><img src={IconeGithub} alt='github' /></a>
                            <a href="#"><img src={IconeLinkedin} alt='linkedin' /></a>
                        </div>
                    </div>
                </div>
                <div className={Styles.card}>
                    <img className={Styles.aluno} src={Gomes} alt='foto do gabriel' />

                    <div className={Styles.textos}>
                        <div className={Styles.texto}>
                            <h3>Gabriel Prado</h3>
                            <p>Desenvolvedor Back-end e Vendas</p>
                        </div>
                        <div className={Styles.links}>
                            <a href="#"><img src={IconeGithub} alt='github' /></a>
                            <a href="#"><img src={IconeLinkedin} alt='linkedin' /></a>
                        </div>
                    </div>
                </div>
                <div className={Styles.card}>
                    <img className={Styles.aluno} src={Gomes} alt='foto do gabriel' />

                    <div className={Styles.textos}>
                        <div className={Styles.texto}>
                            <h3>Gabriel Prado</h3>
                            <p>Desenvolvedor Back-end e Vendas</p>
                        </div>
                        <div className={Styles.links}>
                            <a href="#"><img src={IconeGithub} alt='github' /></a>
                            <a href="#"><img src={IconeLinkedin} alt='linkedin' /></a>
                        </div>
                    </div>
                </div>
                <div className={Styles.card}>
                    <img className={Styles.aluno} src={Gomes} alt='foto do gabriel' />

                    <div className={Styles.textos}>
                        <div className={Styles.texto}>
                            <h3>Gabriel Prado</h3>
                            <p>Desenvolvedor Back-end e Vendas</p>
                        </div>
                        <div className={Styles.links}>
                            <a href="#"><img src={IconeGithub} alt='github' /></a>
                            <a href="#"><img src={IconeLinkedin} alt='linkedin' /></a>
                        </div>
                    </div>
                </div>
                <div className={Styles.card}>
                    <img className={Styles.aluno} src={Gomes} alt='foto do gabriel' />

                    <div className={Styles.textos}>
                        <div className={Styles.texto}>
                            <h3>Gabriel Prado</h3>
                            <p>Desenvolvedor Back-end e Vendas</p>
                        </div>
                        <div className={Styles.links}>
                            <a href="#"><img src={IconeGithub} alt='github' /></a>
                            <a href="#"><img src={IconeLinkedin} alt='linkedin' /></a>
                        </div>
                    </div>
                </div>
                <div className={Styles.card}>
                    <img className={Styles.aluno} src={Gomes} alt='foto do gabriel' />

                    <div className={Styles.textos}>
                        <div className={Styles.texto}>
                            <h3>Gabriel Prado</h3>
                            <p>Desenvolvedor Back-end e Vendas</p>
                        </div>
                        <div className={Styles.links}>
                            <a href="#"><img src={IconeGithub} alt='github' /></a>
                            <a href="#"><img src={IconeLinkedin} alt='linkedin' /></a>
                        </div>
                    </div>
                </div>
        </div>
      </section>
    </main>
  );
}

export default SobreNos;
