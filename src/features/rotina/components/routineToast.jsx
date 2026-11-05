import { useEffect } from 'react';
import { CloseButton } from './routineUi';
import classes from '../routineClasses';

export default function RoutineToast({ toast, onDismiss }) {
  useEffect(() => {
    const timer = window.setTimeout(onDismiss, toast.action ? 9000 : 5000);
    return () => window.clearTimeout(timer);
  }, [toast, onDismiss]);

  return (
    <div className={classes.toast} role='status' aria-live='polite'>
      <span>{toast.message}</span>
      {toast.action && (
        <button type='button' onClick={toast.action}>
          {toast.actionLabel ?? 'Desfazer'}
        </button>
      )}
      <CloseButton onClick={onDismiss} label='Dispensar aviso' />
    </div>
  );
}
