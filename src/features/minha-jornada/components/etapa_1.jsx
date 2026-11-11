import { useState } from 'react';
import Styles from '../styles/Etapa1.module.css';
import jornadaEtapas from '../data/jornadaEtapas.json';

function EtapaJornada({ etapaAtual, onChange }) {
  const etapa = jornadaEtapas.stages.find((item) => item.id === etapaAtual);

  if (!etapa) return null;

  return (
    <section className={Styles.Etapa1}>
      <div className={Styles.Titulo}>
        <button
          type="button"
          className={Styles.voltar}
          onClick={() => onChange(null)}
        >
          ← Voltar
        </button>

        <div className={Styles.CaixaLaranja}>
          <h3>{jornadaEtapas.eyebrow}</h3>
        </div>

        <h2>{etapa.title}</h2>
        <p>{etapa.subtitle}</p>
      </div>

      <div className={Styles.containerEtapa1}>
        <div className={Styles.left}>
          <div className={Styles.top}>
            <form>
              {etapa.tasks.map((task, index) => (
                <div className={Styles.item1} key={`${etapa.id}-${index}`}>
                  <input
                    type="checkbox"
                    name={`etapa-${etapa.id}-item-${index}`}
                    id={`etapa-${etapa.id}-item-${index}`}
                  />
                  <label htmlFor={`etapa-${etapa.id}-item-${index}`}>
                    <h3>{task.title}</h3>
                    <p>{task.description}</p>
                  </label>
                </div>
              ))}
            </form>
          </div>

          <div className={Styles.bottom_btns}>
            <button type="button" className={Styles.btnLaranja}>
              {etapa.actionLabel}
            </button>
            <button type="button" className={Styles.btnNormal}>
              Concluir etapa
            </button>
            <button type="button" className={Styles.btnNormal}>
              Ver minhas pendências
            </button>
          </div>
        </div>

        <aside className={Styles.right}>
          <div className={Styles.opcoes}>
            <h3>{jornadaEtapas.journeyTitle}</h3>

            {jornadaEtapas.stages.map((item) => (
              <button
                type="button"
                key={item.id}
                className={item.id === etapaAtual ? Styles.opcao1 : ''}
                aria-current={item.id === etapaAtual ? 'step' : undefined}
                onClick={() => onChange(item.id)}
              >
                {item.number} {item.navTitle}
              </button>
            ))}
          </div>

          <div className={Styles.textos}>
            <h3>Um foco para esta etapa</h3>
            <p>{etapa.focus}</p>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default EtapaJornada;
