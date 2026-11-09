import Styles from '../styles/Etapa1.module.css';

function Etapa1() {
  return (
    <section className={Styles.Etapa1}>
      <div className={Styles.Titulo}>
        <a href='#'>Voltar</a>

        <div className={Styles.CaixaLaranja}>
          <h3>ANTES DAS CHAVES</h3>
        </div>

        <h2>Seu plano.</h2>

        <p>Definir momento e prioridades.</p>
      </div>

      <div className={Styles.containerEtapa1}>
        <div className={Styles.left}>
          <div className={Styles.top}>
            <form>

              <div className={Styles.item1}>
                <input type='checkbox' name='item1' id='item1' />
                <label htmlFor='item1'>
                  <h3>Escolher seu momento</h3>
                  <p>Como você quer começar essa nova fase?</p>
                </label>
              </div>

              <div className={Styles.item1}>
                <input type='checkbox' name='item2' id='item2' />
                <label htmlFor='item2'>
                  <h3>Definir três prioridades</h3>
                  <p>Custo, localização ou espaço: o que vem primeiro?</p>
                </label>
              </div>

              <div className={Styles.item1}>
                <input type='checkbox' name='item3' id='item3' />
                <label htmlFor='item3'>
                  <h3>Escolher seu momento</h3>
                  <p>Como você quer começar essa nova fase?</p>
                </label>
              </div>

            </form>
          </div>

          <div className={Styles.bottom_btns}>
            <a href="#" className={Styles.btnLaranja}>Ajustar prioridades</a>
            <a href="#" className={Styles.btnNormal}>Concluir etapa</a>
            <a href="#" className={Styles.btnNormal}>Ver minhas pendências</a>
          </div>
        </div>


        <div className={Styles.right}>

            <div className={Styles.opcoes}>
                <h3>SEU CAMINHO ATÉ AS CHAVES</h3>

                <a href="#">01  Seu plano</a>
                <a href="#">02 Seu dinheiro</a>
                <a href="#">03 Seu canto</a>
                <a href="#">04  Sua mudança</a>
                <a href="#">05  Seu dia a dia</a>
            </div>

            <div className={Styles.textos}>
                <h3>Um foco para esta etapa</h3>
                <p>Suas prioridades ajudam a comparar escolhas. Elas não precisam ser definitivas.</p>
            </div>

        </div>
      </div>
    </section>
  );
}

export default Etapa1;
