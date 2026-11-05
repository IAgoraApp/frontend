import { useEffect, useRef } from 'react';
import { ArrowLeft } from 'lucide-react';
import classes from '../routineClasses';

export default function RoutineWorkspace({
  entry,
  active,
  onBack,
  backLabel = 'Minha rotina',
  children,
}) {
  const ref = useRef(null);

  useEffect(() => {
    if (!active) return;
    window.scrollTo({ top: 0, behavior: 'instant' });
    ref.current.querySelector('h1')?.focus({ preventScroll: true });
  }, [entry.key, active]);

  return (
    <section
      ref={ref}
      className={classes.workspace}
      data-page-kind={entry.type}
      aria-labelledby={`routine-modal-${entry.key}`}
    >
      <button type='button' className={classes.backButton} onClick={onBack}>
        <ArrowLeft size={18} aria-hidden='true' /> {backLabel}
      </button>
      {children}
    </section>
  );
}
