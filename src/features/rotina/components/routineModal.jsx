import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { CloseButton } from './routineUi';
import classes from '../routineClasses';

export default function RoutineModal({
  children,
  onClose,
  onBack,
  modalKey,
  titleId,
  wide = false,
}) {
  const ref = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    const dialog = ref.current;
    const previouslyFocused = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    const previousPadding = document.body.style.paddingRight;
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    const padding =
      parseFloat(getComputedStyle(document.body).paddingRight) || 0;
    dialog.showModal();
    document.body.style.overflow = 'hidden';
    if (scrollbarWidth)
      document.body.style.paddingRight = `${padding + scrollbarWidth}px`;
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPadding;
      if (previouslyFocused?.isConnected)
        previouslyFocused.focus({ preventScroll: true });
    };
  }, []);

  useEffect(() => {
    const dialog = ref.current;
    scrollRef.current.scrollTop = 0;
    dialog
      .querySelector('[data-active-modal="true"] h2')
      ?.focus({ preventScroll: true });
  }, [modalKey]);

  return createPortal(
    <dialog
      ref={ref}
      className={`${classes.scope} ${classes.modal} ${wide ? classes.wideModal : ''}`}
      data-view='modal'
      aria-labelledby={titleId}
      onCancel={event => {
        event.preventDefault();
        onClose();
      }}
      onKeyDown={event => {
        if (event.key !== 'Tab') return;
        const dialog = event.currentTarget;
        const controls = [
          ...dialog.querySelectorAll(
            'button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), a[href], [tabindex="0"]'
          ),
        ].filter(element => element.getClientRects().length > 0);
        const first = controls[0];
        const last = controls.at(-1);
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }}
      onClick={event => {
        if (event.target !== event.currentTarget) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        if (
          event.clientX < bounds.left ||
          event.clientX > bounds.right ||
          event.clientY < bounds.top ||
          event.clientY > bounds.bottom
        )
          onClose();
      }}
    >
      <div className={classes.modalChrome}>
        {onBack && (
          <button type='button' className={classes.modalBack} onClick={onBack}>
            ← Voltar
          </button>
        )}
        <CloseButton onClick={onClose} />
      </div>
      <div
        ref={scrollRef}
        className={classes.modalScroll}
        data-routine-modal-scroll
      >
        {children}
      </div>
    </dialog>,
    document.body
  );
}
