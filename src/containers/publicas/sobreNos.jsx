import Styles from '../../styles/sobrenos.module.css';
import { Footer } from '../../components/shared';
import ImagemGrupo from '../../assets/images/imgGrupo.png';
import Gomes from '../../assets/images/gomes.png';
import Fernando from '../../assets/images/fernando.jpg';
import Joao from '../../assets/images/joao.png';
import Kaua from '../../assets/images/kaua.png';
import Igor from '../../assets/images/igor.jpg';
import Emily from '../../assets/images/emily.png';
import IconeLinkedin from '../../assets/images/icone-linkedin.svg';
import IconeGithub from '../../assets/images/icone-github.svg';
import Autonomia from '../../assets/images/autonomia.svg';
import Praticidade from '../../assets/images/praticidade.svg';
import Coracao from '../../assets/images/coracao.svg';

function SobreNos() {
  return (
    <main>
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
          {/* KAUÃ VITOR - CARD */}
          <div className={Styles.card}>
            <img className={Styles.aluno} src={Kaua} alt='foto do gabriel' />

            <div className={Styles.textos}>
              <div className={Styles.texto}>
                <h3>Kauã Vitor</h3>
                <p>Product Owner e Desenvolvedor Full-Stack</p>
              </div>
              <div className={Styles.links}>
                <a href='https://github.com/KauaRDESIGN' target='_blank'>
                  <img src={IconeGithub} alt='github' />
                </a>
                <a href='#'>
                  <img src={IconeLinkedin} alt='linkedin' />
                </a>
              </div>
            </div>
          </div>

          {/* JOÃO VITOR - CARD */}
          <div className={Styles.card}>
            <img className={Styles.aluno} src={Joao} alt='foto do joao' />

            <div className={Styles.textos}>
              <div className={Styles.texto}>
                <h3>João Vitor</h3>
                <p>Scrum Master e Desenvolvedor Back-end</p>
              </div>
              <div className={Styles.links}>
                <a href='https://github.com/joaovpr156' target='_blank'>
                  <img src={IconeGithub} alt='github' />
                </a>
                <a href='#'>
                  <img src={IconeLinkedin} alt='linkedin' />
                </a>
              </div>
            </div>
          </div>

          {/* GABRIEL GOMES - CARD */}
          <div className={Styles.card}>
            <img className={Styles.aluno} src={Gomes} alt='foto do gabriel' />

            <div className={Styles.textos}>
              <div className={Styles.texto}>
                <h3>Gabriel Prado</h3>
                <p>Desenvolvedor Back-end e Vendas</p>
              </div>
              <div className={Styles.links}>
                <a href='https://github.com/gomeszyk' target='_blank'>
                  <img src={IconeGithub} alt='github' />
                </a>
                <a href='#'>
                  <img src={IconeLinkedin} alt='linkedin' />
                </a>
              </div>
            </div>
          </div>

          {/* FERNANDO VIEIRA - CARD */}
          <div className={Styles.card}>
            <img
              className={Styles.aluno}
              src={Fernando}
              alt='foto do fernando'
            />

            <div className={Styles.textos}>
              <div className={Styles.texto}>
                <h3>Fernando Vieira</h3>
                <p>Designer UI/UX & Desenvolvedor Front End</p>
              </div>
              <div className={Styles.links}>
                <a href='https://github.com/euFehVieira' target='_blank'>
                  <img src={IconeGithub} alt='github' />
                </a>
                <a href='#'>
                  <img src={IconeLinkedin} alt='linkedin' />
                </a>
              </div>
            </div>
          </div>

          {/* EMILY BATISTA - CARD */}
          <div className={Styles.card}>
            <img className={Styles.aluno} src={Emily} alt='foto da Emily' />

            <div className={Styles.textos}>
              <div className={Styles.texto}>
                <h3>Emily Batista</h3>
                <p>Desenvolvedor Back-end e Vendas</p>
              </div>
              <div className={Styles.links}>
                <a href='https://github.com/emilybatista123' target='_blank'>
                  <img src={IconeGithub} alt='github' />
                </a>
                <a href='#'>
                  <img src={IconeLinkedin} alt='linkedin' />
                </a>
              </div>
            </div>
          </div>

          {/* EMILLY BARAUNA - CARD */}
          <div className={Styles.card}>
            <img className={Styles.aluno} src={Gomes} alt='foto do gabriel' />

            <div className={Styles.textos}>
              <div className={Styles.texto}>
                <h3>Emilly Barauna</h3>
                <p>Desenvolvedor Back-end e Vendas</p>
              </div>
              <div className={Styles.links}>
                <a href='https://github.com/Emilly-Barauna' target='_blank'>
                  <img src={IconeGithub} alt='github' />
                </a>
                <a href='#'>
                  <img src={IconeLinkedin} alt='linkedin' />
                </a>
              </div>
            </div>
          </div>

          {/* DAVI RAMOS - CARD */}
          <div className={Styles.card}>
            <img className={Styles.aluno} src={Gomes} alt='foto do gabriel' />

            <div className={Styles.textos}>
              <div className={Styles.texto}>
                <h3>Davi Ramos</h3>
                <p>Desenvolvedor Back-end e Vendas</p>
              </div>
              <div className={Styles.links}>
                <a href='https://github.com/davizin-ra' target='_blank'>
                  <img src={IconeGithub} alt='github' />
                </a>
                <a href='#'>
                  <img src={IconeLinkedin} alt='linkedin' />
                </a>
              </div>
            </div>
          </div>

          {/* IGOR VASCONCELOS - CARD */}
          <div className={Styles.card}>
            <img className={Styles.aluno} src={Igor} alt='foto do Igor' />

            <div className={Styles.textos}>
              <div className={Styles.texto}>
                <h3>Igor Vasconcelos</h3>
                <p>Desenvolvedor Back-end e Vendas</p>
              </div>
              <div className={Styles.links}>
                <a
                  href='https://github.com/igorvasconcelos11-web '
                  target='_blank'
                >
                  <img src={IconeGithub} alt='github' />
                </a>
                <a href='#'>
                  <img src={IconeLinkedin} alt='linkedin' />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={Styles.section3}>
        <div className={Styles.div_left}>
          <h2>Nossa Missão</h2>
          <p>
            Nossa missão é ser a principal plataforma de apoio aos jovens que
            desejam conquistar a independência, tornando a experiência de morar
            sozinho mais simples, acessível e segura.
          </p>
        </div>
        <div className={Styles.div_right}></div>
      </section>

      <section className={Styles.section4}>
        <div className={Styles.div_left}></div>

        <div className={Styles.div_right}>
          <h2>Nossa Visão</h2>
          <p>
            Ser referência para jovens que buscam conquistar sua independência e
            viver essa nova fase com mais confiança e tranquilidade.
          </p>
        </div>
      </section>

      <section className={Styles.section5}>
        <h2>Nossos Valores</h2>

        <div className={Styles.sec5_cards}>
          <div className={Styles.sec5_card}>
            <div className={Styles.titulo_card}>
              <img src={Autonomia} alt='icone autonomia' />
              <h3>Autonomia</h3>
            </div>

            <p>Conquiste sua liberdade para morar sozinho.</p>
          </div>

          <div className={Styles.sec5_card}>
            <div className={Styles.titulo_card}>
              <img src={Praticidade} alt='icone praticidade' />
              <h3>Praticidade</h3>
            </div>

            <p>Resolva os desafios do dia a dia em um só lugar.</p>
          </div>

          <div className={Styles.sec5_card}>
            <div className={Styles.titulo_card}>
              <img src={Coracao} alt='icone coração' />
              <h3>Acolhimento</h3>
            </div>

            <p>Faça escolhas com mais confiança e tranquilidade.</p>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}

export default SobreNos;
