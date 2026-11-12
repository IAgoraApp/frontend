import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { BotaoFecharRotina } from './routineUi';
import classesRotina from '../routineClasses';

export default function ModalRotina({
  children,
  aoFechar,
  aoVoltar,
  chaveModal,
  idTitulo,
  largo = false,
}) {
  const referencia = useRef(null);
  const rolagemRef = useRef(null);

  useEffect(() => {
    const dialogo = referencia.current;
    const focoAnterior = document.activeElement;
    const estouroAnterior = document.body.style.overflow;
    const preenchimentoAnterior = document.body.style.paddingRight;
    const larguraBarra = window.innerWidth - document.documentElement.clientWidth;
    const preenchimento =
      parseFloat(getComputedStyle(document.body).paddingRight) || 0;
    dialogo.showModal();
    document.body.style.overflow = 'hidden';
    if (larguraBarra) {
      document.body.style.paddingRight = `${preenchimento + larguraBarra}px`;
    }
    return () => {
      dialogo.close();
      document.body.style.overflow = estouroAnterior;
      document.body.style.paddingRight = preenchimentoAnterior;
      if (focoAnterior?.isConnected) {
        focoAnterior.focus({ preventScroll: true });
      }
    };
  }, []);

  useEffect(() => {
    const dialogo = referencia.current;
    rolagemRef.current.scrollTop = 0;
    dialogo
      .querySelector('[data-modal-ativo="true"] h2')
      ?.focus({ preventScroll: true });
  }, [chaveModal]);

  return createPortal(
    <dialog
      ref={referencia}
      className={`${classesRotina.escopo} ${classesRotina.modal} ${largo ? classesRotina.modalLargo : ''}`}
      data-visao='modal'
      aria-labelledby={idTitulo}
      onCancel={evento => {
        evento.preventDefault();
        aoFechar();
      }}
      onKeyDown={evento => {
        if (evento.key !== 'Tab') return;
        const dialogo = evento.currentTarget;
        const controles = [
          ...dialogo.querySelectorAll(
            'button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), a[href], [tabindex="0"]'
          ),
        ].filter(elemento => elemento.getClientRects().length > 0);
        const primeiro = controles[0];
        const ultimo = controles.at(-1);
        if (evento.shiftKey && document.activeElement === primeiro) {
          evento.preventDefault();
          ultimo?.focus();
        } else if (!evento.shiftKey && document.activeElement === ultimo) {
          evento.preventDefault();
          primeiro?.focus();
        }
      }}
      onClick={evento => {
        if (evento.target !== evento.currentTarget) return;
        const limites = evento.currentTarget.getBoundingClientRect();
        if (
          evento.clientX < limites.left ||
          evento.clientX > limites.right ||
          evento.clientY < limites.top ||
          evento.clientY > limites.bottom
        ) {
          aoFechar();
        }
      }}
    >
      <div className={classesRotina.barraModal}>
        {aoVoltar && (
          <button
            type='button'
            className={classesRotina.voltarModal}
            onClick={aoVoltar}
          >
            ← Voltar
          </button>
        )}
        <BotaoFecharRotina aoClicar={aoFechar} />
      </div>
      <div
        ref={rolagemRef}
        className={classesRotina.rolagemModal}
        data-rolagem-modal-rotina
      >
        {children}
      </div>
    </dialog>,
    document.body
  );
}
