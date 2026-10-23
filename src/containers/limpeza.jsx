import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import HouseholdLayout from '../components/Household/layout';
import HeroSection from '../components/Household/heroSection';
import RotinaSection from '../components/Limpeza/rotinaSection';
import KitSection from '../components/Limpeza/kitDialog';
import { cleaningHero, cleaningCadences } from '../data/limpeza';
import { useAppStore } from '../store/useAppStore';
import { today } from '../utils/format';

export default function Limpeza() {
  const [params, setParams] = useSearchParams();
  const [status, setStatus] = useState('');
  const cadence = cleaningCadences.some(
    item => item.id === params.get('frequencia')
  )
    ? params.get('frequencia')
    : 'dia';

  function saveRoutine() {
    const selected = cleaningCadences.find(item => item.id === cadence);
    const { data, addCleaningTasks } = useAppStore.getState();
    const items = [
      ...selected.items,
      ...data.cleaningCustom.filter(item => item.cadence === cadence),
    ];
    addCleaningTasks(
      items.map(item => ({
        title: item.title,
        cleaningId: item.id,
        date: today(),
        time: '09:00',
        category: 'Limpeza',
        frequency: { dia: 'Diária', semana: 'Semanal', mes: 'Mensal' }[cadence],
        days: [String(new Date().getDay())],
        done: false,
        reminder: true,
      }))
    );
    setStatus(
      'Atividades disponíveis em Minha rotina. Lá você pode ajustar dias, horários e frequência.'
    );
    document
      .getElementById('rotina-limpeza')
      .scrollIntoView({ block: 'start' });
  }

  return (
    <HouseholdLayout title='Limpeza'>
      <HeroSection
        {...cleaningHero}
        cleaning
        action={{ label: 'Levar para minha rotina', onClick: saveRoutine }}
      />
      <RotinaSection
        cadence={cadence}
        status={status}
        onCadenceChange={value => {
          setStatus('');
          setParams(
            current => {
              const next = new URLSearchParams(current);
              next.set('frequencia', value);
              return next;
            },
            { preventScrollReset: true }
          );
        }}
      />
      <KitSection />
    </HouseholdLayout>
  );
}
