import { useAppStore } from '../store/useAppStore';
import { lazy, Suspense } from 'react';

const Ledger = lazy(() => import('../components/Financas/ledger'));
const MovingPlan = lazy(() => import('../components/Financas/movingPlan'));

export default function FinancasA() {
  const profile = useAppStore(state => state.data.profile);
  return (
    <Suspense
      fallback={
        <p role='status' className='px-6 py-10 text-center'>
          Carregando suas finanças…
        </p>
      }
    >
      {profile === 'planejando' ? <MovingPlan /> : <Ledger />}
    </Suspense>
  );
}
